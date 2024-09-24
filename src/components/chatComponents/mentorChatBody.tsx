import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';
import { LOCALHOST_URL } from '../../constants/constants';
import apiClient from '../../services/apiClient';

interface User {
  _id: string;
  name: string;
  image: string;
}

interface Message {
  _id: string;
  content: string;
  sender: {
    _id: string;
    name: string;
    image: string;
  } | null;
  senderModel: 'MentorVarify' | 'Mentee';
  chat: {
    _id:string
  }
}

interface RootState {
  chat: {
    selectedChat: {
      _id: string;
      mentee: {
        _id: string;
        image: string;
        name: string;
      };
    } | null;
  };
}

interface MentorChatBodyProps {
  user: User;
}

let socket: Socket | null = null;

const MentorChatBody: React.FC<MentorChatBodyProps> = ({ user }) => {
  const navigate = useNavigate();
  const selectedChat = useSelector((state: RootState) => state.chat.selectedChat);
  const [newMessage, setNewMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const initializeSocket = () => {
      socket = io(LOCALHOST_URL);

      socket.on('connect', () => {
        console.log("Socket connected");
      });

      socket.on('connect_error', (error) => {
        console.error("Socket connection error:", error);
        setError("Failed to connect to the chat server. Please try again later.");
      });

      if (user?._id) {
        socket.emit('setup', user);
      }

      if (selectedChat?._id) {
        socket.emit('join chat', selectedChat._id);
      }
      socket.on('typing', () => setIsTyping(true));
      socket.on('stop typing', () => setIsTyping(false));

      socket.on('message received', (newMessage: Message) => {
        console.log("chat",selectedChat)
        console.log("message",newMessage)
        if(selectedChat?._id === newMessage.chat._id){
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      });
    };

    initializeSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [selectedChat, user]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedChat?._id) {
        try {
          setLoadingMessages(true);
          setError(null);
          const response = await apiClient.get<Message[]>(`${LOCALHOST_URL}/api/message/${selectedChat._id}`);
          setMessages(response.data);
        } catch (error) {
          console.error("Error fetching messages:", error);
          setError("Failed to load messages. Please try again later.");
        } finally {
          setLoadingMessages(false);
        }
      }
    };

    fetchMessages();
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendTypingEvent = useCallback(() => {
    if (socket && selectedChat?._id) {
      socket.emit('typing', selectedChat._id);
    }
  }, [selectedChat]);

  const sendStopTypingEvent = useCallback(() => {
    if (socket && selectedChat?._id) {
      socket.emit('stop typing', selectedChat._id);
    }
  }, [selectedChat]);

  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    sendTypingEvent();

    typingTimeoutRef.current = setTimeout(() => {
      sendStopTypingEvent();
    }, 3000);
  };

  const handleButtonClick = async () => {
    if (!newMessage.trim() || !selectedChat?._id) return;

    try {
      setError(null);
      sendStopTypingEvent();
      const response = await apiClient.post<Message>(`${LOCALHOST_URL}/api/message/mentor`, {
        content: newMessage,
        chatId: selectedChat._id,
      });

      if (socket) {
        socket.emit('new message', response.data);
      }
      setMessages((prevMessages) => [...prevMessages, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!selectedChat) {
    return <div className="p-4">Select a chat to view messages.</div>;
  }

  return (
    <div className="flex justify-center">
      <div className="w-[800px] h-[500px] bg-white rounded-lg shadow-lg flex flex-col">
        <div className="bg-gradient-to-r from-[#1D2B6B] to-[#142057] p-4 rounded-t-lg text-white flex items-center">
          <button onClick={handleBack} className="text-white mr-4">
            <FontAwesomeIcon icon={faArrowLeft} size="lg" />
          </button>
          <div className="flex flex-col">
            <span className="font-semibold">
              {selectedChat.mentee ? selectedChat.mentee.name : 'Unknown Mentee'}
            </span>
            <span className="text-xs text-gray-300 h-4">
              {isTyping ? 'Typing...' : '\u00A0'}
            </span>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          {loadingMessages ? (
            <div>Loading messages...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            messages.map((message) => (
              <div 
                key={message._id} 
                className={`flex ${message.senderModel === 'MentorVarify' ? 'justify-end' : 'justify-start'} mb-4`}
              >
                <div 
                  className={`max-w-[70%] px-4 py-2 rounded-lg ${
                    message.senderModel === 'MentorVarify'
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef}></div>
        </div>

        <div className="p-4 border-t border-gray-300 flex">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={inputChange}
            className="w-full px-4 py-2 border rounded-l-lg"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
            onClick={handleButtonClick}
            disabled={!newMessage.trim() || !selectedChat?._id}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorChatBody;