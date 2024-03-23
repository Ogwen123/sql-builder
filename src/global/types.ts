export type ForeignKeyLink = {
    table: string,
    field: string
}

export type Field = {
    name: string,
    type: "INT" | "FLOAT" | "VARCHAR" | "CHAR" | "DATE" | "TEXT" | "BLOB"
    length?: number,
    key: "PRIMARY" | "FOREIGN" | "NONE",
    foreignKey?: ForeignKeyLink,
    notNull: boolean,
    unique: boolean,
    default: string,
}

export type Table = {
    name: string, // used as unique id
    fields: Field[]
}

export type Alert_t = [boolean, "SUCCESS" | "ERROR" | "", string]