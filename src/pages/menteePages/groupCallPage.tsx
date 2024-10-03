import { useParams, useNavigate } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import toast from 'react-hot-toast';
import apiClientMentee from '../../services/apiClientMentee';
import { LOCALHOST_URL } from '../../constants/constants';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface ISession {
  id: string;
  name: string;
}

const GroupCallPage = () => {
  const [userData, setUserData] = useState<ISession | null>(null);
  const [loading, setLoading] = useState(true);
  const meetingContainerRef = useRef<HTMLDivElement>(null);
  const { roomId } = useParams();
  const navigate = useNavigate();

  const hasJoinedRoomRef = useRef(false);
  const zegoInstanceRef = useRef<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiClientMentee.get(`${LOCALHOST_URL}/api/mentees/getMenteeData`);
        setUserData(response.data);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('Something went wrong. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const initializeMeeting = async () => {
      if (userData && roomId && meetingContainerRef.current && !hasJoinedRoomRef.current) {
        try {
          const userId = userData.id;
          const userName = userData.name;

          const appID = 610296954;
          const serverSecret = 'c8f2f2f26a7f48d8855689f929cf8b89';
          const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomId, userId, userName);

          const zc = ZegoUIKitPrebuilt.create(kitToken);
          zegoInstanceRef.current = zc;

          zc.joinRoom({
            container: meetingContainerRef.current,
            sharedLinks: [
              {
                name: "Copy Link",
                url: `http://localhost:5173/room/${roomId}`
              }
            ],
            scenario: {
              mode: ZegoUIKitPrebuilt.GroupCall,
            },
            showScreenSharingButton: true,
          });

          hasJoinedRoomRef.current = true;
        } catch (error) {
          toast.error('Failed to initialize meeting.');
          console.error(error);
        }
      }
    };

    if (!loading && userData && roomId && !hasJoinedRoomRef.current) {
      initializeMeeting();
    }

    return () => {
      if (zegoInstanceRef.current && hasJoinedRoomRef.current) {
        zegoInstanceRef.current.destroy();
        hasJoinedRoomRef.current = false;
      }
    };
  }, [userData, roomId, loading]);

  const handleGoBack = () => {
    if (zegoInstanceRef.current) {
      zegoInstanceRef.current.destroy();
    }
    navigate(-1);
  };

  if (!roomId) {
    toast.error('Something went wrong. Missing room ID.');
    return null;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative w-full h-screen">
      <button
        onClick={handleGoBack}
        className="absolute top-4 left-4 z-50 bg-white bg-opacity-70 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all duration-200"
        style={{ position: 'fixed' }}
      >
        <ArrowLeft size={24} />
      </button>
      <div ref={meetingContainerRef} className="w-full h-full" />
    </div>
  );
};

export default GroupCallPage;