import  { useEffect, useState } from "react";
import MentorChatBody from "../../components/chatComponents/mentorChatBody";
import MentorAccountSidebar from "../../components/commonComponents/mentorAccountSidebar";
import MentorHeader from "../../components/commonComponents/mentorHeader";
import apiClient from "../../services/apiClient";
import { LOCALHOST_URL } from "../../constants/constants";

interface User {
  _id: string;
  name: string;
  image: string;
}

const MentorChatPage = () => {
  const [user, setUser] = useState<User | null>(null); // Initialize with null
  const [loading, setLoading] = useState<boolean>(true); // For showing loading state
  const [error, setError] = useState<string | null>(null); // For handling errors

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        setLoading(true); // Start loading
        const response = await apiClient.get(`${LOCALHOST_URL}/api/mentor/getMentorData`);
        setUser(response.data);
        setLoading(false); // End loading
      } catch (error) {
        console.error("Error fetching mentor data:", error);
        setError("Failed to fetch mentor data.");
        setLoading(false); // End loading even on error
      }
    };

    fetchMentor();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Error state
  }

  return (
    <div className="flex flex-col min-h-screen">
      <MentorHeader />
      <div className="flex flex-1 bg-slate-50 overflow-y-auto">
        <MentorAccountSidebar />
        <main className="flex-1 ml-96 mt-40 overflow-y-auto">
          {user ? <MentorChatBody user={user} /> : <div>Loading...</div>} {/* Check if user is fetched */}
        </main>
      </div>
    </div>
  );
};

export default MentorChatPage;
