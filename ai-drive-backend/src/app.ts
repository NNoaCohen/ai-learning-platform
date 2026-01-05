import express from "express";
import cors from "cors";
import userRoutes from "../src/routes/userRoutes";
import categoryRoutes from "../src/routes/categoryRoutes"
import subcategoryRoutes from "./routes/subcategoryRoutes";
import promptRoutes from "./routes/promptRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/users",userRoutes);
app.use("/categories",categoryRoutes);
app.use("/subcategories",subcategoryRoutes);
app.use("/prompts",promptRoutes);
app.use(errorHandler);

app.get("/health", (req, res) => {
  res.send("API is running");
});

export default app;
