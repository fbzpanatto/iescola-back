import { DeepPartial, ObjectLiteral } from "typeorm";
import { Person} from "../entity/Person";

export class PersonClass {

  static async newPerson(body: DeepPartial<ObjectLiteral>) {

    const person = new Person();

    person.name = body.name;
    person.category = body.category

    await person.save()

    return person;
  }
}
