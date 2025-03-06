import { Request, Response } from "express";
import db from "../db";
import * as yup from "yup";
import userSchema from "../validators/userValidator";

export const getUsers = async (req: Request, res: Response) => {
  try {
    let { page, limit } = req.query;

    // Convert query parameters to numbers with defaults
    const pageNumber = parseInt(page as string, 10) || 1;
    const limitNumber = parseInt(limit as string, 10) || 10;
    const offset = (pageNumber - 1) * limitNumber;

    // Get users with pagination
    const users = await db("users").select().limit(limitNumber).offset(offset);

    // Get total user count for pagination metadata
    const [{ count }] = await db("users").count({ count: "*" });

    res.json({
      page: pageNumber,
      limit: limitNumber,
      totalUsers: parseInt(count as string, 10),
      totalPages: Math.ceil(parseInt(count as string, 10) / limitNumber),
      data: users,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body
    await userSchema.validate(req.body, { abortEarly: false });

    const [id] = await db("users").insert(req.body);
    res.status(201).json({ id, ...req.body });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
    res.status(400).json({
        errors: error.errors, // Return validation errors
      });
      return 
    }
    res.status(500).json({ error: "Failed to create user "+ error});
  }
};


export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id); // Convert id to number

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid user ID format" });
      return;
    }

    // Fetch user by ID
    const user = await db("users").where({ id }).first();

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

export const getTotalUsers = async (req: Request, res: Response) => {
  try {
    const [{ count }] = await db("users").count({ count: "*" });
    
    res.json({ totalUsers: parseInt(count as string, 10) });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch total users " + error});
  }
}

