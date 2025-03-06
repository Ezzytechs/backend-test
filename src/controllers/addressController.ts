import { Request, Response } from "express";
import db from "../db";

export const createAddress = async (req: Request, res: Response): Promise<void> => {
  try {
   
    //const user_id=req.params.user_id

    const { street, city, state, user_id } = req.body;

    // Check if user exists
    const user = await db("users").where({ id: user_id }).first();
    if (!user) {
       res.status(404).json({ error: "User not found" });
       return
    }
   

    // Check if the user already has an address
    const existingAddress = await db("addresses").where({ user_id }).first();
    if (existingAddress) {
      res.status(400).json({ error: "User already has an address" });
      return
    }
 
    // Insert new address
    const [id] = await db("addresses").insert({ user_id, street, state, city });

    res.status(201).json({ id, user_id, street, city });
    return
  } catch (error) {
   res.status(500).json({ error: "Failed to create address " + error });
   return
  }
};


export const getAddressByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const user_id  = Number(req.params.user_id);

    if (isNaN(user_id)) {
      res.status(400).json({ error: "Invalid user ID format" });
      return;
    }
    // Check if user exists
    const user = await db("users").where({ id: user_id }).first();
    if (!user) {
       res.status(404).json({ error: "User not found" });
       return
    }

    // Fetch address associated with user_id
    const address = await db("addresses").where({ user_id }).first();

    if (!address) {
     res.status(404).json({ error: "Address not found for this user" });
     return 
    }
    res.json(address);
    return
  } catch (error) {
     res.status(500).json({ error: "Failed to fetch address" });
     return
  }
};

export const updateAddress = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id } = req.params;
    const { street, city, state } = req.body;

    // Check if the user exists
    const user = await db("users").where({ id: user_id }).first();
    
    if (!user) {
       res.status(404).json({ error: "User not found" });
       return
    }

    // Check if the user has an address
    const existingAddress = await db("addresses").where({ user_id }).first();
    if (!existingAddress) {
     res.status(404).json({ error: "Address not found for this user" });
     return
    }

    // Update the address
    await db("addresses").where({ user_id }).update({ street, city, state });

    res.json({ message: "Address updated successfully" });
    return
  } catch (error) {
     res.status(500).json({ error: "Failed to update address " + error });
     return
  }
};
