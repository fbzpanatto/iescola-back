import { GenericController } from "./genericController";
import { User } from "../entity/User";
import { EntityTarget, ObjectLiteral } from "typeorm";
import {Request, Response} from "express";
class UserController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(User);
  }

  async login (req: Request, res: Response) {

    const { user, password } = req.body

    const parsedPassword = password

    // TODO: parse Password

    try {

      const loggedUser = await this.repository.findOne({
        relations: [ 'person.category' ],
        where: { user: user, password: parsedPassword }
      }) as User

      if(!loggedUser) { throw new TypeError("Invalid Credentials") }

      const data = {
        user: loggedUser.id,
        username: loggedUser.user,
        category: loggedUser.person.category.id
      }

      return { status: 200, data }

    } catch (error: any) {
      return { error: true, message: error.message, status: 401 }
    }
  }
}

export const userController = new UserController();
