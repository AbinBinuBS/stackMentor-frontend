const LandingBody = () => {
    return (
        <>
            <div className="flex items-center justify-around w-full h-72 my-10 font-sans">
                <div className="w-80 h-44 bg-custom-light-blue flex items-center justify-center">
                    <i className="fa-solid fa-person text-4xl mx-4"></i>
                    <h1 className="text-2xl">CONNECT WITH MENTOR</h1>
                </div>
                <div className="w-80 h-44 bg-custom-light-blue flex items-center justify-center">
                    <i className="fa-solid fa-book mx-4"></i>
                    <h1 className="text-2xl">ASK QUESTION</h1>
                </div>
                <div className="w-80 h-44 bg-custom-light-blue flex items-center justify-center">
                    <i className="fa-regular fa-paper-plane mx-4"></i>
                    <h1 className="text-2xl">BUILD YOUR OWN RESUME</h1>
                </div>
            </div>
            <div className="flex flex-col lg:flex-row items-center justify-between w-full h-auto lg:h-96 my-16 p-6">
                <div className="flex-1 px-4 lg:px-40">
                    <h1 className="text-2xl lg:text-4xl font-bold">Professional Mentorship & Career <br className="hidden lg:block" /> Guidance Consulting</h1>
                    <p className="mt-4 text-base lg:text-xl">
                        IT Mentor Group, Inc. has been empowering professionals with
                        <br className="hidden lg:block" />
                        expert mentorship and career guidance for over 20 years.
                        <br className="hidden lg:block" />
                        Imagine the growth and opportunities we can unlock for you.
                    </p>
                </div>
                <div className="flex-shrink-0 mt-6 lg:mt-0">
                    <img src="/images/bannerimg2.jpg" className="w-full lg:w-[500px]" alt="banner" />
                </div>
            </div>
            <div className="flex flex-col lg:flex-row items-center justify-center bg-custom-cyan w-full lg:w-[1250px] h-auto lg:h-[500px] rounded-r-full my-32 p-6 lg:p-10">
            <div className="flex-1 lg:mr-10 mb-6 lg:mb-0 text-center lg:text-left">
                <h1 className="text-2xl lg:text-4xl font-bold mb-4">
                    Our Platform Empowers You to Focus on Mentoring
                </h1>
                <p className="text-base lg:text-lg">
                    We carefully assess your expertise and mentoring style, then connect you with mentees who benefit the most from your guidance.
                </p>
            </div>
            <div className="flex-shrink-0 w-full lg:w-auto">
                <img src="/images/bannerimg3.png" alt="logo" className="w-full lg:w-[500px] h-auto object-cover" />
            </div>
        </div>

            <div className="px-4 lg:px-16 py-10">
            <div className="text-center mb-10">
                <h1 className="text-3xl lg:text-4xl font-bold">What We Do?</h1>
            </div>
            <div className="flex flex-col lg:flex-row justify-center gap-8">
                <div className="w-full lg:w-[350px] h-auto bg-blue-200 rounded-xl p-6 shadow-md">
                    <h2 className="text-xl lg:text-2xl font-semibold mb-4">IT Mentorship</h2>
                    <p className="text-base lg:text-lg">
                        Our seasoned mentors have guided numerous professionals to achieve their career aspirations and excel in their fields. Imagine the transformative impact we can have on your career growth.
                    </p>
                </div>
                <div className="w-full lg:w-[350px] h-auto bg-blue-50 rounded-xl p-6 shadow-md">
                    <h2 className="text-xl lg:text-2xl font-semibold mb-4">Mentorship and Career Development</h2>
                    <p className="text-base lg:text-lg">
                        From personalized mentorship plans and skill assessments to career guidance and goal setting, we have every aspect of your professional growth covered.
                    </p>
                </div>
            </div>
            <div className="flex flex-col lg:flex-row justify-center gap-8 mt-10">
                <div className="w-full lg:w-[350px] h-auto bg-blue-100 rounded-xl p-6 shadow-md">
                    <h2 className="text-xl lg:text-2xl font-semibold mb-4">Mentor Matching & Support</h2>
                    <p className="text-base lg:text-lg">
                        With over 20 years of experience and a broad network of industry professionals, we quickly connect you with mentees seeking your expertise and guidance to drive their career advancement.
                    </p>
                </div>
                <div className="w-full lg:w-[350px] h-auto bg-blue-200 rounded-xl p-6 shadow-md">
                    <h2 className="text-xl lg:text-2xl font-semibold mb-4">Mentorship Excellence</h2>
                    <p className="text-base lg:text-lg">
                        As career challenges and opportunities evolve, our mentorship team provides personalized guidance to address your unique professional needs and aspirations.
                    </p>
                </div>
            </div>
        </div>             
        </>
    );
};

export default LandingBody;
