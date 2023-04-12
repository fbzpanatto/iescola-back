import { AppDataSource } from "../data-source";
import { DeepPartial, EntityTarget, FindManyOptions, ObjectLiteral } from "typeorm";

export class GenericController<T> {

  constructor(private entity: EntityTarget<ObjectLiteral>) {}

  async getAll(options?: FindManyOptions<ObjectLiteral>) {

    return await this.repository.find(options)
  }

  async saveData(body: DeepPartial<ObjectLiteral>, options?: any) {

    return await this.repository.save(body, options);
  }

  async findOneBy(id: number | string) {

    return await this.repository.findOneBy({ id: Number(id) });
  }

  async updateOneBy(id: string, body: DeepPartial<ObjectLiteral>) {

    const dataToUpdate = await this.findOneBy(id);

    if (!dataToUpdate) throw new Error('Data not found');

    for (const key in body) {
      dataToUpdate[key] = body[key];
    }

    return await this.repository.save(dataToUpdate);
  }

  async deleteOneBy(id: string) {

      const dataToDelete = await this.findOneBy(id);

      if (!dataToDelete) throw new Error('Data not found');

      return await this.repository.delete(dataToDelete);
  }

  protected get repository() {

    return AppDataSource.getRepository(this.entity);
  }

}
