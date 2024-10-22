import MentorAccountSidebar from "../../components/commonComponents/mentorAccountSidebar";
import MentorHeader from "../../components/commonComponents/mentorHeader";
import MyCommunityBody from "../../components/mentorComponents/My-Community-Meet/myCommunityBody";

const MyCommunityPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <MentorHeader />
      <div className="flex flex-col lg:flex-row flex-1">
        <div className="lg:block">
          <MentorAccountSidebar />
        </div>
        <main className="flex-1 p-4 md:p-6 
          mx-4 md:mx-6 lg:ml-8 xl:ml-64 
          overflow-y-auto">
          <div className="mt-44">
            <MyCommunityBody />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyCommunityPage;