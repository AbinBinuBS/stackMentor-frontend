import MentorSidebar from "../../components/commonComponents/mentorSidebar"
import MentorRegistorBody from "../../components/mentorComponents/Register/mentorRegistorBody"


const MentorRegisterPage = () =>{
    return(
        <div className="flex flex-col lg:flex-row w-full h-screen">
            <MentorSidebar/>
            <MentorRegistorBody/>
        </div>
    )
}
export default MentorRegisterPage