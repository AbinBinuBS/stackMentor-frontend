import React from 'react';
import MenteeHeader from "../../components/commonComponents/menteeHeader";
import WalletBody from '../../components/menteeComponents/wallet/walletBody';

const WalletPage: React.FC = () => {
 
  return (
    <div className="flex flex-col bg-slate-100 min-h-screen">
    <MenteeHeader />
    <div className="flex flex-grow mt-32 justify-center"> 
        <main className="w-full max-w-4xl p-6 overflow-hidden"> 
            <WalletBody/>
        </main>
    </div>
</div>
  );
};

export default WalletPage;