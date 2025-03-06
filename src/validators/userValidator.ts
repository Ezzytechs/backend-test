import * as yup from "yup";

 const userSchema = yup.object({
  username: yup.string().required("username is required"),
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup.string().email().required("email is required"),
});

export default userSchema