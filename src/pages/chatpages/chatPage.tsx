import { useEffect, useState } from "react";
import ChatBody from "../../components/chatComponents/chatBody";
import MenteeHeader from "../../components/commonComponents/menteeHeader";
import apiClientMentee from "../../services/apiClientMentee";
import { LOCALHOST_URL } from "../../constants/constants";

interface User {
  id: string;
  name: string;
  image: string;
}

const ChatPage = () => {
  const [user, setUser] = useState<User | null>(null); // Initialize with null

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const response = await apiClientMentee.get(`${LOCALHOST_URL}/api/mentees/getMenteeData`);
        setUser(response.data);
        console.log('Fetched user:', response.data); // Log fetched user data
      } catch (error) {
        console.error("Error fetching mentor data:", error);
      }
    };

    fetchMentor();
  }, []);

  return (
    <div className="flex flex-col bg-slate-100 min-h-screen">
      <MenteeHeader />
      <div className="flex flex-grow mt-32 justify-center"> 
        <main className="w-full max-w-4xl p-6 overflow-hidden"> 
          {user ? <ChatBody user={user} /> : <div>Loading...</div>}
        </main>
      </div>
    </div>
  );
}

export default ChatPage;