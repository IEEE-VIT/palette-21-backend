import { Schema, model, Document } from "mongoose";

export const DOCUMENT_NAME = "Team";
export const COLLECTION_NAME = "teams";

export default interface Team extends Document {
  teamCode: string;
  users: [];
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
  name: {
    type: Schema.Types.String,
    required: true,
  },
  problemStatement: Schema.Types.Array,
  tries: Schema.Types.Number,
});

export const TeamModel = model<Team>(DOCUMENT_NAME, schema, COLLECTION_NAME);
