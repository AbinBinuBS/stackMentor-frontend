import { Route, Routes } from "react-router-dom";
import LandingPage from "../pages/menteePages/landingPage";
import MenteeLogin from "../pages/menteePages/menteeLoginPage";
import MenteeRegister from "../pages/menteePages/menteeRegisterPage";
import MenteeForgotPassword from "../pages/menteePages/MenteeForgotPasswordPage";
import OtpPage from "../pages/menteePages/menteeOtpPage";
import MenteeForgotPasswordOtp from "../pages/menteePages/menteeForgotPasswordOtpPage";
import MenteeForgotPasswordReset from "../pages/menteePages/MenteeForgotPasswordResetPage";
import MenteeLoginProtectiveCheck from "../protectiveCheck/menteeLoginProtectiveCheck";
import MenteeLogoutProtectiveCheck from "../protectiveCheck/menteeLogoutProtectiveCheck";
import MenteeDisplayMentorPage from "../pages/menteePages/menteeDisplayMentorPage";
import MenteeSignleMentorPage from "../pages/menteePages/menteeSignleMentorPage";
import MenteeSlotBookedPage from "../pages/menteePages/menteeSlotBookedPage";
import ChatPage from "../pages/chatpages/chatPage";
import WalletPage from "../pages/menteePages/walletPage";

const MenteeRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<MenteeLogoutProtectiveCheck element={<MenteeLogin />} />} />
      <Route path="/register" element={<MenteeLogoutProtectiveCheck element={<MenteeRegister />} />} />
      <Route path="/forgotPassword" element={<MenteeLogoutProtectiveCheck element={<MenteeForgotPassword />} />} />
      <Route path="/forgot-password-otp" element={<MenteeLogoutProtectiveCheck element={<MenteeForgotPasswordOtp />} />} />
      <Route path="/reset-password" element={<MenteeLogoutProtectiveCheck element={<MenteeForgotPasswordReset />} />} />
      <Route path="/otp" element={<MenteeLogoutProtectiveCheck element={<OtpPage />} />} />
      <Route path="/mentorList" element={<MenteeLoginProtectiveCheck element={<MenteeDisplayMentorPage />} />} />
      <Route path='/mentorDetails/:id' element={<MenteeLoginProtectiveCheck element={<MenteeSignleMentorPage/>}/>}/>
      <Route path="/MySlot" element={<MenteeLoginProtectiveCheck element={<MenteeSlotBookedPage />} />} />
      <Route path="/chat" element={<MenteeLoginProtectiveCheck element={<ChatPage />} />} />
      <Route path="/wallet" element={<MenteeLoginProtectiveCheck element={<WalletPage />} />} />


      
    </Routes>
  );
};

export default MenteeRoutes;
