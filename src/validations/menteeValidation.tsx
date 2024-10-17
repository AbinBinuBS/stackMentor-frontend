import * as Yup from "yup";

export const ratingSchema = Yup.object().shape({
    rating: Yup.number().min(1, "Please select a rating").required("Rating is required"),
    comment: Yup.string()
      .min(50, "Comment must be at least 50 characters")
      .max(150, "Comment must not exceed 150 characters")
      .required("Comment is required"),
  });