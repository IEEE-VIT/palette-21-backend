import { Schema, model, Document } from "mongoose";
import Round from "./Round";

export const DOCUMENT_NAME = "Deadline";
export const COLLECTION_NAME = "deadlines";

export default interface Deadline extends Document {
  round: Round;
  deadLineDate: Date;
}

const schema = new Schema({
  round: {
    type: Schema.Types.ObjectId,
    ref: "Round",
  },
  deadlineDate: {
    type: Schema.Types.Date,
    required: true,
  },
});

export const deadlineModel = model<Deadline>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
);
