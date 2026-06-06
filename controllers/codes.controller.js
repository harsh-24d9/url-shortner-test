import { nanoid } from "nanoid";
import db from "../models/index.js";
import { urlsTable } from "../models/schema.js";
import { eq } from "drizzle-orm";

export const createShortCode = async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: `url is required` });

  const shortCode = nanoid(6);
  const userId = req.user.data.id;

  const [urlCreation] = await db
    .insert(urlsTable)
    .values({ userId, shortCode, targetURL: url })
    .returning({ id: urlsTable.id });

  if (!urlCreation)
    return res.status(400).json({ error: `Error while creating shorten code` });

  return res
    .status(201)
    .json({ message: `Short code generated successfully`, urlCreation });
};

export const redirectShortCode = async (req, res) => {
  const shortCode = req.params.shortCode;

  const [response] = await db
    .select({
      url: urlsTable.targetURL,
    })
    .from(urlsTable)
    .where(eq(urlsTable.shortCode, shortCode));

  if (!response)
    return res
      .status(400)
      .json({ error: `Error while finding associated url` });

  return res.status(201).redirect(response.url);
};
