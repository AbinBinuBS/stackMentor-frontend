import moment from "moment";
import * as Yup from "yup";

export const MentorsignupValidation = Yup.object({
	name: Yup.string()
		.trim()
		.min(3, "Name must be at least 3 characters")
		.required("Please enter your name"),

	email: Yup.string()
		.trim()
		.email("Please enter a valid email")
		.required("Please enter your email"),

	password: Yup.string()
		.trim()
		.min(8, "Password must be at least 8 characters")
		.matches(/[a-z]/, "Password must contain at least one lowercase letter")
		.matches(/[A-Z]/, "Password must contain at least one uppercase letter")
		.matches(/[0-9]/, "Password must contain at least one number")
		.matches(/[\W_]/, "Password must contain at least one special character")
		.required("Please enter your password"),

	confirmPassword: Yup.string()
		.trim()
		.oneOf([Yup.ref("password")], "Passwords must match")
		.required("Please confirm your password"),
});

const allowedImageTypes: string[] = ["image/jpeg", "image/png"];
const allowedPDFType: string = "application/pdf";

// Validation for image files
const imageFileValidation = Yup.mixed<File>()
	.required("File is required")
	.test("fileType", "Unsupported image format", (value) => {
		if (value && value instanceof File) {
			return allowedImageTypes.includes(value.type);
		}
		return false;
	})
	.test("fileSize", "Image file size is too large", (value) => {
		if (value && value instanceof File) {
			return value.size <= 5 * 1024 * 1024; // 5MB
		}
		return false;
	});

// Validation for PDF files
const pdfFileValidation = Yup.mixed<File>()
	.required("File is required")
	.test("fileType", "Unsupported file format, only PDF allowed", (value) => {
		if (value && value instanceof File) {
			return value.type === allowedPDFType;
		}
		return false;
	})
	.test("fileSize", "File size is too large", (value) => {
		if (value && value instanceof File) {
			return value.size <= 5 * 1024 * 1024; // 5MB
		}
		return false;
	});
	const MIN_DATE = new Date();
	MIN_DATE.setFullYear(MIN_DATE.getFullYear() - 21);
	
	export const mentorVerifyValidation = [
		Yup.object().shape({
			name: Yup.string().trim().required("Required"),
			dateOfBirth: Yup.date()
				.required("Required")
				.max(new Date(), "Invalid")
				.min(MIN_DATE, "You must be at least 21 years old"),
			image: imageFileValidation, // Only allow images for 'image' field
			about: Yup.string()
				.trim()
				.min(50, "About section must be at least 50 characters")
				.max(200, "About section cannot exceed 200 characters")
				.required("Required"),
		}),
		Yup.object().shape({
			degree: Yup.string().trim().required("Required"),
			college: Yup.string().trim().required("Required"),
			yearOfGraduation: Yup.number()
				.required("Required")
				.min(1900, "Invalid")
				.max(new Date().getFullYear(), "Invalid"),
		}),
		Yup.object().shape({
			jobTitle: Yup.string().trim().required("Required"),
			lastWorkedCompany: Yup.string().trim().required("Required"),
			yearsOfExperience: Yup.number().required("Required").min(0, "Invalid"),
			stack: Yup.string().trim().required("Required"),
		}),
		Yup.object().shape({
			resume: pdfFileValidation,
			degreeCertificate: pdfFileValidation,
			experienceCertificate: pdfFileValidation, 
		}),
	];
	

	export const timeSheduleValidation = Yup.object().shape({
		scheduleType: Yup.string().oneOf(['normal', 'weekly', 'custom']).required('Schedule type is required'),
		date: Yup.date().when('scheduleType', {
			is: 'normal',
			then: (schema) => schema.required('Date is required for normal scheduling')
				.min(moment().add(1, 'days').startOf('day'), "Date must be tomorrow or later"),
			otherwise: (schema) => schema.notRequired(),
		}),
		startTime: Yup.string().required('Start time is required'),
		endTime: Yup.string().required('End time is required')
			.test('is-greater', 'End time should be greater than start time', function(value) {
				const { startTime } = this.parent;
				return moment(value, "HH:mm").isAfter(moment(startTime, "HH:mm"));
			}),
		price: Yup.number().required('Price is required').positive('Price must be positive'),
		daysOfWeek: Yup.array().when('scheduleType', {
			is: 'weekly',
			then: (schema) => schema.min(1, 'At least one day must be selected for weekly scheduling'),
			otherwise: (schema) => schema.notRequired(),
		}),
		startDate: Yup.date().when('scheduleType', {
			is: 'weekly',
			then: (schema) => schema.required('Start date is required for weekly scheduling')
				.min(moment().add(1, 'days').startOf('day'), "Start date must be tomorrow or later"),
			otherwise: (schema) => schema.notRequired(),
		}),
		endDate: Yup.date().when('scheduleType', {
			is: 'weekly',
			then: (schema) => schema.required('End date is required for weekly scheduling')
				.min(Yup.ref('startDate'), 'End date must be after start date'),
			otherwise: (schema) => schema.notRequired(),
		}),
	});

export const editProfileValidation = Yup.object().shape({
	name: Yup.string().required("Name is required"),
	image: Yup.mixed()
		.nullable()
		.test("fileType", "Unsupported file format", function (value: any) {
			if (!value || !(value instanceof File)) return true;
			return ["image/jpeg", "image/png", "image/gif"].includes(value.type);
		})
		.test("fileSize", "File too large", function (value: any) {
			if (!value || !(value instanceof File)) return true;
			return value.size <= 5 * 1024 * 1024;
		}),
});

export const passwordValidationSchema = Yup.object().shape({
	oldPassword: Yup.string().required("Old password is required"),
	newPassword: Yup.string()
		.required("New password is required")
		.min(8, "Password must be at least 8 characters")
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
			"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
		),
	confirmNewPassword: Yup.string()
		.required("Confirm new password is required")
		.oneOf([Yup.ref("newPassword"), ""], "Passwords must match"),
});
