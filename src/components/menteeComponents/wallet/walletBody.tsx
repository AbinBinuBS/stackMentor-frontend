import { Wallet, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import apiClientMentee from "../../../services/apiClientMentee";
import { LOCALHOST_URL } from "../../../constants/constants";
import { IWallet } from "../../../interfaces/ImenteeInferfaces";
import dayjs from "dayjs"; 

interface WalletHistory {
  id: number;
  date: string;
  description: string;
  amount: number;
  transactionType: string;
  balanceAfterTransaction: number; 
}

const WalletBody = () => {
  const [userData, setUserData] = useState<IWallet>();
  const [walletHistory, setWalletHistory] = useState<WalletHistory[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showHistory, setShowHistory] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const recordsPerPage = 5;

  const fetchWalletData = async (page: number) => {
    try {
      const response = await apiClientMentee.get(`${LOCALHOST_URL}/api/mentees/getWalletData`, {
        params: {
          page: page,
          limit: recordsPerPage
        },
      });
      if (response.data) {
        setUserData(response.data.walletData.mentee);
        setWalletHistory(response.data.walletData.mentee.walletHistory);
        setTotalPages(Math.ceil(response.data.walletData.total / recordsPerPage));
      }
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    }
  };

  useEffect(() => {
    fetchWalletData(currentPage);
  }, [currentPage, showHistory]);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-[#142057] to-[#0A102E] p-4">
        <h2 className="text-xl font-semibold flex items-center space-x-2 text-white">
          <Wallet size={24} />
          <span>My Wallet</span>
        </h2>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#142057] mb-1">
            Name
          </label>
          <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-[#142057]">
            {userData?.name}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#142057] mb-1">
            Amount
          </label>
          <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-[#142057]">
            ₹{userData?.wallet}
          </div>
        </div>
        <div className="flex items-center justify-between text-sm text-[#142057]">
          <span className="flex items-center hover:text-[#2A3F7E] transition-colors duration-200">
            <CreditCard size={16} className="mr-1" />
            Card Balance
          </span>
          <span className="font-semibold">₹{userData?.wallet}</span>
        </div>
      </div>

      <div className="px-6 py-4">
        <button
          onClick={() => {
            setShowHistory(!showHistory);
            if (!showHistory) {
              fetchWalletData(1);
            }
          }}
          className="px-4 py-2 bg-[#142057] text-white rounded-md hover:bg-[#2A3F7E] transition"
        >
          {showHistory ? "Hide Wallet History" : "Show Wallet History"}
        </button>
      </div>

      {showHistory && (
        <div className="bg-gray-100 mt-4 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-[#142057]">Wallet History</h2>
          {walletHistory.length > 0 ? (
            <>
              <table className="min-w-full bg-white border border-gray-300 mb-4">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border-b text-center">No.</th>
                    <th className="py-2 px-4 border-b text-center">Amount</th>
                    <th className="py-2 px-4 border-b text-center">Description</th>
                    <th className="py-2 px-4 border-b text-center">Date</th>
                    <th className="py-2 px-4 border-b text-center">Balance</th> 
                  </tr>
                </thead>
                <tbody>
                  {walletHistory.map((history, index) => (
                    <tr key={history.id}>
                      <td className="py-2 px-4 border-b text-center">
                        {((currentPage - 1) * recordsPerPage) + index + 1}
                      </td>
                      <td
                        className={`py-2 px-4 border-b text-center font-semibold ${
                          history.amount > 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {history.amount > 0
                          ? `+₹${history.amount}`
                          : `-₹${Math.abs(history.amount)}`}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        {history.description}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        {dayjs(history.date).format('YYYY-MM-DD HH:mm:ss')}
                      </td>
                      <td className={`py-2 px-4 border-b text-center font-semibold ${
                          history.transactionType === 'credit' ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        ₹{history.balanceAfterTransaction}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-500"
                        : "bg-[#142057] text-white hover:bg-[#2A3F7E]"
                    }`}
                  >
                    Previous
                  </button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-500"
                        : "bg-[#142057] text-white hover:bg-[#2A3F7E]"
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No wallet history available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletBody;