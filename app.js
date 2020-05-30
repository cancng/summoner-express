import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import summonerRoutes from "./routes/summoner";

dotenv.config();
const port = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/summoner", summonerRoutes);

app.listen(port, () => console.log(`Server is running on port: ${port}`));
