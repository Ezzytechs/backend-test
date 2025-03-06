import * as yup from "yup";

export const userSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
});

export const postSchema = yup.object({
  title: yup.string().required(),
  content: yup.string().required(),
});

export const addressSchema = yup.object({
  street: yup.string().required(),
  city: yup.string().required(),
});
