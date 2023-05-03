import { DeepPartial, ObjectLiteral } from "typeorm";
import { categoryController } from "./categoryController";

import { Category} from "../entity/Category";
import { Person} from "../entity/Person";

export class PersonClass {

  static async newPerson(body: DeepPartial<ObjectLiteral>) {

    const person = new Person();

    person.name = body.name;
    person.category = await categoryController.findOneBy(body.category.id) as Category;

    await person.save()

    return person;
  }
}
