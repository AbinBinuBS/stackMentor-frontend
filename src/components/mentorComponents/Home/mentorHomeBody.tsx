import React from "react";

const MentorHomeBody: React.FC = () => {
	return (
		<>
			<div className="flex flex-col lg:flex-row-reverse items-center justify-between w-full h-[300px] lg:h-[400px] my-10 bg-purple-50 p-6 lg:p-12 text-purple-800 font-sans">
				<div className="flex-1 lg:w-1/2">
					<h1 className="text-3xl lg:text-5xl font-bold mb-4 text-purple-900">
						Empower the Next Generation with Your Expertise
					</h1>
					<p className="text-base lg:text-xl mb-4 text-purple-700">
						Join our platform and share your experience to guide professionals
						through their career journeys. Your mentorship can make a profound
						difference.
					</p>
				</div>
				<div className="flex-shrink-0 lg:w-1/2 mt-6 lg:mt-0">
					<img
						src="/images/mentorLogo.png"
						className="w-80 h-full"
						alt="Mentorship"
					/>
				</div>
			</div>
			<div className="flex flex-col lg:flex-row items-center justify-around w-full h-auto my-16 p-6 lg:p-12">
				<a
					href="/connect-with-mentee"
					className="w-full lg:w-80 h-44 bg-purple-100 flex items-center justify-center rounded-lg shadow-md mb-4 lg:mb-0"
				>
					<i className="fa-solid fa-chalkboard-teacher text-4xl mx-4 text-purple-800"></i>
					<h2 className="text-xl text-purple-900">Connect with Mentee</h2>
				</a>
				<a
					href="/resolve-questions"
					className="w-full lg:w-80 h-44 bg-purple-100 flex items-center justify-center rounded-lg shadow-md mb-4 lg:mb-0"
				>
					<i className="fa-solid fa-handshake text-4xl mx-4 text-purple-800"></i>
					<h2 className="text-xl text-purple-900">Resolve Questions</h2>
				</a>
				<a
					href="/mentor/verify"
					className="w-full lg:w-80 h-44 bg-purple-100 flex items-center justify-center rounded-lg shadow-md"
				>
					<i className="fa-solid fa-rocket text-4xl mx-4 text-purple-800"></i>
					<h2 className="text-xl text-purple-900">Verify Account</h2>
				</a>
			</div>
			<div className="flex flex-col lg:flex-row items-center justify-between w-full h-auto my-16 p-6 lg:p-12 bg-purple-50 rounded-lg">
				<div className="flex-1 lg:w-1/2 px-4 lg:px-8">
					<h1 className="text-2xl lg:text-4xl font-bold mb-4 text-purple-900">
						Guide and Inspire as a Mentor
					</h1>
					<p className="text-base lg:text-xl text-purple-800">
						At our platform, we value the unique insights that experienced
						professionals like you bring. Help mentees navigate their career
						paths and achieve their full potential.
					</p>
				</div>
				<div className="flex-shrink-0 lg:w-1/2 mt-6 lg:mt-0">
					<img
						src="/images/mentor7.jpg"
						className="w-full h-full object-cover rounded-lg shadow-md"
						alt="About Mentorship"
					/>
				</div>
			</div>
			<div className="flex flex-col lg:flex-row items-center justify-center bg-purple-50 w-full h-auto rounded-lg my-32 p-6 lg:p-10">
				<div className="flex-1 lg:mr-10 mb-6 lg:mb-0 text-center lg:text-left">
					<h1 className="text-2xl lg:text-4xl font-bold mb-4 text-purple-900">
						Why Be a Mentor with Us?
					</h1>
					<p className="text-base lg:text-lg text-purple-800">
						By becoming a mentor, you have the opportunity to share your
						knowledge, offer guidance, and help others succeed in their careers.
						Join us to make a lasting impact.
					</p>
				</div>
			</div>
			<div className="px-4 lg:px-16 py-10">
				<div className="text-center mb-10">
					<h1 className="text-3xl lg:text-4xl font-bold text-purple-900">
						How You Can Contribute
					</h1>
				</div>
				<div className="flex flex-col lg:flex-row justify-center gap-8">
					<div className="w-full lg:w-[350px] h-auto bg-purple-100 rounded-xl p-6 shadow-md">
						<h2 className="text-xl lg:text-2xl font-semibold mb-4 text-purple-900">
							Personalized Mentoring
						</h2>
						<p className="text-base lg:text-lg text-purple-800">
							Offer one-on-one mentorship tailored to the specific needs and
							goals of your mentees.
						</p>
					</div>
					<div className="w-full lg:w-[350px] h-auto bg-purple-50 rounded-xl p-6 shadow-md">
						<h2 className="text-xl lg:text-2xl font-semibold mb-4 text-purple-900">
							Career Development
						</h2>
						<p className="text-base lg:text-lg text-purple-800">
							Provide strategic advice and structured plans to help mentees
							achieve their career milestones.
						</p>
					</div>
				</div>
				<div className="flex flex-col lg:flex-row justify-center gap-8 mt-10">
					<div className="w-full lg:w-[350px] h-auto bg-purple-100 rounded-xl p-6 shadow-md">
						<h2 className="text-xl lg:text-2xl font-semibold mb-4 text-purple-900">
							Mentor Matching
						</h2>
						<p className="text-base lg:text-lg text-purple-800">
							Be matched with mentees whose goals align with your expertise,
							ensuring a productive mentorship experience.
						</p>
					</div>
					<div className="w-full lg:w-[350px] h-auto bg-purple-50 rounded-xl p-6 shadow-md">
						<h2 className="text-xl lg:text-2xl font-semibold mb-4 text-purple-900">
							Mentorship Excellence
						</h2>
						<p className="text-base lg:text-lg text-purple-800">
							Engage in meaningful mentorship that fosters the growth and
							success of your mentees.
						</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default MentorHomeBody;
