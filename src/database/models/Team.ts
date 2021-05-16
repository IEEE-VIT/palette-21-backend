import { Schema, model, Document } from "mongoose";

export const DOCUMENT_NAME = "Team";
export const COLLECTION_NAME = "teams";

export default interface Team extends Document {
  teamCode: string;
  users: [];
  name: string;
  problemStatement: Array<string>;
  locked: Array<boolean>;
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
  problemStatement: {
    type: Schema.Types.Array,
    default: [null, null, null],
  },
  locked: {
    type: Schema.Types.Array,
    default: [false, false, false],
  },

  tries: {
    type: Schema.Types.Number,
    default: 0,
  },
});

export const TeamModel = model<Team>(DOCUMENT_NAME, schema, COLLECTION_NAME);
