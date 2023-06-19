import { DeepPartial, ObjectLiteral } from "typeorm";
import { Person} from "../entity/Person";

export class PersonClass {

  static async newPerson(body: DeepPartial<ObjectLiteral>) {

    const person = new Person();

    person.name = body.name;
    person.category = body.category
    person.birthDate = body.birthDate

    await person.save()

    return person;
  }

  static async updatePerson(body: DeepPartial<ObjectLiteral>) {

    const person = Person.findOne({
      relations: ['category'],
      where: { id: body.id }
    })
  }
}
