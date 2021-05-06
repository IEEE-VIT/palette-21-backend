import { Schema, model, Document } from "mongoose";

export const DOCUMENT_NAME = "User";
export const COLLECTION_NAME = "users";

export default interface User extends Document {
  userImg: string;
  name: string;
  email: string;
  firstLogin: boolean;
  skills: [];
  tools: [];
  teamCode: string;
  needTeam: boolean;
  invites: [];
  discordHandle: string;
  outreach: string;
}

const schema = new Schema({
  userImg: { type: Schema.Types.String, default: "" },
  name: {
    type: Schema.Types.String,
    default: "",
  },
  email: {
    type: Schema.Types.String,
    unique: true,
    required: true,
  },
  firstLogin: { type: Schema.Types.Boolean, default: false },
  skills: { type: Schema.Types.Array, default: [] },
  tools: {
    type: Schema.Types.Array,
    default: [],
  },
  teamCode: { type: Schema.Types.String, default: "" },
  needTeam: {
    type: Schema.Types.Boolean,
    default: true,
  },
  invites: {
    type: Schema.Types.ObjectId,
    ref: "Invite",
    default: [],
  },
  discordHandle: { type: Schema.Types.String, default: "" },
  outreach: { type: Schema.Types.String, default: "" },
});

export const UserModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME);
