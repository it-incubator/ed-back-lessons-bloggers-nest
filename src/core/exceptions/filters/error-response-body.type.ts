import { ErrorExtension } from '../domain-exceptions';
import { DomainExceptionCode } from '../domain-exception-codes';

export type ErrorResponseBody = {
  timestamp: string;
  path: string | null;
  message: string;
  extensions: ErrorExtension[];
  code: DomainExceptionCode | null;
};
