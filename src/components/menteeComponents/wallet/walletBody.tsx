import { Wallet, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import apiClientMentee from "../../../services/apiClientMentee";
import { LOCALHOST_URL } from "../../../constants/constants";
import { IWallet } from "../../../interfaces/ImenteeInferfaces";

const WalletBody = () => {
	const [userData, setUserData] = useState<IWallet>();
	const fetchWalletData = async () => {
		const response = await apiClientMentee.get(
			`${LOCALHOST_URL}/api/mentees/getWalletData`
		);
		setUserData(response.data.walletData);
	};
	useEffect(() => {
		fetchWalletData();
	}, []);

	return (
		<div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
			<div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
				<h2 className="text-xl font-semibold flex items-center space-x-2 text-white">
					<Wallet size={24} />
					<span>My Wallet</span>
				</h2>
			</div>
			<div className="p-6 space-y-4">
				<div>
					<label className="block text-sm font-medium text-[#1D2B6B] mb-1">
						Name
					</label>
					<div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-[#1D2B6B]">
						{userData?.name}
					</div>
				</div>
				<div>
					<label className="block text-sm font-medium text-[#1D2B6B] mb-1">
						Amount
					</label>
					<div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-[#1D2B6B]">
						₹{userData?.wallet}
					</div>
				</div>
				<div className="flex items-center justify-between text-sm text-[#1D2B6B]">
					<span className="flex items-center hover:text-[#2A3F7E] transition-colors duration-200">
						<CreditCard size={16} className="mr-1" />
						Card Balance
					</span>
					<span className="font-semibold">₹{userData?.wallet}</span>
				</div>
			</div>
		</div>
	);
};

export default WalletBody;
