import express from "express";
import { usersRouter, codesRouter } from "./routes/index.js";
import { checkAuthenticated } from "./middlewares/auth.middleware.js";

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(checkAuthenticated);

app.use("/users", usersRouter);
app.use("/code", codesRouter);

app.get("/", (req, res) => {
  return res.status(201).json({ message: `Welcome to home route` });
});

app.listen(PORT, () => console.log(`Server is running at port -> ${PORT}`));
