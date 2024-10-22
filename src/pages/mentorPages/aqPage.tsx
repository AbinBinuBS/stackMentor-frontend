import MentorAccountSidebar from "../../components/commonComponents/mentorAccountSidebar";
import MentorHeader from "../../components/commonComponents/mentorHeader";
import QABody from "../../components/mentorComponents/QA/qaBody";

const QAPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <MentorHeader />
      <div className="flex flex-1">
        <MentorAccountSidebar />
        <main className="flex-1 mt-36 p-6 overflow-y-auto ml-8 xl:ml-64">
          <QABody />
        </main>
      </div>
    </div>
  );
};

export default QAPage;