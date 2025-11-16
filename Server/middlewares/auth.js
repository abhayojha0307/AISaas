const { clerkClient } = require("@clerk/express");
const auth = async (req, res, next) => {
  try {
    const { userId } = req.auth;
    const user = await clerkClient.users.getUser(userId);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
module.exports = { auth };
