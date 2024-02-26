import { Transition, Dialog } from '@headlessui/react'
import React, { Fragment } from 'react'
import { PlusIcon } from '@heroicons/react/20/solid'

import { Field, Table, Alert_t } from '../global/types'
import Alert from './Alert'
import config from "../../config.json"

interface EditTableDialogProps {
    setShowEditTableDialog: React.Dispatch<React.SetStateAction<string | undefined>>
    table: string,
    tables: Table[],
    setTables: React.Dispatch<React.SetStateAction<Table[]>>,
    removeTable: (name: string) => void
}

const EditTableDialog = ({ setShowEditTableDialog, table, tables, setTables, removeTable }: EditTableDialogProps) => {
    const [deleteButtonPressed, setDeleteButtonPressed] = React.useState<boolean>(false)
    const [selectedField, setSelectedField] = React.useState<Field>()
    const [tableBuffer, setTableBuffer] = React.useState<Table>()
    const [alert, setAlert] = React.useState<Alert_t>([false, "", ""])

    React.useEffect(() => {
        if (!table) return
        setTableBuffer(getTable(table))
    }, [table])

    React.useEffect(() => {
        if (tableBuffer === undefined) return

        setSelectedField(tableBuffer.fields[0])
    }, [tableBuffer])

    React.useEffect(() => {
        console.log(table)
    }, [table])

    React.useEffect(() => {
        console.log("changes")
    }, [tables])

    const getTable = (name: string): Table | undefined => {
        for (let i of tables) {
            if (i.name === name) return i
        }
        return undefined
    }

    const resetAlert = () => {
        setTimeout(() => {
            setAlert([false, "", ""])
        }, config.defaultAlertLength)
    }

    const saveTableChanges = () => {
        if (tableBuffer === undefined) {
            return
        }

        let nameElement: HTMLInputElement | HTMLElement | null = document.getElementById("edit-table-name")
        if (nameElement === null || nameElement === undefined) {
            setAlert([true, "ERROR", "Name error"])
            resetAlert()
            return
        }

        if (!(nameElement as HTMLInputElement).value) {
            setAlert([true, "ERROR", "Please enter a table name before saving."])
            resetAlert()
            return
        }
        const name = (nameElement as HTMLInputElement).value
        const newTable: Table = { ...tableBuffer, name: name }
        const newTables: Table[] = []

        for (let i of tables) {
            if (i.name !== table) {
                newTables.push(i)
            } else {
                newTables.push(newTable)
            }
        }

        setTables([...newTables])
        setShowEditTableDialog(undefined)
    }

    const addField = () => {
        if (tableBuffer === undefined) return
        let field: Field;

        const regex = new RegExp("New Field [\d]{0,}")
        let count = 0
        for (let j of tableBuffer.fields) {
            if (regex.test(j.name)) {
                count += 1
            }
        }
        field = {
            name: `New Field ${count === 0 ? "" : count}`,
            type: "INT",
            key: "NONE",
            notNull: false,
            unique: false,
            default: ""
        }
        tableBuffer.fields.push(field)

        if (field! === undefined) return
        setSelectedField(field)
    }
    //@ts-ignore
    const editFieldChanges = () => {

    }

    //@ts-ignore
    const saveFieldChanges = () => {

    }

    return (
        <div>
            {
                tableBuffer !== undefined ?
                    <Transition appear show={table !== undefined} as={Fragment}>
                        <Dialog as="div" className="relative z-10" onClose={() => setShowEditTableDialog(undefined)}>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0 bg-black/25" />
                            </Transition.Child>

                            <div className="fixed inset-0 overflow-y-auto">
                                <div className="flex min-h-full items-center justify-center p-4 text-center">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0 scale-95"
                                        enterTo="opacity-100 scale-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100 scale-100"
                                        leaveTo="opacity-0 scale-95"
                                    >
                                        <Dialog.Panel className="w-full max-w-[1500px] h-[700px] transform overflow-y-auto rounded-2xl bg-hr p-6 text-left align-middle shadow-xl transition-all">
                                            <div>
                                                <Alert show={alert[0]} severity={alert[1]} message={alert[2]} className='mb-[10px]' />
                                                <Dialog.Title
                                                    as="h3"
                                                    className="text-lg font-medium leading-6 h-[24px]"
                                                >
                                                    Edit table {table}
                                                </Dialog.Title>
                                                <div className="mt-2">
                                                    <form onSubmit={(e) => {
                                                        e.preventDefault()
                                                        saveTableChanges()
                                                        setShowEditTableDialog(undefined)
                                                    }}>
                                                        <input className="form-input" placeholder='Name' id="edit-table-name" defaultValue={table} />
                                                    </form>
                                                </div>
                                            </div>
                                            <div className='h-[2px] w-full bg-bg my-[10px]'></div>
                                            <div className='flex flex-row h-[calc(100%-236px)]'>
                                                <div className='w-1/5 mr-[10px] overflow-y-auto'>
                                                    <button
                                                        className='w-full bg-main hover:bg-maindark rounded-lg p-[10px] my-[5px] scroll-y-auto border-solid border-[2px] border-main hover:border-maindark fc flex-row'
                                                        onClick={() => {
                                                            addField()
                                                        }}
                                                    >
                                                        Add new field
                                                        <PlusIcon className='h-6 w-6 ml-[10px]' />
                                                    </button>
                                                    {
                                                        tableBuffer.fields.map((val, index) => {
                                                            return (
                                                                <button
                                                                    key={index}
                                                                    className='w-full bg-bgdark rounded-lg p-[10px] my-[5px] scroll-y-auto border-solid border-[2px] border-bgdark hover:border-main'
                                                                    onClick={() => {
                                                                        setSelectedField(val)
                                                                    }}
                                                                >
                                                                    {val.name}
                                                                </button>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                <div className='w-[2px] h-full bg-bg'></div>
                                                <div className='w-4/5 ml-[10px]'>
                                                    <div className='flex flex-row'>Edit Field <div className='text-secondary whitespace-pre'> {selectedField?.name}</div></div>

                                                </div>
                                            </div>
                                            <div className="mt-4 h-h-[108px]">
                                                <div className='flex flex-row'>
                                                    <button
                                                        type="button"
                                                        className="button bg-warning hover:bg-warningdark mr-[5px]"
                                                        onClick={() => setShowEditTableDialog(undefined)}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="button ml-[5px]"
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            saveTableChanges()

                                                        }}
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="button bg-error hover:bg-errordark mr-[5px]"
                                                    onClick={() => {
                                                        if (!deleteButtonPressed) setDeleteButtonPressed(true)
                                                        else {
                                                            removeTable(table)
                                                            setShowEditTableDialog(undefined)
                                                            setDeleteButtonPressed(false)
                                                        }
                                                    }}
                                                >
                                                    {deleteButtonPressed ? "Click again to confirm" : "Delete"}
                                                </button>
                                            </div>
                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </Transition>
                    :
                    <div></div>
            }
        </div>
    )
}

export default EditTableDialog