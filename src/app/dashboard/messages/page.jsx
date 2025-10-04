// app/dashboard/messages/page.jsx
'use client';

import { useState } from 'react';

export default function MessagesPage() {
  const [activeConversation, setActiveConversation] = useState(1);
  const [newMessage, setNewMessage] = useState('');

  const conversations = [
    {
      id: 1,
      participant: {
        name: "Pierre Martin",
        company: "Institut de Dermatologie",
        avatar: "PM"
      },
      messages: [
        {
          id: 1,
          sender: "other",
          content: "Bonjour Marie, comment allez-vous ?",
          timestamp: "2023-09-10T09:30:00"
        },
        {
          id: 2,
          sender: "me",
          content: "Très bien merci ! Et vous ?",
          timestamp: "2023-09-10T09:32:00"
        },
        {
          id: 3,
          sender: "other",
          content: "Parfait. Je vous contacte au sujet de notre collaboration sur le nouveau projet de crème hydratante.",
          timestamp: "2023-09-10T09:35:00"
        }
      ],
      unread: false
    },
    {
      id: 2,
      participant: {
        name: "Sophie Leroy",
        company: "AromaSynth",
        avatar: "SL"
      },
      messages: [
        {
          id: 1,
          sender: "other",
          content: "Salut Marie, as-tu eu le temps de consulter le document que je t'ai envoyé ?",
          timestamp: "2023-09-09T14:20:00"
        }
      ],
      unread: true
    },
    {
      id: 3,
      participant: {
        name: "Thomas Bernard",
        company: "BioFormulations",
        avatar: "TB"
      },
      messages: [
        {
          id: 1,
          sender: "other",
          content: "Bonjour, je serais intéressé par une collaboration sur votre prochain projet.",
          timestamp: "2023-09-08T11:15:00"
        }
      ],
      unread: false
    }
  ];

  const activeConv = conversations.find(conv => conv.id === activeConversation);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    // Ici, vous enverriez le message à votre API
    console.log("Envoi du message:", newMessage);
    setNewMessage('');
  };

  return (
    <div className="max-w-6xl mx-auto h-full flex">
      <div className="w-1/3 border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
        </div>
        <div className="overflow-y-auto">
          {conversations.map(conversation => (
            <div
              key={conversation.id}
              onClick={() => setActiveConversation(conversation.id)}
              className={`p-4 border-b border-gray-200 cursor-pointer ${
                activeConversation === conversation.id
                  ? 'bg-blue-50'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {conversation.participant.avatar}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {conversation.participant.name}
                    </p>
                    <span className="text-xs text-gray-500">
                      {new Date(conversation.messages[conversation.messages.length - 1].timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.messages[conversation.messages.length - 1].content}
                  </p>
                </div>
                {conversation.unread && (
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white">
        {activeConv ? (
          <>
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {activeConv.participant.avatar}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{activeConv.participant.name}</p>
                  <p className="text-sm text-gray-500">{activeConv.participant.company}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeConv.messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'me'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'me' ? 'text-blue-200' : 'text-gray-500'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Tapez votre message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Envoyer
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Sélectionnez une conversation</p>
          </div>
        )}
      </div>
    </div>
  );
}