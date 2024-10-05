import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import apiClientMentee from '../../services/apiClientMentee';
import { LOCALHOST_URL } from '../../constants/constants';

interface Message {
  _id: string;
  content: string;
  sender: string;
  senderModel: string;
  chat: {
    _id:string;
    chatName:string;
  }
}

interface User {
  id: string;
  name: string;
  image: string;
}

interface RootState {
  chat: {
    selectedChat: {
      _id: string;
      mentor: User;
    } | null;
  };
}

const ENDPOINT = LOCALHOST_URL;
let socket: any

const ChatBody: React.FC<{ user: User }> = ({ user }) => {
  const navigate = useNavigate();
  const selectedChat = useSelector((state: RootState) => state.chat.selectedChat);
  const [newMessage, setNewMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  const [typing, setTyping] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!selectedChat || !user) return;

    socket = io(ENDPOINT);
    console.log('User:', user);
    console.log('Selected Chat:', selectedChat);

    socket.emit('setup', { _id: user.id });
    socket.on('connected', () => setSocketConnected(true));
    socket.on('message received', (newMessageReceived: Message) => {
      console.log("chat info",selectedChat)
      console.log("new message",newMessageReceived)
      if(selectedChat._id === newMessageReceived.chat._id){
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      }
    });
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false));

    return () => {
      socket.off('typing');
      socket.off('stop typing');
      socket.disconnect();
    };
  }, [selectedChat, user]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedChat?._id) {
        setIsLoading(true);
        try {
          const response = await apiClientMentee.get<Message[]>(`${LOCALHOST_URL}/api/message/${selectedChat._id}`);
          setMessages(response.data);
          socket.emit('join chat', selectedChat._id);
        } catch (error) {
          console.error("Error fetching messages:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchMessages();
  }, [selectedChat]);

  useEffect(() => {
    if (!isLoading) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleTyping = useCallback(() => {
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat?._id);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop typing', selectedChat?._id);
      setTyping(false);
    }, 3000);
  }, [socketConnected, typing, selectedChat]);

  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    handleTyping();
  };

  const handleButtonClick = async () => {
    if (!newMessage.trim() || !selectedChat?._id) return;

    try {
      const response = await apiClientMentee.post<Message>(`${LOCALHOST_URL}/api/message`, {
        content: newMessage,
        chatId: selectedChat._id,
      });
      socket.emit('new message', response.data);
      setMessages((prevMessages) => [...prevMessages, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
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
        <div className="bg-gradient-to-r from-[#1D2B6B] to-[#142057] p-4 flex items-center rounded-t-lg">
          <button onClick={handleBack} className="text-white mr-4">
            <FontAwesomeIcon icon={faArrowLeft} size="lg" />
          </button>
          <img
            src={selectedChat.mentor?.image || '/api/placeholder/40/40'}
            alt="User Avatar"
            className="w-10 h-10 rounded-full mr-3"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-white text-lg">
              {selectedChat.mentor?.name || 'Unknown Mentor'}
            </span>
            <span className="text-xs text-gray-300 h-4">
              {isTyping ? 'Typing...' : '\u00A0'}
            </span>
          </div>
        </div>
        <div className="flex-grow overflow-y-auto p-4 space-y-4 relative">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message._id} className={`flex items-start ${message.senderModel === "MentorVarify" ? 'justify-start' : 'justify-end'}`}>
                <div className={`rounded-lg p-3 max-w-[70%] ${message.senderModel === "MentorVarify" ? 'bg-gray-200' : 'bg-blue-300'}`}>
                  <p className="break-words whitespace-pre-wrap" style={{ wordBreak: 'break-word' }}>
                    {message.content}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 flex items-center">
          <input
            type="text"
            placeholder="Enter your message"
            value={newMessage}
            onChange={inputChange}
            className="flex-grow px-2 py-1 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
          />
          <button
            onClick={handleButtonClick}
            className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBody;