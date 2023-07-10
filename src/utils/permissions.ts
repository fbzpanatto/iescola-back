interface Permission { GET: boolean, POST: boolean, PUT: boolean, DELETE: boolean }

const getCategoriesIds = (categoryId: number) => {
    const categoriesIds = Object.keys(userCategoryPermissions) as unknown as number[]
}

const userCategoryPermissions: { [key: number]: { [key: string]: Permission } } = {
    1: {
        student: {
            GET: true,
            POST: false,
            PUT: false,
            DELETE: false
        },
        test: {
            GET: true,
            POST: true,
            PUT: true,
            DELETE: true
        },
        teacher: {
            GET: true,
            POST: false,
            PUT: false,
            DELETE: false
        }
    },
    3: {
        student: {
            GET: true,
            POST: true,
            PUT: true,
            DELETE: true
        },
        test: {
            GET: true,
            POST: true,
            PUT: true,
            DELETE: true
        },
        teacher: {
            GET: true,
            POST: true,
            PUT: true,
            DELETE: true
        }
    }
}

export default (category: number, entity: string, method: string) => {

    return userCategoryPermissions[category][entity][method as keyof Permission]
}
