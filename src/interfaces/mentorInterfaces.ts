export interface MentorVerifyFormValues {
    name: string; dateOfBirth: string; preferredLanguage: string; email: string; 
    degree: string; college: string; yearOfGraduation: string;
    jobTitle: string; lastWorkedCompany: string; yearsOfExperience: string; stack: string;
    resume: File | null; degreeCertificate: File | null; experienceCertificate: File | null;
}