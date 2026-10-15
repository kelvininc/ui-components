import { RJSFSchema } from '@rjsf/utils';
import standardValidator from '@rjsf/validator-ajv8';

const FILE_SCHEMA: RJSFSchema = { type: 'string', format: 'data-url' };
const SECRET_REFERENCE = /^<%\s*secrets\.[A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)*\s*%>$/;

// Compare the whole match because JavaScript's $ also matches before a final newline.
export const isFileValue = (value: string): boolean => SECRET_REFERENCE.exec(value)?.[0] === value || standardValidator.isValid(FILE_SCHEMA, value, FILE_SCHEMA);
