import {GenericController} from "./generic-controller";
import {StudentTests} from "../entity/StudentTests";
import {DeepPartial, EntityTarget, ObjectLiteral} from "typeorm";

class StudentTestsController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(StudentTests);
  }

  override async updateOneBy(id: string, body: DeepPartial<ObjectLiteral>) {

    const dataToUpdate = await this.findOneBy(id);

    if (!dataToUpdate) throw new Error('Data not found');

    for (const key in body) {
      dataToUpdate[key] = body[key];
    }

    await this.repository.save(dataToUpdate)

    return await this.repository.count({
      where: {
        test: {id: body.test.id},
        completed: true
      }
    })
  }
}

export const studentTestsController = new StudentTestsController();
