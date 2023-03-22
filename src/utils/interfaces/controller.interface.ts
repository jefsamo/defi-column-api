import { Request, Router } from "express";
import { IUser } from "@/resources/user/user.interface";

interface Controller {
  path: string;
  router: Router;
}

export interface RequestUser extends Request {
  user: IUser;
}

export default Controller;
