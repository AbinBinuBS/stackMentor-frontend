import * as Yup from 'yup';


export const MentorsignupValidation = Yup.object({
    name: Yup.string()
      .trim()
      .min(3, 'Name must be at least 3 characters')
      .required('Please enter your name'),
  
    email: Yup.string()
      .trim()
      .email('Please enter a valid email')
      .required('Please enter your email'),
  
    password: Yup.string()
      .trim()
      .min(8, 'Password must be at least 8 characters')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(/[\W_]/, 'Password must contain at least one special character')
      .required('Please enter your password'),
  
    confirmPassword: Yup.string()
      .trim()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Please confirm your password'),
  });


  const allowedFileTypes: string[] = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  const fileValidation = Yup.mixed<File>()
  .required('File is required')
  .test('fileType', 'Unsupported file format', (value) => {
    if (value && value instanceof File) {
      return allowedFileTypes.includes(value.type);
    }
    return false;
  })
  .test('fileSize', 'File size is too large', (value) => {
    if (value && value instanceof File) {
      return value.size <= 5 * 1024 * 1024; 
    }
    return false;
  }); 

const MIN_DATE = new Date();
MIN_DATE.setFullYear(MIN_DATE.getFullYear() - 21);



export const mentorVerifyValidation = [
    Yup.object().shape({
      name: Yup.string()
      .trim()
      .required('Required'),
      dateOfBirth: Yup.date().required('Required').max(new Date(), 'Invalid'),
      preferredLanguage: Yup.string()
      .trim()
      .required('Required'),
      email: Yup.string()
      .trim()
      .email('Please enter a valid email')
      .required('Please enter your email'),
    }),
    Yup.object().shape({
        degree: Yup.string()
        .trim()
        .required('Required'), 
        college: Yup.string()
        .trim()
        .required('Required'),
        yearOfGraduation: Yup.number()
        .required('Required')
        .min(1900, 'Invalid')
        .max(new Date()
        .getFullYear(), 'Invalid'),
    }),
    Yup.object().shape({
        jobTitle: Yup.string()
        .trim()
        .required('Required'), 
        lastWorkedCompany: Yup.string()
        .trim()
        .required('Required'),
        yearsOfExperience: Yup.number()
        .required('Required')
        .min(0, 'Invalid'), 
        stack: Yup.string()
        .trim()
        .required('Required'),
    }),
    Yup.object().shape({
        resume: fileValidation,
        degreeCertificate:fileValidation,
        experienceCertificate: fileValidation,
    }),
];




export const timeSheduleValidation = Yup.object({
  date: Yup.string()
    .required('Date is required')
    .test('is-future-date', "You can only shedule date from tomorrow's date", (value) => {
      if (!value) return false;
      const inputDate = new Date(value);
      const today = new Date();
      today.setDate(today.getDate() );
      return inputDate >= today;
    }),
  startTime: Yup.string()
    .required('Start time is required')
    .test('is-valid-time', 'Start time must be earlier than end time', function (startTime) {
      const { endTime } = this.parent;
      if (!startTime || !endTime) return true; 
      return startTime < endTime;
    }),
  endTime: Yup.string().required('End time is required'),
  price: Yup.number()
    .required('Price is required')
    .positive('Price must be positive')
    .test('is-indian-currency', 'Price must be in Indian currency format', (value) => {
      if (!value) return false;
      const currencyFormat = /^[1-9]\d*(\.\d{1,2})?$/; 
      return currencyFormat.test(value.toString());
    }),
  category: Yup.string().required('Category is required'),
  about: Yup.string()
    .required('About section is required')
    .min(10, 'Must be at least 10 characters'),
  image: Yup.mixed()
    .required('Image is required')
    .test('is-image', 'Only image files are allowed', (value) => {
      if (!value) return false;
      const file = value as File;
      return file && file.type.startsWith('image/'); 
    }),
});

