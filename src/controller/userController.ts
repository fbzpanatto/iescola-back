import { GenericController } from "./genericController";
import { User } from "../entity/User";
import { DeepPartial, EntityTarget, ObjectLiteral } from "typeorm";
import { Request, Response } from "express";

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

class UserController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(User);
  }

  async login (req: Request, res: Response) {

    const { user, password } = req.body

    try {

      const userToLogin = await this.repository.findOne({
        relations: [ 'person.category' ],
        where: { user: user }
      }) as User

      let condition = false

      if(userToLogin) { condition = await bcrypt.compare(password, userToLogin.password) }
      if((userToLogin && !condition) || !userToLogin) { throw new Error("Invalid Credentials") }

      const tokenPayload = {
        user: userToLogin.id,
        username: userToLogin.user,
        category: userToLogin.person.category.id
      }

      // 7200
      const jwtBearerToken = jwt.sign(tokenPayload, 'SECRET', { expiresIn: 10 })

      return { status: 200, data: { token: jwtBearerToken, expiresIn: jwt.decode(jwtBearerToken).exp, role: jwt.decode(jwtBearerToken).category  } }

    } catch (error: any) {
      return { status: 401, data: { error: true, message: error.message } }
    }
  }

  override async saveData(body: DeepPartial<ObjectLiteral>) {

    const salt = await bcrypt.genSalt(12)
    body.password = await bcrypt.hash(body.password, salt)

    return await this.repository.save(body)
  }
}

export const userController = new UserController();
