import React from "react";
import { MenteeSingleMentorSidebarProps } from "../../../interfaces/ImenteeInferfaces";

const MenteeSingleMentorSidebar: React.FC<MenteeSingleMentorSidebarProps> = ({
	mentor,
}) => {
	return (
		<div className="w-64 ml-6">
			<div className="bg-white rounded-lg shadow-md p-6">
				<div className="flex flex-col items-center">
					<img
						src={mentor?.image}
						alt={mentor?.name}
						className="w-32 h-32 rounded-full object-cover mb-4"
					/>
					<h2 className="text-xl font-semibold mb-2">{mentor?.name}</h2>
					<p className="text-sm text-gray-600 mb-4 text-center">
						{mentor?.yearsOfExperience} years of experience.
					</p>
					<button className="bg-gradient-to-r from-[#1D2B6B] to-[#142057] hover:from-[#2A3F7E] hover:to-[#0A102E] text-white px-4 py-2 rounded-full">
						Verified Mentor
					</button>
				</div>
			</div>
		</div>
	);
};

export default MenteeSingleMentorSidebar;
