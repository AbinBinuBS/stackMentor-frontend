import MentorAccountSidebar from "../../components/commonComponents/mentorAccountSidebar";
import MentorHeader from "../../components/commonComponents/mentorHeader";
import CommunityMeetBody from "../../components/mentorComponents/community meet/communityMeetBody";

const CommunityMeetPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <MentorHeader />
      <div className="flex flex-col lg:flex-row flex-1">
        <div className="lg:block">
          <MentorAccountSidebar />
        </div>

        <main className="flex-1 p-4 md:p-6 
          mt-20 md:mt-24 lg:mt-36
          mx-4 md:mx-6 lg:ml-8 xl:ml-64 
          overflow-y-auto">
          <CommunityMeetBody />
        </main>
      </div>
    </div>
  );
};

export default CommunityMeetPage;