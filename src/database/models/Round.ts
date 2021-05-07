import { Schema, model, Document } from "mongoose";
import Team from "./Team";

export const DOCUMENT_NAME = "Round";
export const COLLECTION_NAME = "rounds";

export default interface Round extends Document {
  roundNo: number;
  team: Team;
  review: string;
  status: boolean;
  meetingLink: string;
  date: Date;
}

const schema = new Schema({
  roundNo: {
    type: Schema.Types.Number,
    required: true,
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: "Team",
  },
  review: Schema.Types.String,
  status: Schema.Types.Boolean,
  meetingLink: Schema.Types.String,
  date: Schema.Types.Date,
});

export const roundModel = model<Round>(DOCUMENT_NAME, schema, COLLECTION_NAME);
