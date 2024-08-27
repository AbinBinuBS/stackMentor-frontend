import React, { useState } from 'react';
import { ISlot } from '../../../interfaces/ImenteeInferfaces';

interface MenteeSingleMentorBodyProps {
  slots: ISlot[] | null;
}

const MenteeSingleMentorBody: React.FC<MenteeSingleMentorBodyProps> = ({ slots }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const sessionsPerPage: number = 5;

  // Ensure slots is not null before performing operations
  const filteredSlots = slots || [];
  
  const indexOfLastSession: number = currentPage * sessionsPerPage;
  const indexOfFirstSession: number = indexOfLastSession - sessionsPerPage;
  const currentSessions: ISlot[] = filteredSlots.slice(indexOfFirstSession, indexOfLastSession);

  // Change page
  const paginate = (pageNumber: number): void => setCurrentPage(pageNumber);

  // Convert 24-hour format to 12-hour format with AM/PM
  const convertTo12HourFormat = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const adjustedHours = hours % 12 || 12;
    const formattedHours = adjustedHours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${period}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Date</th>
            <th className="border p-2">Time</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentSessions.map((session, index) => (
            <tr key={index} className="border-b">
              <td className="border p-2 text-center">
                {new Date(session.date).toDateString()}
              </td>
              <td className="border p-2 text-center">
                {convertTo12HourFormat(session.startTime)} - {convertTo12HourFormat(session.endTime)}
              </td>
              <td className="border p-2 text-center">{session.price}</td>
              <td className="border p-2 text-center">
                <span className={`px-2 py-1 rounded ${
                  session.isBooked ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'
                }`}>
                  {session.isBooked ? 'Booked' : 'Available'}
                </span>
              </td>
              <td className="border p-2 text-center">
                <button 
                  className={`px-4 py-2 rounded ${
                    !session.isBooked 
                      ? 'bg-gradient-to-r from-[#1D2B6B] to-[#142057] hover:from-[#2A3F7E] hover:to-[#0A102E] text-white' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={session.isBooked}
                >
                  {session.isBooked ? 'Unavailable' : 'Book'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-center">
        {Array.from({ length: Math.ceil(filteredSlots.length / sessionsPerPage) }, (_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className={`mx-1 px-3 py-1 rounded ${
              currentPage === i + 1
                ? 'bg-gradient-to-r from-[#1D2B6B] to-[#142057] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MenteeSingleMentorBody;
