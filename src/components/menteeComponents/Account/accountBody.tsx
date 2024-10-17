import React, { useEffect, useState } from "react";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import apiClientMentee from "../../../services/apiClientMentee";
import { LOCALHOST_URL } from "../../../constants/constants";
import { IMentee } from "../../../interfaces/ImenteeInferfaces";
import axios from "axios";

interface ProfileFormValues {
  name: string;
}

interface PasswordFormValues {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const profileValidationSchema = Yup.object({
  name: Yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
});

const passwordValidationSchema = Yup.object({
  oldPassword: Yup.string().required("Old password is required"),
  newPassword: Yup.string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-zA-Z]/, "Password must contain at least one letter")
    .matches(/[0-9]/, "Password must contain at least one number"),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

const AccountBody: React.FC = () => {
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [mentorData, setMentorData] = useState<IMentee | null>(null);

  useEffect(() => {
    fetchMenteeDetails();
  }, []);

  const fetchMenteeDetails = async () => {
    try {
      const { data } = await apiClientMentee.post<IMentee>(`${LOCALHOST_URL}/api/mentees/getMenteeDetails`);
      setMentorData(data);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Unable to fetch data.");
      }
    }
  };

  const formik = useFormik<ProfileFormValues>({
    initialValues: {
      name: mentorData?.name || '',
    },
    enableReinitialize: true,
    validationSchema: profileValidationSchema,
    onSubmit: async (values: ProfileFormValues, { setSubmitting }: FormikHelpers<ProfileFormValues>) => {
      try {
        await apiClientMentee.put(`${LOCALHOST_URL}/api/mentees/updateProfile`, values);
        toast.success("Profile updated successfully");
        fetchMenteeDetails(); 
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Failed to update profile");
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const passwordFormik = useFormik<PasswordFormValues>({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: passwordValidationSchema,
    onSubmit: async (values: PasswordFormValues, { setSubmitting, resetForm }: FormikHelpers<PasswordFormValues>) => {
      try {
        await apiClientMentee.put(`${LOCALHOST_URL}/api/mentees/changePassword`, {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        });
        toast.success("Password changed successfully");
        resetForm();
        setShowPasswordFields(false);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data?.message) {
            if (error.response.data.message === "old password don't match") {
                toast.error("Old password doesn't match");
            } else {
                toast.error("An error occurred while changing the password.");
            }
        } else {
            toast.error("An unexpected error occurred.");
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const togglePasswordFields = () => {
    setShowPasswordFields(!showPasswordFields);
    if (!showPasswordFields) {
      passwordFormik.resetForm();
    }
  };

  const togglePasswordVisibility = (field: keyof PasswordFormValues) => {
    switch (field) {
      case "oldPassword":
        setShowOldPassword(!showOldPassword);
        break;
      case "newPassword":
        setShowNewPassword(!showNewPassword);
        break;
      case "confirmNewPassword":
        setShowConfirmNewPassword(!showConfirmNewPassword);
        break;
    }
  };

  return (
    <div className="flex justify-center items-center  bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold text-center mb-4">
          Account Settings
        </h2>

        <div className="mb-6">
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                {...formik.getFieldProps("name")}
                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1D2B6B] ${
                  formik.touched.name && formik.errors.name ? "border-red-500" : ""
                }`}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="text-red-500 text-xs mt-1">{formik.errors.name}</div>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={mentorData?.email || ''}
                readOnly
                className="w-full px-3 py-2 border rounded-md text-sm bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className={`w-full px-4 py-2 text-sm text-white bg-gradient-to-r from-[#1D2B6B] to-[#142057] hover:from-[#2A3F7E] hover:to-[#0A102E] rounded-md focus:outline-none transition duration-300 ease-in-out ${
                  formik.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {formik.isSubmitting ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>

        <div className="border-t pt-4">
          <button
            onClick={togglePasswordFields}
            className="w-full px-4 py-2 text-sm text-[#1D2B6B] border border-[#1D2B6B] rounded-md hover:bg-[#1D2B6B] hover:text-white focus:outline-none mb-4 transition duration-300 ease-in-out"
          >
            {showPasswordFields ? "Cancel Password Change" : "Change Password"}
          </button>

          {showPasswordFields && (
            <form onSubmit={passwordFormik.handleSubmit} className="space-y-4">
              {(["oldPassword", "newPassword", "confirmNewPassword"] as const).map((field) => (
                <div key={field} className="relative">
                  <label
                    htmlFor={field}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {field === "oldPassword" ? "Old Password" : field === "newPassword" ? "New Password" : "Confirm New Password"}
                  </label>
                  <input
                    type={field === "oldPassword" ? (showOldPassword ? "text" : "password") :
                          field === "newPassword" ? (showNewPassword ? "text" : "password") :
                          (showConfirmNewPassword ? "text" : "password")}
                    id={field}
                    {...passwordFormik.getFieldProps(field)}
                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1D2B6B] pr-10 ${
                      passwordFormik.touched[field] && passwordFormik.errors[field] ? "border-red-500" : ""
                    }`}
                    placeholder={`Enter ${field === "oldPassword" ? "old" : field === "newPassword" ? "new" : "confirm new"} password`}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility(field)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-6"
                  >
                    {(field === "oldPassword" && showOldPassword) ||
                     (field === "newPassword" && showNewPassword) ||
                     (field === "confirmNewPassword" && showConfirmNewPassword) ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  {passwordFormik.touched[field] && passwordFormik.errors[field] && (
                    <div className="text-red-500 text-xs mt-1">{passwordFormik.errors[field]}</div>
                  )}
                </div>
              ))}
              <div>
                <button
                  type="submit"
                  disabled={passwordFormik.isSubmitting}
                  className={`w-full px-4 py-2 text-sm text-white bg-gradient-to-r from-[#1D2B6B] to-[#142057] hover:from-[#2A3F7E] hover:to-[#0A102E] rounded-md focus:outline-none transition duration-300 ease-in-out ${
                    passwordFormik.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {passwordFormik.isSubmitting ? 'Changing Password...' : 'Save Password Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountBody;