import { UnprocessableEntry } from "../core/ApiResponse";

const bodyValidator = (schema: any) => (
  req: Request,
  res: any,
  next: any
): void => {
  const { error } = schema.validate(req.body);
  const valid = error == null;

  if (valid) {
    next();
  } else {
    const { details } = error;
    const errorMessages = details.map((i: any) => i.message).join(",");
    new UnprocessableEntry(errorMessages).send(res);
  }
};

const paramValidator = (paramSchema: any) => async (
  req: any,
  res: any,
  next: any
): Promise<void> => {
  const { error } = paramSchema.validate(req.query);
  const valid = error == null;
  if (valid) {
    next();
  } else {
    const { details } = error;
    const errorMessages = details.map((i: any) => i.message).join(",");
    new UnprocessableEntry(errorMessages).send(res);
  }
};

export { bodyValidator, paramValidator };
