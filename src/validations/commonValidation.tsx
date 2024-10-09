import * as Yup from 'yup';

export const signupValidation = Yup.object({
  name: Yup.string()
    .trim()
    .min(3, 'Name must be at least 3 characters')
    .required('Please enter your name'),

  email: Yup.string()
    .trim()
    .email('Please enter a valid email')
    .required('Please enter your email'),

  phone: Yup.string()
    .trim()
    .matches(/^[0-9]+$/, 'Phone number must be digits only')
    .min(10, 'Name must be at least 10 characters')
    .required('Please enter your phone number'),

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



export const otpValidation = Yup.object({
  otp: Yup.string()
    .trim()
    .length(6, 'OTP must be 6 digits')
    .matches(/^[0-9]+$/, 'OTP must be digits only')
    .required('Please enter the OTP'),
});

export const signInValidation = Yup.object({
  email:Yup.string()
  .trim()
  .email('Please enter a valid email')
  .required('Please enter your email'),

  password:Yup.string()
  .trim()
  .min(8, 'Password must be at least 8 characters')
  .required("Please Enter Your Password")
})


export const forgotPasswordValidation = Yup.object({
  email:Yup.string()
  .trim()
  .email('Please enter a valid email')
  .required('Please enter your email')
})



export const resetPasswordValidation = Yup.object({
  newPassword: Yup.string()
    .trim()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[\W_]/, 'Password must contain at least one special character')
    .required('Please enter your password'),

  confirmPassword: Yup.string()
    .trim()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your password'),
});


export const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(15, 'Title must be at least 15 characters')
    .required('Title is required'),
  body: Yup.string()
    .min(220, 'Body must be at least 220 characters')
    .required('Body is required'),
});


