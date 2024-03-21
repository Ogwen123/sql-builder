import { Field, Table } from "./types";

export const generateSQL = (tables: Table[]): string | string[] => {
    let SQlBuffer = ""
    const errors: string[] = []

    for (let table of tables) {
        let tableBuffer = ""
        tableBuffer += `CREATE TABLE "${table.name}" (\n`

        let primaryKey: Field | undefined = undefined;
        let foreignKeys: Field[] = []

        for (let i of table.fields) {
            tableBuffer += "    " + `"${i.name}" `

            if (i.key === "PRIMARY") {
                if (primaryKey !== undefined) {
                    errors.push("You can only have one primary key per field.")
                    continue
                } else {
                    primaryKey = i
                }
            }

            if (i.key === "FOREIGN") {
                foreignKeys.push(i)
            }

            // create inline constraints
            if (["VARCHAR", "CHAR"].includes(i.type)) {
                if (!i.length) {
                    errors.push(`Field '${table.name}.${i.name}' should have a length entered if it is of type VARCHAR or CHAR.`)
                    continue
                }
                tableBuffer += i.type + `(${i.length!}) `
            } else {
                tableBuffer += i.type + " "
            }

            if (i.notNull) {
                tableBuffer += "NOT NULL "
            }

            if (i.unique) {
                tableBuffer += "UNIQUE "
            }

            if (i.default !== "") {
                tableBuffer += `DEFAULT '${i.default}' `
            }
            tableBuffer = tableBuffer.trim() + ",\n"
        }

        // create out-of-line constraints, pm just keys

        if (primaryKey !== undefined) {
            tableBuffer += `CONSTRAINT ${table.name.split(" ").join("_")}_pk PRIMARY KEY ("${primaryKey.name}"),\n`
        }

        for (let [index, i] of foreignKeys.entries()) {
            if (!i.foreignKey?.table) {
                errors.push(`Foreign key field "${table.name}"."${i.name}" must have a reference table set.`)
            }
            if (!i.foreignKey?.field) {
                errors.push(`Foreign key field "${table.name}"."${i.name}" must have a reference field set.`)
            }

            for (let j of tables) {
                for (let k of j.fields) {
                    if (j.name === i.foreignKey?.table && k.name === i.foreignKey?.field && k.key !== "PRIMARY") {
                        errors.push(`Foreign key field "${table.name}"."${i.name}" does not link to a primary field.`)
                    }
                }
            }

            tableBuffer += `CONSTRAINT ${table.name.split(" ").join("_")}_fk_${index} FOREIGN KEY ("${i.name}") REFERENCES "${i.foreignKey?.table}"("${i.foreignKey?.field}"),\n`
        }
        if (tableBuffer.endsWith(",\n")) {
            tableBuffer = tableBuffer.slice(0, tableBuffer.length - ",\n".length) + "\n"
        }
        tableBuffer += ");\n\n"
        console.log(tableBuffer)
        SQlBuffer += tableBuffer
    }

    return errors.length > 0 ? errors : SQlBuffer
}