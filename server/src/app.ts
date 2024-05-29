import express from "express";
import cors from "cors";
import "dotenv/config";
import userRouter from "./routes/user";
import { Server } from "socket.io";
import { createServer } from "http";
import handleSockets from "./routes/socket";

export const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return String(error);
}

const app = express();
const port = process.env.PORT;
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(cors());
app.use(express.json());
app.use("/api/user", userRouter);

io.on("connection", (socket) => {
  handleSockets(socket);
})

httpServer.listen(port, () => {
  console.log(`Listening on port ${port}`);
})