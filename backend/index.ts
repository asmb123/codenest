import express from "express";
import cors from "cors";
import { getReadFileUrl, listFiles } from "./controllers/objectStore";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./utils/auth";
import { configDotenv } from "dotenv";

configDotenv();

const app = express();

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST'],
  credentials: true
}));

app.get('/', (req, res) => {
  res.send("Server working");
})

app.all('/api/auth/{*any}', toNodeHandler(auth));



app.listen(process.env.PORT, () => {
  console.log(`Server working on ${process.env.PORT}`)
})