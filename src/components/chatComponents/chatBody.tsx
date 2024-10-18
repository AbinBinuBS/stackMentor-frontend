import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import apiClientMentee from '../../services/apiClientMentee';
import { 
  joinChatRoom, 
  sendMessage, 
  handleTyping, 
  stopTyping, 
  onMessageReceived,  
  initializeSocket,
  disconnectSocket
} from '../../services/socketManager';
import toast from 'react-hot-toast';
import { resetSelectedChat } from '../../redux/chatSlice';
import { useDispatch } from 'react-redux';
import { LOCALHOST_URL } from '../../constants/constants';

interface Message {
  _id: string;
  chat: {
    _id: string;
    chatName: string;
    mentor: string;
    mentee: string;
    createdAt: string;
  };
  content: string;
  createdAt: string;
  readBy: string[];
  sender: {
    _id: string;
    name: string;
  };
  senderModel: 'MentorVarify' | 'Mentee';
  updatedAt: string;
  __v: number;
}

interface User {
  id: string;
  name: string;
}

interface RootState {
  chat: {
    selectedChat: {
      _id: string;
      mentor?: {
        name: string;
        image: string;
      };
    } | null;
  };
}

const ChatBody: React.FC<{ user: User }> = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const selectedChat = useSelector((state: RootState) => state.chat.selectedChat);
  const [newMessage, setNewMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState<boolean>(false);
  // const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!selectedChat || !user) return;
  
    initializeSocket(user.id);
    joinChatRoom(selectedChat._id); 
  
    onMessageReceived((newMessageReceived: Message) => {
      if (selectedChat._id === newMessageReceived.chat._id) {
        setMessages((prevMessages) => {
          const messageExists = prevMessages.some(message => message._id === newMessageReceived._id);
          if (messageExists) {
            console.log('Duplicate message detected:', newMessageReceived._id);
            return prevMessages;
          }
          return [...prevMessages, newMessageReceived];
        });
      }
    });
  
    // onTyping(() => setIsTyping(true));
    // onStopTyping(() => setIsTyping(false));
  
    return () => {
      disconnectSocket(); 
       
    };
  }, [selectedChat, user, dispatch]);
  

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedChat?._id) {
        setIsLoading(true);
        try {
          const response = await apiClientMentee.get<Message[]>(`/api/message/${selectedChat._id}`);
          setMessages(response.data);
          joinChatRoom(selectedChat._id);
        } catch (error) {
          toast.error('Something unexpected happened');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchMessages();
  }, [selectedChat]);

  useEffect(()=>{
    const markSeenMessage = async() =>{
      try{
        if(!selectedChat)return 
         await apiClientMentee.put(`${LOCALHOST_URL}/api/mentees/readChat/${selectedChat._id}`)
      }catch(error){
        console.log(error)
      }
    }
    markSeenMessage()
  },[])

  useEffect(() => {
    if (!isLoading) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTypingEvent = useCallback(() => {
    if (!typing) {
      setTyping(true);
      handleTyping(selectedChat?._id as string);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(selectedChat?._id as string);
      setTyping(false);
    }, 3000);
  }, [typing, selectedChat]);

  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    handleTypingEvent();
  };

  const handleButtonClick = async () => {
    if (!newMessage.trim() || !selectedChat?._id) return;

    try {
      const response = await apiClientMentee.post<Message>('/api/message', {
        content: newMessage,
        chatId: selectedChat._id,
      });
      sendMessage(response.data);
      setMessages((prevMessages) => [...prevMessages, response.data]);
      setNewMessage('');
    } catch (error) {
      toast.error('Something unexpected happened');
    }
  };

  const handleBack = () => {
    navigate(-1);
    dispatch(resetSelectedChat());
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
              {/* {isTyping ? 'Typing...' : '...'} */}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div>Loading messages...</div>
          ) : (
            messages.map((message) => (
              <div 
                key={message._id} 
                className={`mb-2 ${message.sender._id === user.id ? 'text-right' : 'text-left'}`}
              >
                <div className={`inline-block p-2 rounded-lg ${message.sender._id === user.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                  <p>{message.content}</p>
                  <span className="text-xs text-gray-500">{formatTime(message.createdAt)}</span>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 flex">
          <input 
            type="text" 
            value={newMessage} 
            onChange={inputChange} 
            placeholder="Type a message..." 
            className="flex-1 p-2 border rounded-lg"
          />
          <button onClick={handleButtonClick} className="ml-2 p-2 bg-blue-500 text-white rounded-lg">
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBody;
