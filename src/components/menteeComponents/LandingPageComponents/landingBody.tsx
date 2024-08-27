import React from 'react';

const MenteeHomeBody: React.FC = () => {
    return (
        <>
            <div className="flex flex-col lg:flex-row items-center justify-between w-full h-[300px] lg:h-[400px] my-10 bg-blue-50 p-6 lg:p-12 text-blue-800 font-sans">
                <div className="flex-1 lg:w-1/2">
                    <h1 className="text-3xl lg:text-5xl font-bold mb-4 text-blue-900">
                        Take the Next Step in Your Career Journey
                    </h1>
                    <p className="text-base lg:text-xl mb-4 text-blue-700">
                        Join our platform to connect with experienced mentors who can guide you through your career development. Your growth starts here!
                    </p>
                </div>
                <div className="flex-shrink-0 lg:w-1/2 mt-6 lg:mt-0">
                    <img src="/images/menteeLogo.png" className="w-80 h-full" alt="Career Growth" />
                </div>
            </div>
            <div className="flex flex-col lg:flex-row items-center justify-around w-full h-auto my-16 p-6 lg:p-12">
                <a href="/find-mentor" className="w-full lg:w-80 h-44 bg-blue-100 flex items-center justify-center rounded-lg shadow-md mb-4 lg:mb-0">
                    <i className="fa-solid fa-user-tie text-4xl mx-4 text-blue-800"></i>
                    <h2 className="text-xl text-blue-900">Find a Mentor</h2>
                </a>
                <a href="/skill-development" className="w-full lg:w-80 h-44 bg-blue-100 flex items-center justify-center rounded-lg shadow-md mb-4 lg:mb-0">
                    <i className="fa-solid fa-laptop-code text-4xl mx-4 text-blue-800"></i>
                    <h2 className="text-xl text-blue-900">Skill Development</h2>
                </a>
                <a href="/career-guidance" className="w-full lg:w-80 h-44 bg-blue-100 flex items-center justify-center rounded-lg shadow-md">
                    <i className="fa-solid fa-briefcase text-4xl mx-4 text-blue-800"></i>
                    <h2 className="text-xl text-blue-900">Career Guidance</h2>
                </a>
            </div>
            <div className="flex flex-col lg:flex-row items-center justify-between w-full h-auto my-16 p-6 lg:p-12 bg-blue-50 rounded-lg">
                <div className="flex-1 lg:w-1/2 px-4 lg:px-8">
                    <h1 className="text-2xl lg:text-4xl font-bold mb-4 text-blue-900">Unlock Your Potential with Expert Guidance</h1>
                    <p className="text-base lg:text-xl text-blue-800">
                        Connect with industry professionals who can provide valuable insights and advice tailored to your career aspirations. Empower yourself with the knowledge and support you need to succeed.
                    </p>
                </div>
                <div className="flex-shrink-0 lg:w-1/2 mt-6 lg:mt-0">
                    <img src="/images/menteebanner2.jpeg" className="w-full h-full object-cover rounded-lg shadow-md" alt="Career Growth" />
                </div>
            </div>
            <div className="flex flex-col lg:flex-row items-center justify-center bg-blue-50 w-full h-auto rounded-lg my-32 p-6 lg:p-10">
                <div className="flex-1 lg:mr-10 mb-6 lg:mb-0 text-center lg:text-left">
                    <h1 className="text-2xl lg:text-4xl font-bold mb-4 text-blue-900">
                        Why Choose Us for Your Mentorship?
                    </h1>
                    <p className="text-base lg:text-lg text-blue-800">
                        Our platform offers personalized mentorship opportunities, tailored skill development, and career guidance to help you achieve your professional goals. Join us to start making strides in your career path.
                    </p>
                </div>
            </div>
            <div className="px-4 lg:px-16 py-10">
                <div className="text-center mb-10">
                    <h1 className="text-3xl lg:text-4xl font-bold text-blue-900">Ways to Make the Most of Your Mentorship</h1>
                </div>
                <div className="flex flex-col lg:flex-row justify-center gap-8">
                    <div className="w-full lg:w-[350px] h-auto bg-blue-100 rounded-xl p-6 shadow-md">
                        <h2 className="text-xl lg:text-2xl font-semibold mb-4 text-blue-900">Personalized Mentoring</h2>
                        <p className="text-base lg:text-lg text-blue-800">
                            Connect with mentors who can offer personalized guidance based on your unique career goals and challenges.
                        </p>
                    </div>
                    <div className="w-full lg:w-[350px] h-auto bg-blue-50 rounded-xl p-6 shadow-md">
                        <h2 className="text-xl lg:text-2xl font-semibold mb-4 text-blue-900">Skill Enhancement</h2>
                        <p className="text-base lg:text-lg text-blue-800">
                            Gain insights and advice on how to improve your skills and stay ahead in your industry.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row justify-center gap-8 mt-10">
                    <div className="w-full lg:w-[350px] h-auto bg-blue-100 rounded-xl p-6 shadow-md">
                        <h2 className="text-xl lg:text-2xl font-semibold mb-4 text-blue-900">Career Path Guidance</h2>
                        <p className="text-base lg:text-lg text-blue-800">
                            Receive strategic advice on navigating your career path and making informed decisions for your future.
                        </p>
                    </div>
                    <div className="w-full lg:w-[350px] h-auto bg-blue-50 rounded-xl p-6 shadow-md">
                        <h2 className="text-xl lg:text-2xl font-semibold mb-4 text-blue-900">Professional Growth</h2>
                        <p className="text-base lg:text-lg text-blue-800">
                            Engage in meaningful mentorship that supports your professional development and helps you achieve your career objectives.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MenteeHomeBody;
