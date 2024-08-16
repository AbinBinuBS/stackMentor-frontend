import Footer from "../../components/commonComponents/Footer"
import MenteeHeader from "../../components/commonComponents/menteeHeader"
import LandingBody from "../../components/menteeComponents/LandingPageComponents/landingBody"
import LandingHeadline from "../../components/menteeComponents/LandingPageComponents/landingHeadline"


const LandingPage = () =>{
    return (
        <>
            <MenteeHeader/>
            <LandingHeadline/>
            <LandingBody/>
            <Footer/>
        </>
    )
}

export default LandingPage