import Footer from "../../components/commonComponents/Footer";
import MenteeHeader from "../../components/commonComponents/menteeHeader";
import MenteeHomeBody from "../../components/menteeComponents/LandingPageComponents/landingBody";

const LandingPage = () => {
    return (
        <div className="bg-slate-50 min-h-screen">
            <MenteeHeader />
            <MenteeHomeBody />
            <Footer />
        </div>
    );
}

export default LandingPage;
