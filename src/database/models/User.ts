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
  token: string;
  invites: [];
}

const schema = new Schema({
  userImg: Schema.Types.String,
  name: {
    type: Schema.Types.String,
    default: true,
  },
  email: {
    type: Schema.Types.String,
    required: true,
  },
  firstLogin: Schema.Types.Boolean,
  skills: Schema.Types.Array,
  tools: Schema.Types.Array,
  teamCode: Schema.Types.String,
  needTeam: Schema.Types.Boolean,
  token: Schema.Types.String,
  invites: {
    type: Schema.Types.ObjectId,
    ref: "Invite",
  },
});

export const userModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME);
