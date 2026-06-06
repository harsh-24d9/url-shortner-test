import jwt from "jsonwebtoken";

export function checkAuthenticated(req, res, next) {
  const tokenHeader = req.headers["authorization"];

  if (!tokenHeader) return next();
  if (!tokenHeader.startsWith("Bearer"))
    return res.status(400).json({ error: `Token must start with word Bearer` });

  const token = tokenHeader.split(" ")[1];
  const tokenValidation = jwt.verify(token, process.env.JWT_SECRET);

  if (!tokenValidation) return next();

  req.user = { data: tokenValidation, token };
  return next();
}

export function ensureAuthenticated(req, res, next) {
  if (!req.user)
    return res
      .status(400)
      .json({ error: "You are not authorized to access this resource" });
  return next();

  const tokenValidation = jwt.verify(req.user.token, process.env.JWT_SECRET);
  if (!tokenValidation) return res.status(400).json({ error: `Invalid token` });
}
