import axios from "axios";
import * as dotenv from "dotenv";
import Logger from "../../configs/winston";

dotenv.config();

// url to generate code
// https://www.figma.com/oauth?client_id=a2rQkR6iPgOvn3VHC6uCIh&redirect_uri=http://localhost:8000/&scope=file_read&state=abc&response_type=code

interface IUser {
  name: string;
  email: string;
  imgUrl: string;
  token: string;
}

const figmaAuth = (code: string, redirectUri: string): Promise<IUser> =>
  new Promise<IUser>((resolve, reject) => {
    let user: IUser;
    axios
      .post("https://www.figma.com/api/oauth/token", {
        client_id: process.env.figma_client_id,
        client_secret: process.env.figma_client_secret,
        redirect_uri: redirectUri,
        code,
        grant_type: "authorization_code",
      })
      .then((response) => {
        const { data } = response;
        return data.access_token;
      })
      .then((token: string) => {
        axios
          .get("https://api.figma.com/v1/me/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            const { data } = response;
            user = {
              name: data.handle,
              email: data.email,
              imgUrl: data.img_url,
              token,
            };
            resolve(user);
          })
          .catch((error) => {
            Logger.error(` Error in figma auth details:>> ${error}`);
            reject(error);
          });
      })
      .catch((error) => {
        Logger.error("Error from figma auth:>>", error);
        reject(error);
      });
  });

export default figmaAuth;
