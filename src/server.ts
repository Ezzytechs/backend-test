import express from "express";
import db from "./db";
import userRouter from "./routes/userRoutes";
import postRouter from "./routes/postRoutes";
import addressRouter from "./routes/addressRoutes";
import "express-async-errors";

const app = express();
app.use(express.json());
app.use("/api/addresses", addressRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);

// Global Error Handler
app.use((err: Error, req: any, res: any, next: any) => {
  res.status(500).json({ message: err.message });
});

// Only start the server if not in a test environment
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  // Graceful shutdown
  const gracefulShutdown = async () => {
    console.log("Shutting down server...");
    server.close(() => console.log("Server closed"));
    await db.destroy();
  };

  process.on("SIGINT", gracefulShutdown);
  process.on("SIGTERM", gracefulShutdown);
}

export default app