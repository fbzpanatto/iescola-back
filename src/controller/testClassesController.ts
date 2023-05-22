import { GenericController } from "./genericController";
import {DeepPartial, EntityTarget, ObjectLiteral} from "typeorm";
import { TestClasses } from "../entity/TestClasses";

class TestClassesController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(TestClasses);
  }

  override async updateOneBy(id: string, body: DeepPartial<ObjectLiteral>): Promise<ObjectLiteral> {

    const { testGiver, test, classroom } = body

    const testClass = await this.repository.findOne({
      where: {
        test: test,
        classroom: classroom
      }
    }) as TestClasses

    if (!testClass) { throw new Error('Test class not found')}

    testClass.testGiver = testGiver

    return await this.repository.save(testClass)

  }

}

export const testClassesController = new TestClassesController();
