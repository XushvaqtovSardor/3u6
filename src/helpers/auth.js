import { verifyAccessToken } from "./jwt.js";
import { CustomersModel } from "../model/customers.model.js";

export const authGuard = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer"))
      return res.status(401).json({ message: "Unauthorized" });
    const token = auth.split(" ")[1];
    const payload = verifyAccessToken(token);
    const user = await CustomersModel.findById(payload.id).select("-password");
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (!user.isActive)
      return res.status(403).json({ message: "Account not verified" });
    req.user = { id: user._id.toString(), role: user.role };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const roleGuard = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    if (!userRole) return res.status(403).json({ message: "Forbidden" });
    if (allowedRoles.includes(userRole)) return next();
    return res.status(403).json({ message: "Forbidden" });
  };
};

export const selfGuard = () => {
  return (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (user.role === "admin") return next();
    const resourceOwnerId = req.params.id;
    if (!resourceOwnerId)
      return res.status(400).json({ message: "ID required" });
    if (resourceOwnerId.toString() === user.id.toString()) return next();
    return res.status(403).json({ message: "Forbidden" });
  };
};

export default { authGuard, roleGuard, selfGuard };
