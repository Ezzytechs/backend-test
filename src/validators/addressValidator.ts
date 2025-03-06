import * as yup from "yup";


const addressSchema = yup.object({
  street: yup.string().required(),
  city: yup.string().required(),
  state: yup.string().required(),
  user_id: yup.number().required("User ID is required")
});

export default addressSchema;