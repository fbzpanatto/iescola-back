import {DeepPartial, ObjectLiteral} from "typeorm";
import {Person} from "../entity/Person";

export class PersonClass {

  static async newPerson(body: DeepPartial<ObjectLiteral>, dateConversion: boolean = false) {

    const person = new Person();

    person.name = body.name;
    person.category = body.category;

    if(dateConversion) {
      person.birthDate = this.criarData(body.birthDate);
    } else {
      person.birthDate = body.birthDate;
    }

    await person.save()

    return person;
  }

  static criarData(dataString: string) {

    const partes = dataString.split('/');
    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1;
    const ano = parseInt(partes[2], 10);

    return new Date(ano, mes, dia);
  }
}
