import { Chat, ChatMessage } from '@/hooks/useChats';

export const chatUtils = {
  /**
   * Formatar número de telefone para exibição
   */
  formatPhone: (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 11) {
      // (11) 99999-9999
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleaned.length === 10) {
      // (11) 9999-9999
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    
    return phone;
  },

  /**
   * Formatar timestamp para exibição
   */
  formatMessageTime: (timestamp: string) => {
    const messageDate = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'agora';
    if (diffInMinutes < 60) return `${diffInMinutes}min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    
    return messageDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: messageDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  },

  /**
   * Obter cor do status
   */
  getStatusColor: (status: Chat['status']) => {
    const colors = {
      standby: 'bg-orange-100 text-orange-700 border-orange-200',
      em_atendimento: 'bg-blue-100 text-blue-700 border-blue-200',
      resolvido: 'bg-green-100 text-green-700 border-green-200',
      encerrado: 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colors[status] || colors.standby;
  },

  /**
   * Obter nome amigável do status
   */
  getStatusName: (status: Chat['status']) => {
    const names = {
      standby: 'Aguardando',
      em_atendimento: 'Em Atendimento',
      resolvido: 'Resolvido',
      encerrado: 'Encerrado',
    };
    return names[status] || status;
  },

  /**
   * Obter ícone do status
   */
  getStatusIcon: (status: Chat['status']) => {
    const icons = {
      standby: '⏳',
      em_atendimento: '💬',
      resolvido: '✅',
      encerrado: '🔒',
    };
    return icons[status] || '📝';
  },

  /**
   * Verificar se o chat está ativo (pode receber mensagens)
   */
  isChatActive: (chat: Chat) => {
    return chat.isActive && chat.status !== 'encerrado';
  },

  /**
   * Truncar texto para exibição
   */
  truncateText: (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  },

  /**
   * Gerar avatar placeholder baseado no nome
   */
  generateAvatarPlaceholder: (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-teal-500',
    ];
    
    const initial = name.charAt(0).toUpperCase();
    const colorIndex = name.charCodeAt(0) % colors.length;
    
    return {
      initial,
      colorClass: colors[colorIndex],
    };
  },

  /**
   * Filtrar chats por status
   */
  filterChatsByStatus: (chats: Chat[], status: Chat['status']) => {
    return chats.filter(chat => chat.status === status);
  },

  /**
   * Buscar chats por texto (nome, telefone ou última mensagem)
   */
  searchChats: (chats: Chat[], searchTerm: string) => {
    if (!searchTerm.trim()) return chats;
    
    const term = searchTerm.toLowerCase();
    return chats.filter(chat => 
      chat.name.toLowerCase().includes(term) ||
      chat.phone.includes(term) ||
      chat.lastMessage.toLowerCase().includes(term)
    );
  },

  /**
   * Ordenar chats (por padrão, mais recente primeiro)
   */
  sortChats: (chats: Chat[], sortBy: 'recent' | 'name' | 'status' = 'recent') => {
    const sorted = [...chats];
    
    switch (sortBy) {
      case 'recent':
        return sorted.sort((a, b) => 
          new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
        );
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'status':
        const statusOrder = { standby: 0, em_atendimento: 1, resolvido: 2, encerrado: 3 };
        return sorted.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
      default:
        return sorted;
    }
  },

  /**
   * Contar mensagens não lidas (funcionalidade futura)
   */
  getUnreadCount: (chat: Chat) => {
    // Por enquanto, retorna 0. Será implementado quando houver controle de leitura
    return 0;
  },

  /**
   * Verificar se é mensagem do sistema
   */
  isSystemMessage: (message: ChatMessage) => {
    // Pode ser usado para identificar mensagens automáticas do sistema
    return message.text.startsWith('[SISTEMA]');
  },

  /**
   * Validar número de telefone brasileiro
   */
  isValidBrazilianPhone: (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    return /^(\d{10}|\d{11})$/.test(cleaned);
  },

  /**
   * Extrair estatísticas do chat
   */
  getChatStats: (chat: Chat) => {
    const messages = chat.messages || [];
    const userMessages = messages.filter(m => !m.fromMe);
    const agentMessages = messages.filter(m => m.fromMe);
    
    return {
      totalMessages: messages.length,
      userMessages: userMessages.length,
      agentMessages: agentMessages.length,
      firstMessageTime: messages.length > 0 ? messages[0].timestamp : null,
      lastMessageTime: chat.lastMessageTime,
      duration: messages.length > 0 ? 
        new Date(chat.lastMessageTime).getTime() - new Date(messages[0].timestamp).getTime() : 0,
    };
  },
};
