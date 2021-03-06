import { ObjectId } from "mongoose";
import Team, { TeamModel } from "../database/models/Team";

const isTeamFull = (teamCode: string, teamId: ObjectId): Promise<boolean> =>
  new Promise<boolean>(async (resolve, reject) => {
    try {
      if (teamCode) {
        const team = await TeamModel.findOne({ teamCode });
        if (!team) {
          throw new Error("Could not find a team");
        }
        const usersInTeam: Array<ObjectId> = team.users;
        if (usersInTeam.length >= 2) {
          resolve(true);
        }
        resolve(false);
      }
      const team: Team = await TeamModel.findById(teamId);

      if (!team) {
        throw new Error("Could not find a team");
      }
      const usersInTeam: Array<ObjectId> = team.users;
      if (usersInTeam.length >= 2) {
        resolve(true);
      }
      resolve(false);
    } catch (error) {
      reject(error);
    }
  });

export default isTeamFull;
