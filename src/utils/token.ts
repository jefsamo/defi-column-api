import { Response } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { IUser } from "@/resources/user/user.interface";

type CookieOptions = {
  maxAge?: number | undefined;
  signed?: boolean | undefined;
  expires?: Date | undefined;
  httpOnly?: boolean | undefined;
  path?: string | undefined;
  domain?: string | undefined;
  secure?: boolean | undefined;
};

type JwtExpires = number | string;

export const signToken = (id: Types.ObjectId): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as jwt.Secret, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const createSendToken = (
  user: IUser,
  statusCode: number,
  res: Response
) => {
  const token = signToken(user._id);

  const jwtExpiresIn = process.env.JWT_COOKIE_EXPIRES_IN!;

  const cookieOptions: CookieOptions = {
    expires: new Date(Date.now() + Number(jwtExpiresIn) * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  return res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
