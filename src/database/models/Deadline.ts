import { Schema, model, Document } from "mongoose";

export const DOCUMENT_NAME = "Deadline";
export const COLLECTION_NAME = "Deadlines";

export default interface Deadline extends Document {
  event: string;
  time: Date;
}

const schema = new Schema({
  event: {
    type: Schema.Types.String,
    required: true,
  },
  time: {
    type: Schema.Types.Date,
    required: true,
  },
});

export const DeadlineModel = model<Deadline>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
);
