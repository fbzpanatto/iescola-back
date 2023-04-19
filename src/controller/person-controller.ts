import { DeepPartial, ObjectLiteral } from "typeorm";
import { categoryController } from "./category-controller";

import { Category} from "../entity/Category";
import { Person} from "../entity/Person";
import { AppDataSource } from "../data-source";

export class PersonClass {

  static async newPerson(body: DeepPartial<ObjectLiteral>) {

    const person = new Person();

    person.name = body.name;
    person.category = await categoryController.findOneBy(body.category.id) as Category;

    await PersonClass.repository.save(person);

    return person;
  }

  private static get repository() {

    return AppDataSource.getRepository(Person);
  }
}
