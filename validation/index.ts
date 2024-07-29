import { ZodType } from "zod";
import { fromError } from "zod-validation-error";

const validation = <T>(zodType: ZodType<T>, data: T): T => {
  try {
    const parse = zodType.parse(data);
    return parse;
  } catch (e) {
    throw new Error(fromError(e).toString());
  }
};

export default validation;
