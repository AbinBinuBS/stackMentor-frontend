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

const MenteeRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<MenteeLoginProtectiveCheck element={<MenteeLogin />} />} />
      <Route path="/register" element={<MenteeLoginProtectiveCheck element={<MenteeRegister />} />} />
      <Route path="/forgotPassword" element={<MenteeLoginProtectiveCheck element={<MenteeForgotPassword />} />} />
      <Route path="/forgot-password-otp" element={<MenteeLoginProtectiveCheck element={<MenteeForgotPasswordOtp />} />} />
      <Route path="/reset-password" element={<MenteeLoginProtectiveCheck element={<MenteeForgotPasswordReset />} />} />
      <Route path="/otp" element={<MenteeLogoutProtectiveCheck element={<OtpPage />} />} />
    </Routes>
  );
};

export default MenteeRoutes;
