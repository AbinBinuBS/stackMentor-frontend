const MentorSidebar = () => {
	return (
		<div className="hidden lg:flex items-center justify-end lg:h-screen lg:w-2/5 bg-purple-300">
			<div className="relative flex flex-col items-center justify-center bg-purple-300 w-4/5 h-4/5 shadow-2xl rounded-lg p-6">
				<div className="relative">
					<img
						src="/images/logo.png"
						alt="logo"
						className="w-80 h-auto mx-auto"
					/>
					<div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center w-full px-4 pt-4 hidden lg:block">
						<p className="text-lg text-gray-800 font-semibold mb-2">
							"Guide today, inspire tomorrow."
						</p>
						<p className="text-md text-gray-700">
							Your wisdom shapes the future.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MentorSidebar;
