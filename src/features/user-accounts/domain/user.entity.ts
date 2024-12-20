import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from '../dto/create-user.dto';

export enum DeletionStatus {
  NotDeleted = 'not-deleted',
  PermanentDeleted = 'permanent-deleted',
}

//флаг timestemp автоматичеки добавляет поля upatedAt и createdAt
/**
 * User Entity Schema
 * This class represents the schema and behavior of a User entity.
 */
@Schema({ timestamps: true })
export class User {
  /**
   * Login of the user (must be uniq)
   * @type {string}
   * @required
   */
  @Prop({ type: String, required: true })
  login: string;

  /**
   * Password hash for authentication
   * @type {string}
   * @required
   */
  @Prop({ type: String, required: true })
  passwordHash: string;

  /**
   * Email of the user
   * @type {string}
   * @required
   */
  @Prop({ type: String, required: true })
  email: string;

  /**
   * Email confirmation status (if not confirmed in 2 days account will be deleted)
   * @type {boolean}
   * @default false
   */
  @Prop({ type: Boolean, required: true, default: false })
  isEmailConfirmed: boolean;

  /**
   * Creation timestamp
   * Explicitly defined despite timestamps: true
   * @type {Date}
   */
  @Prop({ type: Date })
  createdAt: Date;

  /**
   * Status of deletion
   * @type {DeletionStatus}
   * @default DeletionStatus.NotDeleted
   */
  @Prop({ enum: DeletionStatus, default: DeletionStatus.NotDeleted })
  deletionStatus: DeletionStatus;

  /**
   * Deletion timestamp, nullable, if date exist, means entity soft deleted
   * @type {Date | null}
   */
  @Prop({ type: Date, nullable: true })
  deletedAt: Date;

  /**
   * Virtual property to get the stringified ObjectId
   * @returns {string} The string representation of the ID
   */
  get id() {
    // @ts-ignore
    return this._id.toString();
  }

  /**
   * Factory method to create a User instance
   * @param {CreateUserDto} dto - The data transfer object for user creation
   * @returns {UserDocument} The created user document
   */
  static createInstance(dto: CreateUserDto): UserDocument {
    const user = new this();
    user.email = dto.email;
    user.passwordHash = dto.password;
    user.login = dto.login;

    return user as UserDocument;
  }

  /**
   * Marks the user as deleted
   * Throws an error if already deleted
   * @throws {Error} If the entity is already deleted
   */
  makeDeleted() {
    if (this.deletionStatus !== DeletionStatus.NotDeleted) {
      throw new Error('Entity already deleted');
    }
    this.deletionStatus = DeletionStatus.PermanentDeleted;
  }

  /**
   * Updates the user instance with new data
   * Resets email confirmation if email is updated
   * @param {UpdateUserDto} dto - The data transfer object for user updates
   */
  update(dto: UpdateUserDto) {
    if (dto.email !== this.email) {
      this.isEmailConfirmed = false;
    }
    this.email = dto.email;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

//регистрирует методы сущности в схеме
UserSchema.loadClass(User);

//Типизация документа
export type UserDocument = HydratedDocument<User>;

//Типизация модели + статические методы
export type UserModelType = Model<UserDocument> & typeof User;
