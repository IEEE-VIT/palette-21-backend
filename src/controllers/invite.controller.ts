import { Request, Response } from "express";
import { InviteModel } from "../database/models/Invite";

export const myInvites = (req: Request, res: Response) => {
  const invites = InviteModel.find(
    { recipient: req.params.userId },
    (err: any, invites: any) => {
      if (err) {
        res.send(err);
      } else {
        res.send(invites);
      }
    }
  );
};

export const addInvite = (req: Request, res: Response) => {
  const invite = new InviteModel(req.body);
  invite.save((err: any) => {
    if (err) {
      res.send(err);
    } else {
      res.send("Invite sent");
    }
  });
};

export const sentInvites = (req: Request, res: Response) => {
  const invites = InviteModel.find(
    { teamCode: req.params.userId },
    (err: any, invites: any) => {
      if (err) {
        res.send(err);
      } else {
        res.send(invites);
      }
    }
  );
};
