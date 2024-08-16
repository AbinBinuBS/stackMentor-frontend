
const MentorMySlotBody = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex flex-col justify-between w-[900px] h-[200px] bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between">
          <div className="text-lg font-semibold">Date</div>
          <div className="text-gray-600">2024-08-15</div>
        </div>
        <div className="flex justify-between">
          <div className="text-lg font-semibold">Start Time</div>
          <div className="text-gray-600">10:00 AM</div>
        </div>
        <div className="flex justify-between">
          <div className="text-lg font-semibold">End Time</div>
          <div className="text-gray-600">11:00 AM</div>
        </div>
        <div className="flex justify-end space-x-4 mt-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">
            Reschedule
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600">
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorMySlotBody;
