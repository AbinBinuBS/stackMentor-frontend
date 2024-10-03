import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { LOCALHOST_URL } from '../../../constants/constants';
import apiClientAdmin from '../../../services/apiClientAdmin';

interface IMentorDetails {
  name: string;
  dateOfBirth: string;
  preferredLanguage: string;
  email: string;
  degree: string;
  college: string;
  yearOfGraduation: string;
  jobTitle: string;
  lastWorkedCompany: string;
  yearsOfExperience: string;
  stack: string;
  resume: string;
  degreeCertificate: string;
  experienceCertificate: string;
  isVerified: boolean;
}

const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const AdminMentorDetailsBody: React.FC = () => {
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [mentorDetails, setMentorDetails] = useState<IMentorDetails | null>(null);
  const [statusUpdated, setStatusUpdated] = useState(false);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const getMentorDetails = async () => {
      try {
        const response = await apiClientAdmin.get(`${LOCALHOST_URL}/api/admin/getMentorDetails`, {
          params: { id }
        });
      
        if (response.status === 200 && response.data.message === "Success") {
          setMentorDetails(response.data.mentorData);
          setVerificationStatus(response.data.mentorData.isVerified ? 'verified' : 'pending');
        } else {
          toast.error(response.data.message || 'Failed to retrieve mentor details.');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || 'Request failed, please try again later.');
        } else if (error instanceof Error) {
          toast.error(error.message || 'An unexpected error occurred, please try again later.');
        }
      }
      
    };

    if (id) {
      getMentorDetails();
    }
  }, [id]);

  const DetailBox: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-lg font-semibold">
        {label.includes('Date') ? formatDate(value) : value}
      </p>
    </div>
  );

  const DocumentBox: React.FC<{ label: string; link: string }> = ({ label, link }) => (
    <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
      <p className="text-sm text-gray-500 mb-2">{label}</p>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
      >
        View Document
      </a>
    </div>
  );

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setVerificationStatus(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      // Update mentor status
      const updateResponse = await apiClientAdmin.post(`${LOCALHOST_URL}/api/admin/updateMentorStatus`, {
        id,
        status: verificationStatus
      });
    
      if (updateResponse.status === 200 && updateResponse.data.message === "Status updated successfully.") {
        toast.success('Mentor status updated successfully.');
        setStatusUpdated(true);
    
        const updatedResponse = await apiClientAdmin.get(`${LOCALHOST_URL}/api/admin/getMentorDetails`, {
          params: { id }
        });
    
        if (updatedResponse.status === 200 && updatedResponse.data.message === "Success") {
          setMentorDetails(updatedResponse.data.mentorData);
          setVerificationStatus(updatedResponse.data.mentorData.isVerified ? 'verified' : 'pending');
        } else {
          toast.error(updatedResponse.data.message || 'Error fetching updated details.');
        }
      } else {
        toast.error(updateResponse.data.message || 'Failed to update mentor status.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Request failed, please try again later.');
      } else if (error instanceof Error) {
        toast.error(error.message || 'An unexpected error occurred, please try again later.');
      }
    }
    
  };

  const renderStatusOptions = () => {
    if (mentorDetails && mentorDetails.isVerified) {
      return (
        <option value="verified">Verified</option>
      );
    } else {
      return (
        <>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </>
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl text-purple-400 font-bold mb-6 text-center">Mentor Details</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mentorDetails ? (
            <>
              <DetailBox label="Name" value={mentorDetails.name} />
              <DetailBox label="Date of Birth" value={mentorDetails.dateOfBirth} />
              <DetailBox label="Degree" value={mentorDetails.degree} />
              <DetailBox label="College" value={mentorDetails.college} />
              <DetailBox label="Year of Graduation" value={mentorDetails.yearOfGraduation} />
              <DetailBox label="Job Title" value={mentorDetails.jobTitle} />
              <DetailBox label="Last Worked Company" value={mentorDetails.lastWorkedCompany} />
              <DetailBox label="Years of Experience" value={mentorDetails.yearsOfExperience} />
              <DetailBox label="Tech Stack" value={mentorDetails.stack} />
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Documents</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mentorDetails ? (
            <>
              <DocumentBox label="Resume" link={mentorDetails.resume} />
              <DocumentBox label="Degree Certificate" link={mentorDetails.degreeCertificate} />
              <DocumentBox label="Experience Certificate" link={mentorDetails.experienceCertificate} />
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>

        {mentorDetails && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-2xl font-semibold mb-4">Verification</h2>
            <div className="flex items-center space-x-4">
              <label htmlFor="status" className="text-sm font-medium text-gray-700">
                Status:
              </label>
              <select
                id="status"
                value={verificationStatus}
                onChange={handleStatusChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                {renderStatusOptions()}
              </select>
            </div>
            <button
              onClick={handleSubmit}
              className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Update Status
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMentorDetailsBody;
