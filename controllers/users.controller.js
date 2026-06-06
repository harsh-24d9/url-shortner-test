import db from "../models/index.js";
import { usersTable } from "../models/schema.js";
import { createHmac, randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";
import { and, eq } from "drizzle-orm";

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || name.trim() === "")
    return res.status(400).json({ error: `Name is required.` });
  if (!email || email.trim() === "")
    return res.status(400).json({ error: `Email is required.` });
  if (!password || password.trim() === "")
    return res.status(400).json({ error: `Password is required.` });

  const salt = randomBytes(20).toString("hex");
  const hashedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  const [result] = await db
    .insert(usersTable)
    .values({ name, email, salt, password: hashedPassword })
    .returning({ id: usersTable.id });

  if (!result)
    return res.status(400).json({ error: `Error while creating user` });

  return res
    .status(201)
    .json({ message: `User created successfully`, data: result });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || email.trim() === "")
    return res.status(400).json({ error: `Email is required.` });
  if (!password || password.trim() === "")
    return res.status(400).json({ error: `Password is required.` });

  const [user] = await db
    .select({
      salt: usersTable.salt,
      hashedPassword: usersTable.password,
      id: usersTable.id,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (!user)
    return res
      .status(404)
      .json({ error: `User with email ${email} doesn't exists` });

  const incomingHashedPassword = createHmac("sha256", user.salt)
    .update(password)
    .digest("hex");

  if (incomingHashedPassword !== user.hashedPassword)
    return res.status(400).json({ error: `Invalid password` });

  const payload = {
    id: user.id,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET);

  return res.status(201).json({ message: `Login successful`, token });
};
