import { Schema, model, Document } from "mongoose";
import User from "./User";

export const DOCUMENT_NAME = "Team";
export const COLLECTION_NAME = "teams";

export default interface Team extends Document {
  teamCode: string;
  users: [];
  invited: [];
  name: string;
  problemStatement: [];
  tries: number;
}

const schema = new Schema({
  teamCode: {
    type: Schema.Types.String,
    index: true,
    unique: true,
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
  name: {
    type: Schema.Types.String,
    required: true,
    unique: true,
  },
  problemStatement: Schema.Types.Array,
  tries: Schema.Types.Number,
});

export const TeamModel = model<Team>(DOCUMENT_NAME, schema, COLLECTION_NAME);
