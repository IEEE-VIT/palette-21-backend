import { Request, Response } from "express";
import figmaAuth from "./auth/figma.auth";

class UserController {
  figmaAuthController = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("figmaloginctrl");
      console.log(req.body);

      const { code, redirectUri } = req.body;

      const user = await figmaAuth(code, redirectUri);
      console.log(user);
      const { name, token, imgUrl, email } = user;
      res.send({
        token,
        name,
        email,
        imgUrl,
      });
    } catch (error) {
      res.send("Error connecting to figma");
      console.log(error);
    }
  };
}

export default UserController;
