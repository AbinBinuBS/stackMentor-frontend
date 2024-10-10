import { useNavigate } from "react-router-dom";
import { GraduationCap, Users } from "lucide-react";

const SelectingMentorOrMenteeBody = () => {
	const navigate = useNavigate();

	return (
		<div className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen flex flex-col items-center justify-center py-10 px-4">
			<h1 className="text-4xl font-bold text-gray-800 mb-10">
				Choose Your Path
			</h1>
			<div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
				<div className="bg-gradient-to-br from-[#1D2B6B] to-[#142057] shadow-lg rounded-xl p-8 w-full md:w-96 text-center transform transition duration-500 hover:scale-105">
					<GraduationCap className="mx-auto mb-4 text-white" size={48} />
					<h2 className="text-2xl font-semibold text-white mb-4">
						Mentee Portal
					</h2>
					<p className="text-gray-300 mb-6">
						Embark on your learning journey. Connect with experienced mentors,
						gain valuable insights, and accelerate your career growth.
					</p>
					<button
						className="bg-white text-[#1D2B6B] py-2 px-6 rounded-full hover:bg-gray-100 transition duration-300 font-semibold"
						onClick={() => navigate("/login")}
					>
						Enter as Mentee
					</button>
				</div>

				<div className="bg-gradient-to-br from-purple-600 to-purple-800 shadow-lg rounded-xl p-8 w-full md:w-96 text-center transform transition duration-500 hover:scale-105">
					<Users className="mx-auto mb-4 text-white" size={48} />
					<h2 className="text-2xl font-semibold text-white mb-4">
						Mentor Portal
					</h2>
					<p className="text-gray-300 mb-6">
						Share your expertise and make a difference. Guide the next
						generation of professionals and shape the future of your industry.
					</p>
					<button
						className="bg-white text-purple-700 py-2 px-6 rounded-full hover:bg-gray-100 transition duration-300 font-semibold"
						onClick={() => navigate("/mentor")}
					>
						Enter as Mentor
					</button>
				</div>
			</div>
		</div>
	);
};

export default SelectingMentorOrMenteeBody;
