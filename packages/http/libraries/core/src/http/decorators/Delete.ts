import { RequestMethodType } from '../models/RequestMethodType';
import { requestMethod } from './RequestMethod';

// eslint-disable-next-line @typescript-eslint/naming-convention
export function DELETE(path?: string): MethodDecorator {
  return requestMethod(RequestMethodType.DELETE, path);
}
