import "reflect-metadata"
import { DataSource } from "typeorm"

import { listDirFilesSync } from "./entity";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "1234",
  database: "iescoladb",
  synchronize: true,
  logging: false,
  entities: getEntities(),
  subscribers: [],
  migrations: [],
})

function getEntities() {
  return listDirFilesSync().map((file: string) => {
    return require(`./entity/${file}`)
  })
}
