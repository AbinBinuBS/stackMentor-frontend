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