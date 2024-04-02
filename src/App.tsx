import React from 'react'
import {
    PlusIcon,
    ArrowDownTrayIcon,
    ArrowUpOnSquareIcon,
    AdjustmentsHorizontalIcon,
    Cog6ToothIcon
} from '@heroicons/react/20/solid'
import Draggable from 'react-draggable'

import { Table, Field, Alert_t } from './global/types'
import Attributes from './components/Attributes'
import NewTableDialog from './components/NewTableDialog'
import EditTableDialog from './components/EditTableDialog'
import config from "../config.json"
import SaveAsDialog from './components/SaveAsDialog'
import LoadDialog from './components/LoadDialog'
import SQLDialog from './components/SQLDialog'

const App = () => {
    const [tables, setTables] = React.useState<Table[]>([])
    const [showNewTableDialog, setShowNewTableDialog] = React.useState<boolean>(false)
    const [showSaveAsDialog, setShowSaveAsDialog] = React.useState<boolean>(false)
    const [showLoadDialog, setShowLoadDialog] = React.useState<boolean>(false)
    const [showSQLDialog, setShowSQLDialog] = React.useState<boolean>(false)
    const [showEditTableDialog, setShowEditTableDialog] = React.useState<string | undefined>()// put the name of the table to be edited

    // errors are stored here not in the dialog component because the errors are generated in this component
    const [newTableError, setNewTableError] = React.useState<Alert_t>([false, "", ""])
    const [saveAsError, setSaveAsError] = React.useState<Alert_t>([false, "", ""])
    const [loadError, setLoadError] = React.useState<Alert_t>([false, "", ""])

    React.useEffect(() => {
        let rawSaved = localStorage.getItem("database_autosave")
        if (rawSaved) {
            const saved = JSON.parse(rawSaved) as Table[]
            setTables(saved)
        }
    }, [])

    React.useEffect(() => {
        console.log("?")
        console.log(tables)
        if (tables.length === 0) return
        autosave()
    }, [tables])

    //React.useEffect(() => {
    //    console.log(tables)
    //}, [showEditTableDialog])

    const sortFields = (fields: Field[]) => {
        const keys = ["PRIMARY", "FOREIGN", "NONE"]

        return [...fields.sort((f1, f2) => {
            return keys.indexOf(f1.key) > keys.indexOf(f2.key) ? 1 : keys.indexOf(f1.key) < keys.indexOf(f2.key) ? -1 : 0
        })]
    }

    const autosave = () => {
        localStorage.setItem("database_autosave", JSON.stringify(tables))
    }

    const addTable = (): boolean => {
        const name = (document.getElementById("new-table-name") as HTMLInputElement).value
        if (name === "") {
            setNewTableError([true, "ERROR", "Enter a name for the table."])
            setTimeout(() => {
                setNewTableError([false, "", ""])
            }, config.defaultAlertLength)
            return false
        }

        for (let i of tables) {
            if (i.name === name) {
                setNewTableError([true, "ERROR", "There is already a table with this name."])
                setTimeout(() => {
                    setNewTableError([false, "", ""])
                }, config.defaultAlertLength)
                return false
            }
        }
        setTables((prevTables) => ([...prevTables, {
            name: name,
            fields: sortFields(
                [
                    {
                        name: "test 1",
                        type: "INT",
                        key: "FOREIGN",
                        notNull: false,
                        unique: false,
                        default: ""
                    },
                    {
                        name: "test 2",
                        type: "INT",
                        key: "PRIMARY",
                        notNull: false,
                        unique: false,
                        default: ""
                    },
                    {
                        name: "test 3",
                        type: "INT",
                        key: "NONE",
                        notNull: false,
                        unique: false,
                        default: ""
                    },
                    {
                        name: "test 4",
                        type: "INT",
                        key: "FOREIGN",
                        notNull: false,
                        unique: false,
                        default: ""
                    }
                ]
            )
        }]))
        return true
    }

    const removeTable = (name: string) => {
        setTables((prevTables) => [...prevTables.filter((curTable) => curTable.name !== name)])
    }

    const databaseSaveAs = (name: string): boolean => {
        if (localStorage.getItem(name + ":saveddb") !== null) {
            if (!saveAsError[2].endsWith("(ERR-001)")) {
                setSaveAsError([true, "ERROR", "A database with this name already exists, click save again to overwrite it. (ERR-001)"])
                return false
            }
        }

        localStorage.setItem(name + ":saveddb", JSON.stringify(tables))

        return true
    }

    const databaseLoad = (name: string): boolean => {
        if (localStorage.getItem(name) === null) {
            setLoadError([true, "ERROR", "No database is saved with this name."])
            return false
        }

        setTables(JSON.parse(localStorage.getItem(name)!) as Table[])

        return true
    }

    const savedDatabaseDelete = (name: string): boolean => {
        if (localStorage.getItem(name) === null) {
            setLoadError([true, "ERROR", "No database is saved with this name."])
            return false
        }
        localStorage.removeItem(name)
        return true
    }

    return (
        <div className=''>

            <SQLDialog
                showSQLDialog={showSQLDialog}
                setShowSQLDialog={setShowSQLDialog}
                tables={tables}
            />

            <NewTableDialog
                showNewTableDialog={showNewTableDialog}
                setShowNewTableDialog={setShowNewTableDialog}
                addTable={addTable}
                error={newTableError}
            />

            <SaveAsDialog
                showSaveAsDialog={showSaveAsDialog}
                setShowSaveAsDialog={setShowSaveAsDialog}
                saveAs={databaseSaveAs}
                error={saveAsError}
            />

            <LoadDialog
                showLoadDialog={showLoadDialog}
                setShowLoadDialog={setShowLoadDialog}
                loadDatabase={databaseLoad}
                deleteDatabase={savedDatabaseDelete}
                error={loadError}
            />

            {showEditTableDialog &&
                <EditTableDialog
                    setShowEditTableDialog={setShowEditTableDialog}
                    table={showEditTableDialog}
                    tables={tables}
                    setTables={setTables}
                    removeTable={removeTable}
                />
            }

            <div id="canvas" className='w-[100vw] min-h-[100vh]'>
                {
                    tables.map((table, index) => {
                        return (
                            <Draggable
                                handle='.handle'
                                bounds="#canvas"
                                key={index}
                                defaultClassName='rounded-b-md overflow-hidden'
                            >
                                <div className='w-[300px] inline-block bg-bgdark rounded-md'>
                                    <div className='handle fc cursor-move bg-green-700 border-solid border-[2px] border-green-900 rounded-t-md'>
                                        {table.name}
                                        <button onClick={() => {
                                            setShowEditTableDialog(table.name)
                                        }}>
                                            <AdjustmentsHorizontalIcon className='h-4 w-4 ml-[10px]' />
                                        </button>
                                    </div>
                                    <Attributes fields={table.fields} />
                                </div>
                            </Draggable>
                        )
                    })
                }
                <div
                    id="action-bar"
                    className='z-10 my-[10px] bottom-[30px] left-[10%] absolute w-4/5 bg-bgdark rounded-md p-[5px] border-solid border-[2px] border-main'
                    style={{ height: "8%" }}
                >
                    <div className='flex flex-row h-full w-full'>
                        <button className='action-button' onClick={() => setShowSQLDialog(true)} title="Export as SQL">
                            <ArrowUpOnSquareIcon className='h-9 w-9 hover:text-main' />
                        </button>
                        <button className='action-button' onClick={() => setShowNewTableDialog(true)} title="New table">
                            <PlusIcon className='h-9 w-9 hover:text-main' />
                        </button>
                        <button className='action-button' onClick={() => setShowSaveAsDialog(true)} title="Save database schema">
                            <ArrowDownTrayIcon className='h-9 w-9 hover:text-main' />
                        </button>
                        <button className='action-button' onClick={() => setShowLoadDialog(true)} title="Manage saved database schemas">
                            <Cog6ToothIcon className='h-9 w-9 hover:text-main' />
                        </button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default App