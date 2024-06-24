import express from "express";
import cors from "cors";
import "dotenv/config";
import userRouter from "./routes/user";
import relationshipRouter from "./routes/relationship";
import chatRouter from "./routes/chat";
import { Server } from "socket.io";
import { createServer } from "http";
import handleSockets from "./controllers/socket";
import { getS3Url } from "./s3";
import { auth } from "./middleware/auth";

const app = express();
const port = process.env.PORT;
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(cors());
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/relationship", relationshipRouter);
app.use("/api/chat", chatRouter);
app.get("/api/s3url", (req, res) => getS3Url(req, res));

io.on("connection", (socket) => {
  handleSockets(socket);
})

httpServer.listen(port, () => {
  console.log(`Listening on port ${port}`);
})