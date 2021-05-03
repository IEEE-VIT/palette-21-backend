import { Schema, model, Document } from 'mongoose';
import Team from './Team';

export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'users';

export default interface User extends Document {
  userID: string;
  userImg: string;
  name: string;
  email: string;
  firstLogin: boolean;
  password: string;
  skills: [],
  tools: [],
  team: Team,
  needTeam: boolean,
  token: string
}

const schema = new Schema(
  {
    team: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Team',
    },
    userID: {
      type: Schema.Types.String,
      required: true,
    },
    userImg: Schema.Types.String,
    name: {
      type: Schema.Types.Boolean,
      default: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
    },
    password: {
      type: Schema.Types.Boolean,
      required: true,
    },
    firstLogin: Schema.Types.Boolean,
    skills: [Schema.Types.String],
    tools: [Schema.Types.String],
    needTeam: Schema.Types.Boolean,
    token: Schema.Types.String
  }
);

export const userModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME);
