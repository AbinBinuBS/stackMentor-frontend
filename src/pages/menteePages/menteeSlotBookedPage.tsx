import React, { useRef, useEffect } from 'react';
import MenteeHeader from "../../components/commonComponents/menteeHeader";
import MySlotBody from "../../components/menteeComponents/mySlot/mySlotBody";

const MenteeSlotBookedPage: React.FC = () => {
  const mainContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (mainContentRef.current) {
        mainContentRef.current.style.height = `calc(100vh - 264px)`;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <MenteeHeader />
      <div
        ref={mainContentRef}
        className="flex-grow overflow-y-auto mt-16 px-4 sm:px-6 lg:px-8"
        style={{
          paddingTop: '2rem',
          paddingBottom: '2rem'
        }}
      >
        <div
          className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
        >
          <MySlotBody />
        </div>
      </div>
    </div>
  );
};

export default MenteeSlotBookedPage;