import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { mentorLogout } from "../../redux/mentorSlice"; // Adjust this import as necessary
import { Menu, Bell } from "lucide-react";
import { LOCALHOST_URL } from "../../constants/constants";
import { initializeSocket, onNotificationReceived } from "../../services/socketManager";
import { RootState } from "../../redux/store";
import {  setSelectedChatMentor, setMentorNotification, addMentorNotification, clearMentorNotifications } from "../../redux/chatSlice";
import { INotification } from "../../interfaces/IChatMentorInterface"; // Adjust this import as necessary
import { mentorStoreData } from "../../interfaces/ImenteeInferfaces";
import apiClient from "../../services/apiClient";

interface GroupedNotification {
  sender: string;
  senderName: string;
  chatId: string;
  count: number;
}
interface Notification {
  message: string;
  chatId: string;
  senderId: string;
  messageText: string;
}
const MentorHeader: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const accessToken = useSelector((state: mentorStoreData) => state.mentor.accessToken);
  const [user, setUser] = useState("");
  const selectedChat = useSelector((state: RootState) => state.chat.selectedChatMentor);
  const notifications = useSelector((state: RootState) => state.chat.mentorNotification) || [];

  useEffect(() => {
    if (accessToken && !user) {
      fetchMentorData();
      fetchNotifications();
    }
  }, [accessToken]);

  useEffect(() => {
    if (user) {
      const socket = initializeSocket(user);
      onNotificationReceived((notification: Notification) => {
        handleNewNotification(notification);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await apiClient.get(`${LOCALHOST_URL}/api/mentor/getNotifications`);
      if (data && data.notifications) {
        dispatch(setMentorNotification(data.notifications));
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const fetchMentorData = async () => {
    try {
      const { data } = await apiClient.get(`${LOCALHOST_URL}/api/mentor/getMentorData`);
      if (data && data._id) {
        setUser(data._id);
      } else {
        console.error("Invalid response: ", data);
      }
    } catch (error) {
      console.error("Error fetching mentor details:", error);
    }
  };

  const handleNewNotification = (notification: Notification) => {
    if (selectedChat && selectedChat._id === notification.chatId.toString()) {
      markSeenMessage(selectedChat._id);
      return;
    }
    dispatch(addMentorNotification(notification));
    toast.success(`New notification: ${notification.messageText}`);
    
    fetchNotifications();
  };

  const handleLogout = () => {
    dispatch(mentorLogout());
    toast.success("Logged out successfully.");
    navigate("/mentor");
  };



  const handleClearNotifications = () => {
    dispatch(clearMentorNotifications());
  };

  const groupNotifications = (notifications: INotification[]): GroupedNotification[] => {
    const grouped = notifications.reduce((acc, notification) => {
      const chatId = notification.chat ? notification.chat.toString() : null;
      if (!chatId) return acc; 
  
      const existingGroup = acc.find(group => group.chatId === chatId);
      if (existingGroup) {
        existingGroup.count += 1;
      } else {
        acc.push({
          sender: notification.sender,
          senderName: notification.senderName,
          chatId: chatId,
          count: 1,
        });
      }
      return acc;
    }, [] as GroupedNotification[]);
  
    return grouped;
  };

  const markSeenMessage = async (id: string) => {
    try {
      if (!selectedChat) return;
      await apiClient.put(`${LOCALHOST_URL}/api/mentor/readChat/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChat = async (notif: GroupedNotification) => {
    try {
      const response = await apiClient.post(
        `${LOCALHOST_URL}/api/chat/mentor`,
        { id: notif.sender }
      );
      if (response.data.message === "Success") {
        markSeenMessage(notif.sender)
        dispatch(setSelectedChatMentor(response.data.chat));
        navigate("/mentor/chat");
      }
    } catch (error) {
      console.log("Error occurred during chat:", error);
    }
  };

  const renderNotifications = () => {
    const groupedNotifications = groupNotifications(notifications);

    return groupedNotifications.map((notif, index) => (
      <div
        key={index}
        className="p-2 border-b hover:bg-gray-100 cursor-pointer"
        onClick={() => handleChat(notif)}
      >
        <p className="text-sm">
          {notif.count === 1
            ? `You have a message from ${notif.senderName}`
            : `You have ${notif.count} messages from ${notif.senderName}`}
        </p>
      </div>
    ));
  };

  const NavItem = ({ text, onClick }: { text: string; onClick: () => void }) => (
    <button
      onClick={onClick}
      className="text-purple-600 font-semibold py-2 px-4 hover:bg-gray-100 w-full text-left"
    >
      {text}
    </button>
  );

  return (
    <div
      className={`fixed top-0 left-0 w-full flex justify-center z-20 transition-all`}
      style={{
        padding: isScrolled ? "0" : "0.5rem",
      }}
    >
      <header
        className="bg-white shadow-xl transition-all w-full md:w-[90%]"
        style={{
          padding: isScrolled ? "0.75rem" : "1.5rem",
          borderRadius: isScrolled ? "0" : "1rem",
        }}
      >
        <div className="flex items-center justify-between">
          <img src="/images/commonLogo.png" alt="Logo" className="h-16" />
          <nav className="hidden md:flex items-center space-x-8">
            <NavItem text="Home" onClick={() => navigate("/mentor/home")} />
            <NavItem text="Account" onClick={() => navigate('/mentor/account')} />
            <div className="relative">
              <button
                className="text-purple-600 hover:text-purple-800 font-semibold"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
            <div className="relative">
              <button
                className="text-purple-600 font-semibold"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              >
                <Bell size={24} />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                    {notifications.length}
                  </span>
                )}
              </button>
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded shadow-md w-80">
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.length > 0 ? (
                      renderNotifications()
                    ) : (
                      <div className="p-4 text-gray-500 text-sm">No notifications</div>
                    )}
                  </div>
                  <button
                    onClick={handleClearNotifications}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-black font-semibold py-2 rounded-b"
                  >
                    Clear Notifications
                  </button>
                </div>
              )}
            </div>
          </nav>
          <div className="md:hidden flex items-center">
            <div className="relative mr-4">
              <button
                className="text-purple-600 font-semibold"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              >
                <Bell size={24} />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                    {notifications.length}
                  </span>
                )}
              </button>
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded shadow-md w-80">
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.length > 0 ? (
                      renderNotifications()
                    ) : (
                      <div className="p-4 text-gray-500 text-sm">No notifications</div>
                    )}
                  </div>
                  <button
                    onClick={handleClearNotifications}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-purple-600 font-semibold py-2 rounded-b"
                  >
                    Clear Notifications
                  </button>
                </div>
              )}
            </div>
            <button
              className="flex items-center text-purple-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>
  
      {isMenuOpen && (
        <div className="absolute top-16 right-0 bg-white shadow-lg rounded-md">
          <nav className="flex flex-col p-4">
            <NavItem text="Home" onClick={() => { navigate("/mentor/home"); setIsMenuOpen(false); }} />
            <NavItem text="Account" onClick={() => { navigate('/mentor/account'); setIsMenuOpen(false); }} />
            <button onClick={handleLogout} className="text-purple-600 font-semibold">Logout</button>
          </nav>
        </div>
      )}
    </div>
  );
    
  
};

export default MentorHeader;
