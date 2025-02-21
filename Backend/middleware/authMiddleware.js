import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Access denied" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token" });
    }
};
