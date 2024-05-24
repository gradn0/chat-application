import express from "express";
import cors from "cors";
import "dotenv/config";
import userRouter from "./routes/user";

export const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return String(error);
}

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use("/api/user", userRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})