import { Request, Response, NextFunction } from "express";
import { AnySchema, ValidationError } from "yup";

export const validate =
  (schema: AnySchema) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.validate(req.body, { abortEarly: false });
      next();
    } catch (err) {
      if (err instanceof ValidationError) {
        res.status(400).json({ errors: err.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  };
