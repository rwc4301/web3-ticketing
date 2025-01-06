import express from "express";
import cors from "cors";

import { default as getPort, portNumbers } from "./get-port.js";


const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is running!");
});

const PORT = await getPort({ port: portNumbers(5000, 6000) });
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));