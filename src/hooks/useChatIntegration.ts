import { useChats } from '@/hooks/useChats';

interface ChatIntegrationProps {
  onChatCreated?: (chatId: number) => void;
  onError?: (error: string) => void;
}

export function useChatIntegration({ onChatCreated, onError }: ChatIntegrationProps = {}) {
  const { createOrFindChat } = useChats();

  /**
   * Cria ou encontra um chat baseado no telefone do cliente
   * Útil para integração com WhatsApp, formulários de contato, etc.
   */
  const createChatFromContact = async (
    phone: string,
    name: string,
    wahaId?: string
  ) => {
    try {
      // Normalizar telefone (remover caracteres especiais)
      const normalizedPhone = phone.replace(/\D/g, '');
      
      // Se não foi fornecido wahaId, criar um baseado no telefone
      const finalWahaId = wahaId || `${normalizedPhone}@c.us`;

      const chat = await createOrFindChat(normalizedPhone, finalWahaId, name);
      
      if (chat) {
        onChatCreated?.(chat.id);
        return chat;
      } else {
        throw new Error('Falha ao criar/encontrar chat');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      onError?.(errorMessage);
      throw error;
    }
  };

  /**
   * Cria um chat a partir de dados de um formulário de contato
   */
  const createChatFromForm = async (formData: {
    name: string;
    phone: string;
    email?: string;
    message?: string;
  }) => {
    const chat = await createChatFromContact(
      formData.phone,
      formData.name
    );

    // Se há uma mensagem inicial, pode ser enviada aqui
    // Isso seria implementado quando a funcionalidade de envio automático estiver pronta

    return chat;
  };

  /**
   * Cria um chat a partir de dados do WhatsApp
   */
  const createChatFromWhatsApp = async (whatsappData: {
    waId: string;
    name: string;
    phone: string;
  }) => {
    return await createChatFromContact(
      whatsappData.phone,
      whatsappData.name,
      whatsappData.waId
    );
  };
  return {
    createChatFromContact,
    createChatFromForm,
    createChatFromWhatsApp,
  };
}
