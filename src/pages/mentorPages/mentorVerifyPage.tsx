import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MentorHeader from "../../components/commonComponents/mentorHeader";
import MentorVerifyBody from "../../components/mentorComponents/Verify/mentorVerifyBody";
import MentorVerifySuccessBody from "../../components/mentorComponents/Verify/mentorVerifySuccessBody";
import apiClient from "../../services/apiClient";
import { LOCALHOST_URL } from "../../constants/constants";

const MentorVerifyPage = () => {
  const [mentorData, setMentorData] = useState(""); // State to store mentor status
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    const verificationStatus = async () => {
      try {
        console.log("1111111111111111111111111")
        const response = await apiClient.get(`${LOCALHOST_URL}/api/mentor/checkVerify`);
        const status = response.data.mentorData;
        console.log("11111111111111111111111111",mentorData)
        if (status === "beginner") { 
          setMentorData("beginner"); 
        } else if (["applied", "verified", "rejected"].includes(status)) {
          setMentorData(status);
        } else {
          toast.error("Something went wrong, please try again");
          navigate("/mentor/home");
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      } finally {
        setLoading(false);
      }
    };
    verificationStatus();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <MentorHeader />
        <div className="flex flex-1 justify-center items-center">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <MentorHeader />
      <div className="flex flex-1 overflow-y-auto">
        <main className="flex-1 mt-16 overflow-y-auto">
          {mentorData === "beginner" ? ( // Fix the typo here
            <MentorVerifyBody />
          ) : (
            <MentorVerifySuccessBody mentorData={mentorData} />
          )}
        </main>
      </div>
    </div>
  );
};

export default MentorVerifyPage;

