import { Transition, Dialog, Switch, RadioGroup, Listbox } from '@headlessui/react'
import React, { Fragment } from 'react'
import { PlusIcon, CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

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
    const [originalTables, setOriginalTables] = React.useState<Table[]>()

    const getTable = (name: string): Table | undefined => {
        let returnTable = undefined
        for (let i of tables) {
            if (i.name === name) returnTable = i
        }
        return returnTable
    }

    React.useEffect(() => {
        if (!table) return
        const tableObj = getTable(table)
        if (!tableObj) return
        setTableBuffer(tableObj)
        setSelectedField(tableObj.fields[0])
        setOriginalTables(tables)
    }, [table])

    React.useEffect(() => {
        console.log(selectedField)
    }, [selectedField])

    const resetAlert = () => {
        setTimeout(() => {
            setAlert([false, "", ""])
        }, config.defaultAlertLength)
    }

    const handleFieldData = (performSwitch: boolean, field?: Field) => {
        if (!selectedField || !tableBuffer) return

        let nameElement: HTMLInputElement | HTMLElement | null = document.getElementById("edit-field-name")

        if (nameElement === null || nameElement === undefined) {
            setAlert([true, "ERROR", "Name error"])
            resetAlert()
            return
        }

        if (!(nameElement as HTMLInputElement).value) {
            setAlert([true, "ERROR", "Please enter a field name before saving."])
            resetAlert()
            return
        }

        const name = (nameElement as HTMLInputElement).value

        const updatedFields: Field[] = []

        for (let i of tableBuffer.fields) {
            if (i.name === selectedField.name) {
                updatedFields.push({ ...selectedField, name: name })
            } else {
                updatedFields.push(i)
            }
        }

        if (!performSwitch) return { fields: updatedFields as Field[] }
        if (!field) return

        if (nameElement) {
            (nameElement as HTMLInputElement).value = field.name
        }
        setTableBuffer((prevTable) => ({ name: prevTable?.name as string, fields: updatedFields as Field[] }))
        console.log({ name: name as string, fields: updatedFields as Field[] })
        setSelectedField(field)
    }

    const saveTableChanges = () => {
        if (tableBuffer === undefined || selectedField === undefined) {
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

        const name: string = (nameElement as HTMLInputElement).value

        const newestFieldData = handleFieldData(false)

        if (!newestFieldData) return

        const newTable: Table = { name: name, fields: newestFieldData.fields }
        const updatedTables: Table[] = []

        for (let i of tables) {
            if (i.name !== table) {
                updatedTables.push(i)
            } else {
                updatedTables.push(newTable)
            }
        }

        setTables([...updatedTables])
        setShowEditTableDialog(undefined)
    }

    const addField = () => {
        if (tableBuffer === undefined || selectedField === undefined) return

        let field: Field;

        const regex = new RegExp("New Field [\d]{0,}")
        let max = -1
        for (let j of tableBuffer.fields) {
            if (regex.test(j.name)) {
                console.log(j.name);
                try {
                    const temp = Number(j.name.split(" ")[2])
                    max = temp > max ? temp : max
                } catch {
                    max = 0
                }
            }
        }

        const name = `New Field ${max === -1 ? "" : max + 1}`

        field = {
            name: name,
            type: "INT",
            key: "NONE",
            notNull: false,
            unique: false,
            default: ""
        }

        const newestFieldData = handleFieldData(false)

        if (!newestFieldData) return

        setTableBuffer((prevTable) => ({ name: prevTable?.name as string, fields: [...(newestFieldData.fields as Field[]), field] as Field[] }))

        let nameElement: HTMLInputElement | HTMLElement | null = document.getElementById("edit-field-name")
        console.log(nameElement);
        if (nameElement) {
            (nameElement as HTMLInputElement).value = name
        } else {
            console.log("huh");
        }

        setSelectedField(field)
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
                                                                    className={'w-full bg-bgdark rounded-lg p-[10px] my-[5px] scroll-y-auto border-solid border-[2px] border-bgdark hover:border-main ' + (selectedField?.name === val.name ? "bg-main border-main" : "")}
                                                                    onClick={() => {
                                                                        handleFieldData(true, val)
                                                                    }}
                                                                >
                                                                    {val.name}
                                                                </button>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                <div className='w-[2px] h-full bg-bg'></div>
                                                <div className='w-4/5 ml-[10px] overflow-y-scroll'>
                                                    <div className='flex flex-row'>Edit Field <div className='text-secondary whitespace-pre'> {selectedField?.name}</div></div>
                                                    <input className='form-input' type="text" defaultValue={selectedField?.name} id="edit-field-name"></input>
                                                    <div className='fc'>
                                                        <div className='border-solid border-[2px] bg-main bg-opacity-30 border-main m-[10px] ml-0 p-[5px] rounded-lg w-1/2 fc flex-col'>
                                                            <div>
                                                                Unique
                                                            </div>
                                                            <Switch
                                                                checked={selectedField ? selectedField?.unique : false}
                                                                onChange={() => {
                                                                    setSelectedField((curField) => ({ ...curField!, unique: !curField?.unique }))
                                                                }}
                                                                className={`${selectedField?.unique ? 'bg-success' : 'bg-error'
                                                                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                                                            >
                                                                <span className="sr-only">Unique</span>
                                                                <span
                                                                    className={`${selectedField?.unique ? 'translate-x-6' : 'translate-x-1'
                                                                        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                                                />
                                                            </Switch>
                                                        </div>
                                                        <div className='border-solid border-[2px] bg-main bg-opacity-30 border-main m-[10px] mr-0 p-[5px] rounded-lg w-1/2 fc flex-col'>
                                                            <div>
                                                                Not Null
                                                            </div>
                                                            <Switch
                                                                checked={selectedField ? selectedField?.notNull : false}
                                                                onChange={() => {
                                                                    setSelectedField((curField) => ({ ...curField!, notNull: !curField?.notNull }))
                                                                }}
                                                                className={`${selectedField?.notNull ? 'bg-success' : 'bg-error'
                                                                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                                                            >
                                                                <span className="sr-only">Not Null</span>
                                                                <span
                                                                    className={`${selectedField?.notNull ? 'translate-x-6' : 'translate-x-1'
                                                                        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                                                />
                                                            </Switch>
                                                        </div>
                                                    </div>
                                                    <RadioGroup
                                                        value={selectedField ? selectedField?.key : "NONE"}
                                                        onChange={(data) => {
                                                            setSelectedField((curField) => ({ ...curField!, key: data }))
                                                        }}
                                                        className="my-[5px]"
                                                    >
                                                        <RadioGroup.Label>Key</RadioGroup.Label>
                                                        <div className='fc'>
                                                            <RadioGroup.Option value="PRIMARY" className="fc h-[50px] mr-[5px]" style={{ width: "calc(100%/3)" }}>
                                                                {({ checked }) => (
                                                                    <span className={checked ? 'bg-main bg-opacity-30 h-full w-full fc border-solid border-[2px] border-main rounded-lg' : ''}>Primary</span>
                                                                )}
                                                            </RadioGroup.Option>
                                                            <RadioGroup.Option value="FOREIGN" className="fc h-[50px] mx-[5px]" style={{ width: "calc(100%/3)" }}>
                                                                {({ checked }) => (
                                                                    <span className={checked ? 'bg-main bg-opacity-30 h-full w-full fc border-solid border-[2px] border-main rounded-lg' : ''}>Foreign</span>
                                                                )}
                                                            </RadioGroup.Option>
                                                            <RadioGroup.Option value="NONE" className="fc h-[50px] mx-[5px]" style={{ width: "calc(100%/3)" }}>
                                                                {({ checked }) => (
                                                                    <span className={checked ? 'bg-main bg-opacity-30 h-full w-full fc border-solid border-[2px] border-main rounded-lg' : ''}>None</span>
                                                                )}
                                                            </RadioGroup.Option>
                                                        </div>
                                                    </RadioGroup>
                                                    <RadioGroup
                                                        value={selectedField ? selectedField?.type : "INT"}
                                                        onChange={(data) => {
                                                            setSelectedField((curField) => ({ ...curField!, type: data }))
                                                        }}
                                                        className="my-[5px]"
                                                    >
                                                        <RadioGroup.Label>Type</RadioGroup.Label>
                                                        <div className='fc'>
                                                            <RadioGroup.Option value="INT" className="fc h-[50px] mr-[5px]" style={{ width: "calc(100%/7)" }}>
                                                                {({ checked }) => (
                                                                    <span className={checked ? 'bg-main bg-opacity-30 h-full w-full fc border-solid border-[2px] border-main rounded-lg' : ''}>Int</span>
                                                                )}
                                                            </RadioGroup.Option>
                                                            <RadioGroup.Option value="FLOAT" className="fc h-[50px] mx-[5px]" style={{ width: "calc(100%/7)" }}>
                                                                {({ checked }) => (
                                                                    <span className={checked ? 'bg-main bg-opacity-30 h-full w-full fc border-solid border-[2px] border-main rounded-lg' : ''}>Float</span>
                                                                )}
                                                            </RadioGroup.Option>
                                                            <RadioGroup.Option value="VARCHAR" className="fc h-[50px] mx-[5px]" style={{ width: "calc(100%/7)" }}>
                                                                {({ checked }) => (
                                                                    <span className={checked ? 'bg-main bg-opacity-30 h-full w-full fc border-solid border-[2px] border-main rounded-lg' : ''}>Varchar</span>
                                                                )}
                                                            </RadioGroup.Option>
                                                            <RadioGroup.Option value="CHAR" className="fc h-[50px] mx-[5px]" style={{ width: "calc(100%/7)" }}>
                                                                {({ checked }) => (
                                                                    <span className={checked ? 'bg-main bg-opacity-30 h-full w-full fc border-solid border-[2px] border-main rounded-lg' : ''}>Char</span>
                                                                )}
                                                            </RadioGroup.Option>
                                                            <RadioGroup.Option value="DATE" className="fc h-[50px] mx-[5px]" style={{ width: "calc(100%/7)" }}>
                                                                {({ checked }) => (
                                                                    <span className={checked ? 'bg-main bg-opacity-30 h-full w-full fc border-solid border-[2px] border-main rounded-lg' : ''}>Date</span>
                                                                )}
                                                            </RadioGroup.Option>
                                                            <RadioGroup.Option value="TEXT" className="fc h-[50px] mx-[5px]" style={{ width: "calc(100%/7)" }}>
                                                                {({ checked }) => (
                                                                    <span className={checked ? 'bg-main bg-opacity-30 h-full w-full fc border-solid border-[2px] border-main rounded-lg' : ''}>Text</span>
                                                                )}
                                                            </RadioGroup.Option>
                                                            <RadioGroup.Option value="BLOB" className="fc h-[50px] ml-[5px]" style={{ width: "calc(100%/7)" }}>
                                                                {({ checked }) => (
                                                                    <span className={checked ? 'bg-main bg-opacity-30 h-full w-full fc border-solid border-[2px] border-main rounded-lg' : ''}>Blob</span>
                                                                )}
                                                            </RadioGroup.Option>
                                                        </div>
                                                    </RadioGroup>
                                                    {
                                                        selectedField?.key === "FOREIGN" ?
                                                            <div className='fc flex-row items-start'>
                                                                <div
                                                                    className='my-[10px]'
                                                                    style={{ width: "calc(50% - 5px)" }}
                                                                >
                                                                    <Listbox
                                                                        value={selectedField?.foreignKey?.table ? selectedField?.foreignKey?.table : ""}
                                                                        onChange={(data) => {
                                                                            console.log(data)
                                                                            setSelectedField((curField) => ({ ...curField!, foreignKey: { table: data, field: curField?.foreignKey?.field! } }))
                                                                        }}
                                                                    >
                                                                        <Listbox.Button className="w-full bg-bgdark p-[10px] rounded-lg fc mr-[5px] mb-[5px]">
                                                                            {selectedField?.foreignKey?.table ? selectedField?.foreignKey?.table : "Select a table"}
                                                                            <ChevronUpDownIcon className="h-5 w-5" />
                                                                        </Listbox.Button>
                                                                        <Listbox.Options className="bg-bgdark w-full p-[10px] rounded-lg">
                                                                            {tables.map((tableObj) => (
                                                                                <Listbox.Option
                                                                                    key={tableObj.name}
                                                                                    value={tableObj.name}
                                                                                    disabled={tableObj.name === table}
                                                                                    className={"rounded-lg p-[5px]" + (tableObj.name === table ? " text-gray-500" : " hover:bg-white hover:bg-opacity-10")}
                                                                                >
                                                                                    {({ selected }) => (
                                                                                        <div className='flex items-center flex-row'>
                                                                                            {selected && <CheckIcon className='h-5 w-5 mr-[10px]' />}
                                                                                            {tableObj.name}
                                                                                        </div>
                                                                                    )}
                                                                                </Listbox.Option>
                                                                            ))}
                                                                        </Listbox.Options>
                                                                    </Listbox>
                                                                </div>


                                                                <div
                                                                    className='my-[10px]'
                                                                    style={{ width: "calc(50% - 5px)" }}
                                                                >
                                                                    <Listbox
                                                                        value={selectedField?.foreignKey?.field}
                                                                        onChange={(data) => {
                                                                            setSelectedField((curField) => ({ ...curField!, foreignKey: { table: curField?.foreignKey?.table!, field: data } }))
                                                                        }}
                                                                    >
                                                                        <Listbox.Button
                                                                            className="w-full bg-bgdark p-[10px] rounded-lg fc ml-[5px] mb-[5px]"
                                                                        >
                                                                            {selectedField?.foreignKey?.table ? selectedField?.foreignKey?.field ? selectedField?.foreignKey?.field : "Select a field" : "Select a table before seleceting a field"}
                                                                            <ChevronUpDownIcon className="h-5 w-5" />
                                                                        </Listbox.Button>
                                                                        {
                                                                            selectedField?.foreignKey?.table ?
                                                                                <Listbox.Options className="bg-bgdark w-full p-[10px] rounded-lg ml-[5px]">
                                                                                    {(getTable(selectedField?.foreignKey?.table) as Table).fields.map((field) => (
                                                                                        <Listbox.Option
                                                                                            key={field.name}
                                                                                            value={field.name}
                                                                                            className="rounded-lg p-[5px] hover:bg-white hover:bg-opacity-10"
                                                                                        >
                                                                                            {({ selected }) => (
                                                                                                <div className='flex items-center flex-row'>
                                                                                                    {selected && <CheckIcon className='h-5 w-5 mr-[10px]' />}
                                                                                                    {field.name}
                                                                                                </div>
                                                                                            )}
                                                                                        </Listbox.Option>
                                                                                    ))}
                                                                                </Listbox.Options>
                                                                                :
                                                                                <Listbox.Options className="bg-bgdark p-[10px] rounded-lg">
                                                                                    <Listbox.Option
                                                                                        value={""}
                                                                                        disabled={true}
                                                                                    >
                                                                                        Select a table before selecting a field
                                                                                    </Listbox.Option>
                                                                                </Listbox.Options>
                                                                        }
                                                                    </Listbox>
                                                                </div>
                                                            </div>
                                                            :
                                                            <div></div>
                                                    }
                                                    <div className='text-xs text-hrdark'>A default value means all new fields that do not have a value explicitly set when adding a record will have this value.</div>
                                                    <input type="text" className="form-input" placeholder='Default Value'></input>
                                                </div>
                                            </div>
                                            <div className="mt-4 h-h-[108px]">
                                                <div className='flex flex-row'>
                                                    <button
                                                        type="button"
                                                        className="button bg-warning hover:bg-warningdark mr-[5px]"
                                                        onClick={() => {
                                                            setShowEditTableDialog(undefined)
                                                            console.log("cancelling")
                                                            console.log(originalTables)
                                                            setTables(originalTables!)
                                                        }}
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