import { Schema, model, Document } from "mongoose";
import User from "./User";

export const DOCUMENT_NAME = "Team";
export const COLLECTION_NAME = "teams";

export default interface Team extends Document {
  teamCode: string;
  users: [User];
  invited: [User];
  name: string;
  problemStatement: string;
  tries: number;
}

const schema = new Schema({
  teamCode: {
    type: Schema.Types.String,
    required: true,
  },
  name: {
    type: Schema.Types.String,
    default: true,
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  invited: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  problemStatement: Schema.Types.String,
  tries: Schema.Types.Number,
});

export const TeamModel = model<Team>(DOCUMENT_NAME, schema, COLLECTION_NAME);
