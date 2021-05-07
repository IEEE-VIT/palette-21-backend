import { ObjectId } from "mongoose";
import { TeamModel } from "../database/models/Team";

const isTeamFull = (teamCode: string, teamId: ObjectId): Promise<boolean> =>
  new Promise<boolean>(async (resolve, reject) => {
    try {
      if (teamCode) {
        const usersInTeam = (await TeamModel.findOne({ teamCode })).users;
        console.log(usersInTeam);
        if (usersInTeam.length >= 2) {
          resolve(true);
        }
        resolve(false);
      }
      const usersInTeam = (await TeamModel.findById(teamId)).users;
      console.log(usersInTeam);
      if (usersInTeam.length >= 2) {
        resolve(true);
      }
      resolve(false);
    } catch (error) {
      reject(error);
    }
  });

export default isTeamFull;
