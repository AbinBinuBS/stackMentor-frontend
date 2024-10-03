import { Route, Routes } from "react-router-dom"
import MentorLoginPage from "../pages/mentorPages/mentorLoginPage"
import MentorRegisterPage from "../pages/mentorPages/mentorRegisterPage"
import MentorOtpPage from "../pages/mentorPages/MentorOtpPage"
import MentorForgotPasswordEmailPage from "../pages/mentorPages/mentorForgotPasswordEmailPage"
import MentorForgotPasswordOtpPage from "../pages/mentorPages/mentorForgotPasswordOtpPage"
import MentorForgotPasswordResetPage from "../pages/mentorPages/mentorForgotPasswordResetPage"
import MentorHomePage from "../pages/mentorPages/mentorHomePage"
import MentorVerifyPage from "../pages/mentorPages/mentorVerifyPage"
import MentorAccountPage from "../pages/mentorPages/mentorAccountPage"
import MentorSheduleTimePage from "../pages/mentorPages/mentorSheduleTimePage"
import MentorMySlotPage from "../pages/mentorPages/mentorMySlotPage"
import MentorProtectiveCheckLogout from "../protectiveCheck/mentorLogoutProtectiveCheck"
import MentorProtectiveCheck from "../protectiveCheck/mentorProtectiveCheck"
import MentorBookedSlotsPage from "../pages/mentorPages/mentorBookedSlotsPage"
import MentorChatPage from "../pages/chatpages/mentorChatPage"
import RoomPage from "../pages/mentorPages/room"
import QAPage from "../pages/mentorPages/aqPage"
import CommunityMeetPage from "../pages/mentorPages/communityMeet"
import MyCommunityPage from "../pages/mentorPages/myCommunityPage"
import MentorGroupCallPage from "../pages/mentorPages/mentorGroupcallPage"



const MentorRoutes = () =>{
    return(
        <Routes>
            <Route path="/"  element={< MentorProtectiveCheckLogout element={<MentorLoginPage/>} />}/>
            <Route path="/register" element={< MentorProtectiveCheckLogout element={<MentorRegisterPage/>} />} />
            <Route path="/otp" element={< MentorProtectiveCheckLogout element={<MentorOtpPage/>} />}  />
            <Route path="/forgot-password" element={< MentorProtectiveCheckLogout element={<MentorForgotPasswordEmailPage/>} />} />
            <Route path="/forgot-password-otp" element={< MentorProtectiveCheckLogout element={<MentorForgotPasswordOtpPage/>} />}  />
            <Route path="/forgot-password-reset" element={< MentorProtectiveCheckLogout element={<MentorForgotPasswordResetPage/>} />}  />
            <Route path="/home"  element={< MentorProtectiveCheck element={<MentorHomePage/>} />} />
            <Route path="/verify" element={< MentorProtectiveCheck element={<MentorVerifyPage/>} />}  />
            <Route path="/account" element={< MentorProtectiveCheck element={<MentorAccountPage/>} />}  />
            <Route path="/schedule-time" element={< MentorProtectiveCheck element={<MentorSheduleTimePage/>} />}  />
            <Route path="/my-slot" element={< MentorProtectiveCheck element={<MentorMySlotPage/>} />}  />
            <Route path="/booked-slot" element={< MentorProtectiveCheck element={<MentorBookedSlotsPage/>} />}  />
            <Route path="/chat" element={< MentorProtectiveCheck element={<MentorChatPage/>} />}  />
            <Route path="/room/:roomId" element={< MentorProtectiveCheck element={<RoomPage/>} />}  />
            <Route path="/qa" element={< MentorProtectiveCheck element={<QAPage/>} />}  />
            <Route path="/community-meet" element={< MentorProtectiveCheck element={<CommunityMeetPage/>} />}  />
            <Route path="/my-community-meet" element={< MentorProtectiveCheck element={<MyCommunityPage/>} />}  />
            <Route path="/community/room/:roomId" element={< MentorProtectiveCheck element={<MentorGroupCallPage/>} />}  />

           

            
        </Routes>
    )
}
export default MentorRoutes