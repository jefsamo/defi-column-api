import { Schema, model, Model } from "mongoose";
import { IUser, IUserMethods } from "@/resources/user/user.interface";
import bcrypt from "bcryptjs";

type IUserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, IUserModel, IUserMethods>(
  {
    name: {
      type: String,
      required: [true, "A User must have a name!"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "A User must have an email!"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "writer"],
      default: "user",
    },
    imageUrl: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function (this: IUser, el: string): boolean {
          return el === this.password;
        },
        message: "Password are not the same!",
      },
    },
    googleId: String,
    passwordChangedAt: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: {
      createdAt: "created_At",
      updatedAt: "updated_At",
    },
  }
);

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password!, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = this.passwordChangedAt.getTime() / 1000;
    10;

    return JWTTimestamp! < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const UserModel = model<IUser, IUserModel>("User", userSchema);

export default UserModel;
