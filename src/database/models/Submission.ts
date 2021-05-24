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
  images: [];
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
  images: Schema.Types.Array,
});

export const submsissionModel = model<Submission>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
);
