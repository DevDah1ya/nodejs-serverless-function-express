import jwt from "jsonwebtoken";

export const  verifytoken =
 async (req, res) => {
    try {
      const data = jwt.verify(req.body.authtoken, "secret");
      res.json({ data });
    } catch (error) {
      res
        .status(400)
        .send({ error: "please authenticate using a valid token" });
    }
  }