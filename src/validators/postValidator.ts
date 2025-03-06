import * as yup from "yup";


const postSchema = yup.object({
  user_id:yup.number().required("User id must be provided"),
  title: yup.string().required(),
  body: yup.string().required(),
});

export default postSchema

