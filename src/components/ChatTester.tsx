import { useState } from 'react';
import { useChats } from '@/hooks/useChats';
import { useChatIntegration } from '@/hooks/useChatIntegration';

export function ChatTester() {
  const { chats, sendMessage, fetchChats } = useChats();
  const { createChatFromContact } = useChatIntegration({
    onChatCreated: (chatId) => {
      console.log('Chat criado com ID:', chatId);
      fetchChats(); // Recarregar lista após criar
    },
    onError: (error) => {
      console.error('Erro ao criar chat:', error);
    },
  });

  const [testPhone, setTestPhone] = useState('11999999999');
  const [testName, setTestName] = useState('Cliente Teste');
  const [testMessage, setTestMessage] = useState('Olá, preciso de ajuda!');

  const handleCreateTestChat = async () => {
    try {
      await createChatFromContact(testPhone, testName);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleSendTestMessage = async () => {
    if (chats.length > 0) {
      const firstChat = chats[0];
      await sendMessage(firstChat.id, testMessage, false);
    } else {
      console.log('Nenhum chat disponível para enviar mensagem');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto mt-6">
      <h3 className="text-lg font-semibold mb-4">Teste de Integração do Chat</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Telefone:</label>
          <input
            type="text"
            value={testPhone}
            onChange={(e) => setTestPhone(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="11999999999"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nome:</label>
          <input
            type="text"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Cliente Teste"
          />
        </div>

        <button
          onClick={handleCreateTestChat}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Criar Chat de Teste
        </button>

        <div>
          <label className="block text-sm font-medium mb-1">Mensagem de Teste:</label>
          <input
            type="text"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Mensagem de teste"
          />
        </div>

        <button
          onClick={handleSendTestMessage}
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          disabled={chats.length === 0}
        >
          Enviar Mensagem ({chats.length} chats disponíveis)
        </button>

        <div className="mt-4">
          <h4 className="font-medium">Chats Existentes:</h4>
          {chats.length === 0 ? (
            <p className="text-gray-500 text-sm">Nenhum chat encontrado</p>
          ) : (
            <ul className="text-sm space-y-1">
              {chats.map((chat) => (
                <li key={chat.id} className="p-2 bg-gray-50 rounded">
                  <strong>{chat.name}</strong> - {chat.phone}
                  <br />
                  <span className="text-gray-600">{chat.lastMessage}</span>
                  <br />
                  <span className={`inline-block px-2 py-1 text-xs rounded ${
                    chat.status === 'standby' ? 'bg-orange-100 text-orange-700' :
                    chat.status === 'em_atendimento' ? 'bg-blue-100 text-blue-700' :
                    chat.status === 'resolvido' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {chat.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
