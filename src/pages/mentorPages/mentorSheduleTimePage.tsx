import MentorAccountSidebar from "../../components/commonComponents/mentorAccountSidebar"
import MentorHeader from "../../components/commonComponents/mentorHeader"
import MentorSheduleTimeBody from "../../components/mentorComponents/Shedule Time/mentorSheduletimeBody"


const MentorSheduleTimePage = () =>{
    return(
        <div className="flex flex-col min-h-screen bg-gray-100">
        <MentorHeader />
        <div className="flex flex-1  overflow-y-auto">
          <MentorAccountSidebar />
          <main className="flex-1 mt-16 overflow-y-auto  ">
            <MentorSheduleTimeBody/>
          </main>
        </div>
      </div>
    )
}

export default MentorSheduleTimePage