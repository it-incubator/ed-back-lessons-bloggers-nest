import { DomainExceptionCode } from './domain-exception-codes';

export class ErrorExtension {
  constructor(
    public message: string,
    public key: string | null = null,
  ) {}
}

export class DomainException extends Error {
  constructor(
    public message: string,
    public code: DomainExceptionCode,
    public extensions: ErrorExtension[],
  ) {
    super(message);
  }
}

export class BadRequestDomainException extends DomainException {
  constructor(extensions: ErrorExtension[]) {
    super('Bad Request', DomainExceptionCode.BadRequest, extensions);
  }

  static create(message?: string, key?: string) {
    return new this(message ? [new ErrorExtension(message, key)] : []);
  }
}

export class ForbiddenDomainException extends DomainException {
  constructor(extensions: ErrorExtension[]) {
    super('Forbidden', DomainExceptionCode.Forbidden, extensions);
  }

  static create(message?: string, key?: string) {
    return new this(message ? [new ErrorExtension(message, key)] : []);
  }
}

export class UnauthorizedDomainException extends DomainException {
  constructor(extensions: ErrorExtension[]) {
    super('Unauthorized', DomainExceptionCode.Unauthorized, extensions);
  }

  static create(message?: string, key?: string) {
    return new this(message ? [new ErrorExtension(message, key)] : []);
  }
}

export class NotFoundDomainException extends DomainException {
  constructor(extensions: ErrorExtension[]) {
    super('Not Found', DomainExceptionCode.NotFound, extensions);
  }

  static create(message?: string, key?: string) {
    return new this(message ? [new ErrorExtension(message, key)] : []);
  }
}

//для устранения дублирования можно использовать typescript mixin для создания классов с одинаковым статическим методом create
//https://www.typescriptlang.org/docs/handbook/mixins.html
// function ConcreteDomainExceptionFactory(
//   commonMessage: string,
//   code: DomainExceptionCode,
// ) {
//   return class extends DomainException {
//     constructor(extensions: ErrorExtension[]) {
//       super(commonMessage, code, extensions);
//     }
//
//     static create(message?: string, key?: string) {
//       return new this(message ? [new ErrorExtension(message, key)] : []);
//     }
//   };
// }
//
// export const NotFoundDomainException = ConcreteDomainExceptionFactory(
//   'Not Found',
//   DomainExceptionCode.NotFound,
// );
// export const BadRequestDomainException = ConcreteDomainExceptionFactory(
//   'Bad Request',
//   DomainExceptionCode.BadRequest,
// );
// export const ForbiddenDomainException = ConcreteDomainExceptionFactory(
//   'Forbidden',
//   DomainExceptionCode.Forbidden,
// );
// export const UnauthorizedDomainException = ConcreteDomainExceptionFactory(
//   'Unauthorized',
//   DomainExceptionCode.Unauthorized,
// );
