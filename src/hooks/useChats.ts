import { API_BASE_URL } from "@/routes/routes";
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";

// Tipos baseados na documentação da API
interface ChatMessage {
  id: number;
  messageId: string;
  chatId: number;
  fromMe: boolean;
  text: string;
  timestamp: string;
  createdAt: string;
}

interface Chat {
  id: number;
  wahaId: string;
  name: string;
  phone: string;
  lastMessage: string;
  status: "standby" | "em_atendimento" | "resolvido" | "encerrado";
  isActive: boolean;
  fromMe: boolean;
  lastMessageTime: string;
  createdAt: string;
  updatedAt: string;
  atendenteId?: string;
  messages: ChatMessage[];
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const getAuthHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingChatId, setLoadingChatId] = useState<number | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  
  // Refs para controle
  const chatsRef = useRef<Chat[]>([]);
  const pollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFetchingRef = useRef<Set<number>>(new Set());

  /** BUSCAR TODOS OS CHATS */
  const fetchChats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/chats`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error("Erro ao buscar chats");

      const data: ApiResponse<Chat[]> = await response.json();

      if (data.success && data.data) {
        const sortedChats = data.data.sort(
          (a, b) =>
            new Date(b.lastMessageTime).getTime() -
            new Date(a.lastMessageTime).getTime()
        );
        setChats(sortedChats);
      }
    } catch (error) {
      console.error("Erro ao buscar chats:", error);
      toast.error("Erro ao carregar chats");
    } finally {
      setLoading(false);
    }
  }, []);

  // sincroniza o ref com o estado atual de chats
  // usamos um efeito separado para manter o ref atualizado
  useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);

  /** BUSCAR CHAT ESPECÍFICO */
  const fetchChatById = useCallback(async (id: number) => {
    try {
      // Se já está buscando, ignora
      if (isFetchingRef.current.has(id)) {
        return;
      }

      // Marca que está buscando
      isFetchingRef.current.add(id);
      setLoadingChatId(id);

      const response = await fetch(`${API_BASE_URL}/chats/${id}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error("Erro ao buscar chat");

      const data: ApiResponse<Chat> = await response.json();

        if (data.success && data.data) {
          // Obter o chat existente a partir do ref (poderá ter mensagens locais)
          const existingChat = chatsRef.current
            ? chatsRef.current.find((c) => c.id === id)
            : undefined;

          // Mescla mensagens retornadas com as já existentes para evitar sobrescrever
          const existingMessages = existingChat?.messages || [];
          const incomingMessages = data.data.messages || [];

          const map = new Map<string | number, ChatMessage>();
          existingMessages.forEach((m) => map.set(m.messageId || m.id, m));
          incomingMessages.forEach((m) => map.set(m.messageId || m.id, m));

          const mergedMessages = Array.from(map.values()).sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );

          const chatWithMergedMessages = {
            ...data.data,
            messages: mergedMessages,
          };

          // Atualiza selectedChat apenas se o chat selecionado atualmente for o mesmo id
          setSelectedChat((prev) => (prev && prev.id !== id ? prev : chatWithMergedMessages));
          setChats((prev) =>
            prev.map((chat) => (chat.id === chatWithMergedMessages.id ? chatWithMergedMessages : chat))
          );
        }
      } catch (error) {
        console.error("Erro ao buscar chat:", error);
        toast.error("Erro ao carregar conversa");
      } finally {
        setLoadingChatId((prev) => (prev === id ? null : prev));
        // Limpa flag de busca depois de 5 segundos para evitar overfetching
        setTimeout(() => {
          isFetchingRef.current.delete(id);
        }, 5000);
      }
  }, []);

  /** ENVIAR MENSAGEM */
  const sendMessage = useCallback(
    async (chatId: number, text: string, fromMe: boolean) => {
      if (!text.trim()) return false;
      // Encontrar chat localmente
      const chat = chats.find((c) => c.id === chatId) || selectedChat;
      if (!chat) {
        toast.error("Chat não encontrado");
        return false;
      }

      // Cria mensagem temporária (otimista)
      const messageId = `${chat.phone}_${Date.now()}`;
      const now = new Date().toISOString();
      const tempMsg: ChatMessage = {
        id: -Date.now(),
        messageId,
        chatId,
        fromMe: fromMe ?? true,
        text: text.trim(),
        timestamp: now,
        createdAt: now,
      };

      try {
        setSendingMessage(true);

        // Atualiza estado localmente de forma otimista
        setSelectedChat((prev) =>
          prev && prev.id === chatId
            ? {
                ...prev,
                messages: [...(prev.messages || []), tempMsg],
                lastMessage: tempMsg.text,
                lastMessageTime: tempMsg.timestamp,
              }
            : prev
        );

        setChats((prev) =>
          prev.map((chatItem) =>
            chatItem.id === chatId
              ? {
                  ...chatItem,
                  lastMessage: tempMsg.text,
                  lastMessageTime: tempMsg.timestamp,
                }
              : chatItem
          )
        );

        const response = await fetch(
          `${API_BASE_URL}/chats/${chatId}/message`,
          {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({
              text: text.trim(),
              messageId,
              fromMe: fromMe ?? true,
            }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Response error:", errorText);
          throw new Error(`Erro ao enviar mensagem: ${response.status}`);
        }

        const data: ApiResponse<{ message: ChatMessage; chat: Chat }> =
          await response.json();
        if (data.success && data.data) {
          const { chat: returnedChat } = data.data;

          // Mesclar mensagens retornadas com as existentes para não perder histórico
          const existingMessages =
            selectedChat && selectedChat.id === chatId
              ? selectedChat.messages || []
              : chats.find((c) => c.id === chatId)?.messages || [];
          const incomingMessages = returnedChat.messages || [];
          const map = new Map<string | number, ChatMessage>();
          existingMessages.forEach((m) => map.set(m.messageId || m.id, m));
          incomingMessages.forEach((m) => map.set(m.messageId || m.id, m));

          const mergedMessages = Array.from(map.values()).sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );

          // Atualiza selectedChat apenas se o chat selecionado atualmente é este chat (evita sobrescrever por respostas antigas)
          setSelectedChat((prev) =>
            prev && prev.id === chatId
              ? {
                  ...prev,
                  messages: mergedMessages,
                  lastMessage: returnedChat.lastMessage,
                  lastMessageTime: returnedChat.lastMessageTime,
                }
              : prev
          );

          setChats((prev) =>
            prev.map((chatItem) =>
              chatItem.id === chatId
                ? {
                    ...chatItem,
                    lastMessage: returnedChat.lastMessage,
                    lastMessageTime: returnedChat.lastMessageTime,
                    messages: mergedMessages,
                  }
                : chatItem
            )
          );
          return true;
        }
      } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
        toast.error("Erro ao enviar mensagem");

        // Remove mensagem temporária em caso de erro
        setSelectedChat((prev) =>
          prev && prev.id === chatId
            ? {
                ...prev,
                messages: (prev.messages || []).filter(
                  (m) => m.messageId !== messageId
                ),
              }
            : prev
        );
        setChats((prev) =>
          prev.map((chatItem) =>
            chatItem.id === chatId
              ? {
                  ...chatItem,
                  messages: (chatItem.messages || []).filter(
                    (m) => m.messageId !== messageId
                  ),
                }
              : chatItem
          )
        );
      } finally {
        setSendingMessage(false);
      }
      return false;
    },
    [chats, selectedChat]
  );

  /** ATUALIZAR STATUS */
  const updateChatStatus = useCallback(
    async (chatId: number, status: Chat["status"], atendenteId?: string) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/chats/${chatId}/status`,
          {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify({ status, atendenteId }),
          }
        );

        if (!response.ok) throw new Error("Erro ao atualizar status");

        const data: ApiResponse<Chat> = await response.json();
        if (data.success) {
          if (selectedChat && selectedChat.id === chatId) {
            setSelectedChat((prev) =>
              prev ? { ...prev, status, atendenteId } : null
            );
          }

          setChats((prev) =>
            prev.map((chat) =>
              chat.id === chatId ? { ...chat, status, atendenteId } : chat
            )
          );
          toast.success("Status atualizado com sucesso");
          return true;
        }
      } catch (error) {
        console.error("Erro ao atualizar status:", error);
        toast.error("Erro ao atualizar status");
      }
      return false;
    },
    [selectedChat]
  );

  /** CRIAR OU ENCONTRAR CHAT */
  const createOrFindChat = useCallback(
    async (phone: string, wahaId: string, name: string) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/chats`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ phone, wahaId, name }),
        });

        if (!response.ok) throw new Error("Erro ao criar/buscar chat");

        const data: ApiResponse<Chat> = await response.json();
        if (data.success && data.data) {
          setChats((prev) => {
            const existingIndex = prev.findIndex(
              (chat) => chat.id === data.data!.id
            );
            if (existingIndex >= 0) {
              const updated = [...prev];
              updated[existingIndex] = data.data!;
              return updated;
            }
            return [data.data!, ...prev];
          });
          return data.data;
        }
      } catch (error) {
        console.error("Erro ao criar/buscar chat:", error);
        toast.error("Erro ao processar chat");
      }
      return null;
    },
    []
  );

  /** DESATIVAR CHAT */
  const deactivateChat = useCallback(
    async (chatId: number) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/chats/${chatId}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        });

        if (!response.ok) throw new Error("Erro ao desativar chat");

        setChats((prev) => prev.filter((chat) => chat.id !== chatId));
        if (selectedChat && selectedChat.id === chatId) setSelectedChat(null);
        toast.success("Chat desativado com sucesso");
        return true;
      } catch (error) {
        console.error("Erro ao desativar chat:", error);
        toast.error("Erro ao desativar chat");
      }
      return false;
    },
    [selectedChat]
  );

  /** SELECIONAR CHAT */
  const selectChat = useCallback(
    (chatId: number) => {
      // Busca inicial e atualiza o estado
      const fetchAndSelect = async () => {
        try {
          const chat = chats.find(c => c.id === chatId);
          if (!chat) return;

          // Atualiza o estado imediatamente com o que temos
          setSelectedChat(chat);

          // Busca dados atualizados
          await fetchChatById(chatId);

          // Limpa polling anterior se existir
          if (pollTimeoutRef.current) {
            clearInterval(pollTimeoutRef.current);
          }

          // Inicia novo polling
          pollTimeoutRef.current = setInterval(() => {
            fetchChatById(chatId);
          }, 10000);
        } catch (error) {
          console.error("Erro ao selecionar chat:", error);
          toast.error("Erro ao carregar conversa");
        }
      };

      fetchAndSelect();
    },
    [chats, fetchChatById]
  );

  /** FORMATAÇÃO RELATIVA DE TEMPO */
  const formatRelativeTime = useCallback((timestamp: string) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - messageTime.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "agora";
    if (diffInMinutes < 60) return `${diffInMinutes}min`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    return messageTime.toLocaleDateString("pt-BR");
  }, []);

  /** CARREGAR CHATS NA INICIALIZAÇÃO */
  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  /** LIMPAR POLLING AO DESMONTAR */
  useEffect(() => {
    return () => {
      if (pollTimeoutRef.current) {
        clearInterval(pollTimeoutRef.current);
        pollTimeoutRef.current = null;
      }
    };
  }, []);

  return {
    chats,
    selectedChat,
    loading,
    sendingMessage,
    fetchChats,
    fetchChatById,
    sendMessage,
    updateChatStatus,
    createOrFindChat,
    deactivateChat,
    selectChat,
    formatRelativeTime,
    loadingChatId,
  };
}

export type { Chat, ChatMessage };
