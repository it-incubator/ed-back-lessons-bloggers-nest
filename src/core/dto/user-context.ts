import { Types } from 'mongoose';

/**
 * user object for jwt token and for throw from request object
 */
export class UserContext {
  id: Types.ObjectId;
}
