import React, { Fragment } from 'react'
import {
    ArrowUpTrayIcon,
    PlusIcon,
    ArrowDownTrayIcon,
    ArrowUpOnSquareIcon,
    AdjustmentsHorizontalIcon
} from '@heroicons/react/20/solid'
import { Transition, Dialog } from '@headlessui/react'
import Draggable from 'react-draggable'

import { Table, Field, ForeignKeyLink } from './global/types'
import Attributes from './components/Attributes'
import NewTableDialog from './components/NewTableDialog'
import EditTableDialog from './components/EditTableDialog'

type DraggingElement = {
    id: string,
    startX: number,
    startY: number,
}

const App = () => {

    const [tables, setTables] = React.useState<Table[]>([])
    const [showNewTableDialog, setShowNewTableDialog] = React.useState<boolean>(false)
    const [showEditTableDialog, setShowEditTableDialog] = React.useState<string | undefined>()// put the name of the table to be edited
    const [showEditFieldDialog, setShowEditFieldDialog] = React.useState<string>()// put names like this -> tablename.fieldname

    React.useEffect(() => {
        let rawSaved = localStorage.getItem("database_autosave")
        console.log(rawSaved)
        if (rawSaved) {
            const saved = JSON.parse(rawSaved) as Table[]
            setTables(saved)
        }
    }, [])

    React.useEffect(() => {
        if (tables.length === 0) return
        autosave()
    }, [tables])

    const sortFields = (fields: Field[]) => {
        const keys = ["PRIMARY", "FOREIGN", "NONE"]

        return [...fields.sort((f1, f2) => {
            return keys.indexOf(f1.key) > keys.indexOf(f2.key) ? 1 : keys.indexOf(f1.key) < keys.indexOf(f2.key) ? -1 : 0
        })]
    }

    const autosave = () => {
        localStorage.setItem("database_autosave", JSON.stringify(tables))
    }

    const exportSQL = (e: React.MouseEvent<HTMLButtonElement>) => {
        e
        console.log("export sql")
    }

    const addTable = () => {
        setTables((prevTables) => ([...prevTables, {
            name: (document.getElementById("new-table-name") as HTMLInputElement).value,
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
        setShowEditTableDialog(showEditTableDialog)// !remove
    }

    return (
        <div className=''>

            <NewTableDialog showNewTableDialog={showNewTableDialog} setShowNewTableDialog={setShowNewTableDialog} addTable={addTable} />
            <EditTableDialog showEditTableDialog={showEditTableDialog} setShowEditTableDialog={setShowEditTableDialog} setTables={setTables} />

            <div id="canvas" className='w-[100vw] min-h-[100vh]'>
                {
                    tables.map((table, index) => {
                        return (
                            <Draggable
                                handle='#name'
                                bounds="#canvas"
                                key={index}
                            >
                                <div className='w-[300px] inline-block bg-bgdark'>
                                    <div id="name" className='fc cursor-move bg-green-700 border-solid border-[2px] border-green-900 rounded-t-md'>
                                        {table.name}
                                        <button onClick={(e) => {
                                            setShowEditTableDialog(table.name)
                                            console.log(table.name)
                                        }}>
                                            <AdjustmentsHorizontalIcon className='h-4 2-4 ml-[10px]' />
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
                    className='z-10 my-[10px] bottom-[30px] left-[10%] absolute w-4/5 bg-bgdark rounded-lg p-[5px] border-solid border-[2px] border-main'
                    style={{ height: "8%" }}
                >
                    <div className='flex flex-row h-full w-full'>
                        <button className='action-button' onClick={(e) => exportSQL(e)} title="Export as SQL">
                            <ArrowUpOnSquareIcon className='h-9 w-9 hover:text-main' />
                        </button>
                        <button className='action-button' onClick={() => setShowNewTableDialog(true)} title="New Table">
                            <PlusIcon className='h-9 w-9 hover:text-main' />
                        </button>
                        <button className='action-button' onClick={() => setShowNewTableDialog(true)} title="Save Database">
                            <ArrowDownTrayIcon className='h-9 w-9 hover:text-main' />
                        </button>
                        <button className='action-button' onClick={() => setShowNewTableDialog(true)} title="Load Database">
                            <ArrowUpTrayIcon className='h-9 w-9 hover:text-main' />
                        </button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default App