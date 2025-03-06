import { Request, Response } from "express";
import db from "../db";

export const createPost = async (req: Request, res: Response) => {
  try {
    const {user_id}=req.body
        // Check if the user exists
        const user = await db("users").where({ id: user_id }).first();
    
        if (!user) {
           res.status(404).json({ error: "User not found" });
           return
        }
    
    const [id] = await db("posts").insert(req.body);
    res.status(201).json({ id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: "Failed to create post "+error});
  }
};

export const getUserPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id } = req.params; // Get user_id from request params

    // Fetch posts where user_id matches
    const posts = await db("posts").where({ user_id });

    if (posts.length === 0) {
      res.status(404).json({ message: "No posts found for this user" });
      return
    }
    res.json(posts);
    return 
  } catch (error) {
  res.status(500).json({ error: "Failed to fetch posts" });
  return
  }
};

export const deletePostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { post_id } = req.params;

    // Check if the post exists
    const post = await db("posts").where({id: post_id }).first();

    if (!post) {
    res.status(404).json({ error: "Post not found" });
    return
    }

    // Delete the post
    await db("posts").where({id: post_id }).del();

     res.status(200).json({ message: "Post deleted successfully" });
     return
  } catch (error) {
    res.status(500).json({ error: "Failed to delete post " + error });
    return
  }
};
