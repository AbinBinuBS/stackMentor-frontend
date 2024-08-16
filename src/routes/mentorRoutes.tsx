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



const MentorRoutes = () =>{
    return(
        <Routes>
            <Route path="/" element={<MentorLoginPage/>} />
            <Route path="/register" element={<MentorRegisterPage/>} />
            <Route path="/otp" element={<MentorOtpPage/>} />
            <Route path="/forgot-password" element={<MentorForgotPasswordEmailPage/>} />
            <Route path="/forgot-password-otp" element={<MentorForgotPasswordOtpPage/>} />
            <Route path="/forgot-password-reset" element={<MentorForgotPasswordResetPage/>} />
            <Route path="/home" element={<MentorHomePage/>} />
            <Route path="/verify" element={<MentorVerifyPage/>} />
            <Route path="/account" element={<MentorAccountPage/>} />
            <Route path="/schedule-time" element={<MentorSheduleTimePage/>} />
            <Route path="/my-slot" element={<MentorMySlotPage/>} />
        </Routes>
    )
}
export default MentorRoutes