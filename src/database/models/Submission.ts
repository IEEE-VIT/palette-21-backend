import { Schema, model, Document } from "mongoose";
import Team from "./Team";

export const DOCUMENT_NAME = "Submission";
export const COLLECTION_NAME = "submissions";

export default interface Submission extends Document {
  team: Team;
  title: string;
  description: string;
  tracks: [];
  submissionLink: [];
  round1: boolean;
  round2: boolean;
  round3: boolean;
  selectedForRound3: boolean;
}

const schema = new Schema({
  team: {
    type: Schema.Types.ObjectId,
    ref: "Team",
  },
  title: Schema.Types.String,
  description: Schema.Types.String,
  tracks: Schema.Types.Array,
  submissionLink: Schema.Types.Array,
  round1: {
    type: Schema.Types.Boolean,
    default: false,
  },
  round2: {
    type: Schema.Types.Boolean,
    default: false,
  },
  round3: {
    type: Schema.Types.Boolean,
    default: false,
  },
  selectedForRound3: {
    type: Schema.Types.Boolean,
    default: false,
  },
});

export const submsissionModel = model<Submission>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
);
