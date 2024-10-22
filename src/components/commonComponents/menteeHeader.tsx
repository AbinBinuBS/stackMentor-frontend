import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { menteeLogout } from "../../redux/menteeSlice";
import { StoreData } from "../../interfaces/ImenteeInferfaces";
import { Menu, Bell } from "lucide-react";
import apiClientMentee from "../../services/apiClientMentee";
import { LOCALHOST_URL } from "../../constants/constants";
import { initializeSocket, onNotificationReceived } from "../../services/socketManager";
import { RootState } from "../../redux/store";
import { setNotification, addNotification, clearNotifications, setSelectedChat, resetSelectedChat } from "../../redux/chatSlice";
import { INotification } from "../../interfaces/IChatMentorInterface";

interface GroupedNotification {
  sender:string;
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
const MenteeHeader: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isBell,setIsBell] = useState(true)
  const accessToken = useSelector((state: StoreData) => state.mentee.accessToken);
  const [user, setUser] = useState("");
  const selectedChat = useSelector((state: RootState) => state.chat.selectedChat);
  const notifications = useSelector((state: RootState) => state.chat.notification) || [];
  const location = useLocation();
  useEffect(() => {
    if(location.pathname == '/chat'){
      setIsBell(false)
    }else{
      if(selectedChat){
        dispatch(resetSelectedChat())
      }
    }
    if (accessToken && !user) {
      fetchMenteeData();
      fetchNotifications();
    }else{
      setIsBell(false)
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
      const { data } = await apiClientMentee.get(`${LOCALHOST_URL}/api/mentees/getNotifications`);
      if (data && data.notifications) {
        dispatch(setNotification(data.notifications));
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const fetchMenteeData = async () => {
    try {
      const { data } = await apiClientMentee.post(`${LOCALHOST_URL}/api/mentees/getMenteeDetails`);
      if (data && data._id) {
        setUser(data._id);
      } else {
        console.error("Invalid response: ", data);
      }
    } catch (error) {
      console.error("Error fetching mentee details:", error);
    }
  };

  const handleNewNotification = (notification: Notification) => {
    if (selectedChat && selectedChat._id === notification.chatId.toString()) {
      markSeenMessage(selectedChat._id)
      return;
    }
    dispatch(addNotification(notification));
    toast.success(`New notification: ${notification.messageText}`);
    
    fetchNotifications();
  };
  

  const handleLogout = () => {
    dispatch(menteeLogout());
    toast.success("Logged out successfully.");
    navigate("/login");
  };

  const openWallet = () => {
    navigate("/wallet");
  };

  const handleClearNotifications = () => {
    dispatch(clearNotifications());
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
          sender:notification.sender,
          senderName: notification.senderName,
          chatId: chatId,
          count: 1
        });
      }
      return acc;
    }, [] as GroupedNotification[]);
  
    return grouped;
  };
  
  const markSeenMessage = async(id:string) =>{
    try{
      if(!selectedChat)return 
       await apiClientMentee.put(`${LOCALHOST_URL}/api/mentees/readChat/${id}`)
    }catch(error){
      console.log(error)
    }
  }

  const handleChat = async (notif:GroupedNotification) => {
		try {
			const response = await apiClientMentee.post(
				`${LOCALHOST_URL}/api/chat/mentee`,
				{id:notif.sender}
			);
			if (response.data.message == "Success") {
				dispatch(setSelectedChat(response.data.chat));
				navigate("/chat");
			}
		} catch (error) {
			console.log("error occurred during chat:", error);
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
    ))
  };

  const NavItem = ({ text, onClick }: { text: string; onClick: () => void }) => (
    <button
      onClick={onClick}
      className="text-black font-semibold py-2 px-4 hover:bg-gray-100 w-full text-left"
    >
      {text}
    </button>
  );

  return (
    <div
      className={`fixed top-0 left-0 w-full flex justify-center z-20 transition-all`}
      style={{
        transitionDuration: "2s",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        padding: isScrolled ? "0" : "0.5rem",
      }}
    >
      <header
        className="bg-white shadow-xl transition-all w-full md:w-[90%]"
        style={{
          transitionDuration: "2s",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          padding: isScrolled ? "0.75rem" : "1.5rem",
          borderRadius: isScrolled ? "0" : "1rem",
        }}
      >
        <div className="flex items-center justify-between">
          <img src="/images/logo.png" alt="Logo" className="h-16" />
          <nav className="hidden md:flex items-center space-x-8">
            <NavItem text="Home" onClick={() => navigate("/")} />
            <NavItem text="Mentor" onClick={() => navigate("/mentorList")} />
            <NavItem text="Q&A" onClick={() => navigate("/questionsAsked")} />
            <NavItem text="Account" onClick={() => navigate("/account")} />
            <div className="relative">
              <button
                className="text-black font-semibold"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                More
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 inline-block ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded shadow-md">
                  <NavItem text="Wallet" onClick={openWallet} />
                  {accessToken ? (
                    <NavItem text="Logout" onClick={handleLogout} />
                  ) : (
                    <NavItem
                      text="Login"
                      onClick={() => navigate("/selectionLogin")}
                    />
                  )}
                </div>
              )}
            </div>
            <div className="relative">
      {isBell && ( 
        <button
          className="text-black font-semibold"
          onClick={() => setIsNotificationOpen(!isNotificationOpen)}
        >
          <Bell size={24} />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </button>
      )}

      {isNotificationOpen && (
        <div
          className="absolute right-0 mt-2 bg-white border border-gray-300 rounded shadow-md w-80 min-h-[300px]"
          style={{ right: 'calc(100% + 10px)' }}
        >
          <div className="flex justify-between items-center p-2 border-b">
            <h3 className="font-semibold">Notifications</h3>
            <button
              onClick={handleClearNotifications}
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              Clear All
            </button>
          </div>
          <div className="max-h-[250px] overflow-y-auto">{renderNotifications()}</div>
        </div>
      )}
    </div>
          </nav>
          <button
            className="md:hidden text-black"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden mt-4">
            <NavItem text="Home" onClick={() => navigate("/")} />
            <NavItem text="Mentor" onClick={() => navigate("/mentorList")} />
            <NavItem text="Q&A" onClick={() => navigate("/questionsAsked")} />
            <NavItem text="Account" onClick={() => navigate("/account")} />
            <NavItem text="Wallet" onClick={openWallet} />
            {accessToken ? (
              <NavItem text="Logout" onClick={handleLogout} />
            ) : (
              <NavItem
                text="Login"
                onClick={() => navigate("/selectionLogin")}
              />
            )}
          </div>
        )}
      </header>
    </div>
  );
};

export default MenteeHeader;