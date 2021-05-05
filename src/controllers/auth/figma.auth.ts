import axios from "axios";
import * as dotenv from "dotenv";

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
        // console.log(response.data);
        const { data } = response;
        return data.access_token;
        // user_id access_token refresh_token expires_in
      })
      .then((token: string) => {
        // console.log("token", token);
        axios
          .get("https://api.figma.com/v1/me/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            // console.log(response.data);
            const { data } = response;
            // id email handle img_url
            user = {
              name: data.handle,
              email: data.email,
              imgUrl: data.img_url,
              token,
            };
            // console.log(user);
            resolve(user);
          })
          .catch((error) => {
            console.error(
              "error in figma auth(details):>>",
              error.response.data
            );
            reject(error);
          });
      })
      .catch((error) => {
        console.log("error in figma auth:>>", error.response.data);
        reject(error);
      });
    // console.log(usert);
    // return usert;
  });

export default figmaAuth;
