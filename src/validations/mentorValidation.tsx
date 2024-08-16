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





export const mentorVerifyValidation = [
    Yup.object().shape({
        name: Yup.string().required('Required'), 
        dateOfBirth: Yup.date().required('Required').max(new Date(), 'Invalid'),
        preferredLanguage: Yup.string().required('Required'),
        email: Yup.string().email('Invalid email').required('Required'),
    }),
    Yup.object().shape({
        degree: Yup.string().required('Required'), 
        college: Yup.string().required('Required'),
        yearOfGraduation: Yup.number().required('Required').min(1900, 'Invalid').max(new Date().getFullYear(), 'Invalid'),
    }),
    Yup.object().shape({
        jobTitle: Yup.string().required('Required'), 
        lastWorkedCompany: Yup.string().required('Required'),
        yearsOfExperience: Yup.number().required('Required').min(0, 'Invalid'), 
        stack: Yup.string().required('Required'),
    }),
    Yup.object().shape({
        resume: Yup.mixed().required('Required'),
        degreeCertificate: Yup.mixed().required('Required'),
        experienceCertificate: Yup.mixed().required('Required'),
    }),
];