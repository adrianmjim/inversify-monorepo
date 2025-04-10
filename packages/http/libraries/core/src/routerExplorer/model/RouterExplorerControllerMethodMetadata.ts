import { RequestMethodType } from '../../http/models/RequestMethodType';
import { HttpStatusCode } from '../../http/responses/HttpStatusCode';
import { ControllerMethodParameterMetadata } from './ControllerMethodParameterMetadata';

export interface RouterExplorerControllerMethodMetadata {
  guardList: NewableFunction[];
  headerMetadataList: [string, string][];
  methodKey: string | symbol;
  parameterMetadataList: ControllerMethodParameterMetadata[];
  path: string;
  postHandlerMiddlewareList: NewableFunction[];
  preHandlerMiddlewareList: NewableFunction[];
  requestMethodType: RequestMethodType;
  statusCode: HttpStatusCode | undefined;
  useNativeHandler: boolean;
}
