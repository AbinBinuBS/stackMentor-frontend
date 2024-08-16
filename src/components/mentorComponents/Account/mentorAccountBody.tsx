import React, { useState } from 'react';

const MentorAccountBody = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Account Settings</h2>
        <form>
          <div className="mb-4 text-center">
            <label htmlFor="profileImage" className="block text-gray-700 font-medium mb-2">
              Profile Picture
            </label>
            <div className="relative w-32 h-32 mx-auto mb-4">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full rounded-full object-cover shadow-md" />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center shadow-md">
                  <span className="text-gray-500">Upload</span>
                </div>
              )}
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="John Doe"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="example@example.com"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="********"
            />
          </div>
          <div className="flex justify-center">
            <button className="px-6 py-2 text-white bg-purple-600 rounded-full hover:bg-purple-700 focus:outline-none">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MentorAccountBody;
