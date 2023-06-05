import { GenericController } from "./genericController";
import { User } from "../entity/User";
import { EntityTarget, ObjectLiteral } from "typeorm";
class UserController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(User);
  }

  async login (body: ObjectLiteral) {

    const { user, password } = body

    const parsedPassword = password

    // TODO: parse Password

    try {

      const loggedUser = await this.repository.findOne({
        relations: [ 'person.category' ],
        where: { user: user, password: parsedPassword }
      }) as User

      if(!loggedUser) { throw new TypeError("Invalid Credentials") }

      return {
        user: loggedUser.id,
        username: loggedUser.user,
        category: loggedUser.person.category.id
      }

    } catch (error: any) {
      return { error: true, message: error.message }
    }
  }
}

export const userController = new UserController();
