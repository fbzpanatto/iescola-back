const fs = require('fs')
const path = require('path')

const basename = path.basename(__filename)

export const listDirFilesSync = () => {
  return fs.readdirSync('src/entity')
    .filter((k: any) => k !== basename)
    .map((arquivo: string) => { return arquivo.split('.')[0] })
}
