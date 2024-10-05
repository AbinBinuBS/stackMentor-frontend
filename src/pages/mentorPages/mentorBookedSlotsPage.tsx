import React from 'react';
import MentorAccountSidebar from "../../components/commonComponents/mentorAccountSidebar";
import MentorHeader from "../../components/commonComponents/mentorHeader";
import MentorBookedSlotsBody from "../../components/mentorComponents/BookedSlots/mentorBookedSlotsBody";

const MentorBookedSlotsPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <MentorHeader />
      <div className="flex flex-1 bg-slate-50 overflow-y-auto">
        <MentorAccountSidebar />
        <main className="flex-1 ml-96 mt-40 overflow-y-auto  ">
        <MentorBookedSlotsBody />
        </main>
      </div>
    </div>
  );
};

export default MentorBookedSlotsPage;