import { Types } from 'mongoose';

/**
 * user object for the jwt token and for transfer from the request object
 */
export class UserContextDto {
  id: Types.ObjectId;
}
