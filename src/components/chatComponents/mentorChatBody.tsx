import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";
import { MentorChatBodyProps, RootStateMentor } from "../../interfaces/IChatMentorInterface";
import { 
    initializeSocket, 
    joinChatRoom, 
    sendMessage, 
    handleTyping, 
    stopTyping, 
    onMessageReceived, 
    onTyping, 
    onStopTyping, 
    disconnectSocket 
} from "../../services/socketManager"; 
import { LOCALHOST_URL } from "../../constants/constants";
import {  resetSelectedChatMentor } from "../../redux/chatSlice";
import { useDispatch } from "react-redux";

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
    senderModel: "MentorVarify" | "Mentee";
    updatedAt: string;
    __v: number;
}

const MentorChatBody: React.FC<MentorChatBodyProps> = ({ user }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const selectedChat = useSelector((state: RootStateMentor) => state.chat.selectedChatMentor);
    const [newMessage, setNewMessage] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [loadingMessages, setLoadingMessages] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
         initializeSocket(user?._id);

        if (selectedChat?._id) {
            joinChatRoom(selectedChat._id);
        }

        onTyping(() => setIsTyping(true));
        onStopTyping(() => setIsTyping(false));
        onMessageReceived((newMessage: Message) => {
            if (selectedChat?._id === newMessage.chat._id) {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            }
        });

        return () => {
            disconnectSocket();
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
                    setError("Failed to load messages. Please try again later.");
                } finally {
                    setLoadingMessages(false);
                }
            }
        };

        fetchMessages();
    }, [selectedChat]);


    useEffect(()=>{
        const markSeenMessage = async() =>{
          try{
            if(!selectedChat)return 
             await apiClient.put(`${LOCALHOST_URL}/api/mentor/readChat/${selectedChat._id}`)
          }catch(error){
            console.log(error)
          }
        }
        markSeenMessage()
      },[])

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        handleTyping(selectedChat?._id!);

        typingTimeoutRef.current = setTimeout(() => {
            stopTyping(selectedChat?._id!);
        }, 3000);
    };

    const handleButtonClick = async () => {
        if (!newMessage.trim() || !selectedChat?._id) return;

        try {
            setError(null);
            stopTyping(selectedChat._id);
            const response = await apiClient.post<Message>(`${LOCALHOST_URL}/api/message/mentor`, {
                content: newMessage,
                chatId: selectedChat._id,
            });

            sendMessage(response.data);
            setMessages((prevMessages) => [...prevMessages, response.data]);
            setNewMessage("");
        } catch (error) {
            setError("Failed to send message. Please try again.");
        }
    };

    const handleBack = () => {
        navigate(-1);
        dispatch(resetSelectedChatMentor());

    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        };
        return date.toLocaleTimeString([], options);
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
                            {selectedChat.mentee ? selectedChat.mentee.name : "Unknown Mentee"}
                        </span>
                        <span className="text-xs text-gray-300 h-4">
                            {isTyping ? "Typing..." : "\u00A0"}
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
                                className={`flex ${
                                    message.senderModel === "MentorVarify"
                                        ? "justify-end"
                                        : "justify-start"
                                } mb-4`}
                            >
                                <div
                                    className={`max-w-[70%] px-4 py-2 rounded-lg ${
                                        message.senderModel === "MentorVarify"
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200 text-gray-800"
                                    }`}
                                >
                                    {message.content}
                                    <div className="text-xs text-gray-500 mt-1 text-right">
                                        {formatTime(message.createdAt)}
                                    </div>
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
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none"
                    />
                    <button
                        className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        onClick={handleButtonClick}
                    >
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MentorChatBody;
