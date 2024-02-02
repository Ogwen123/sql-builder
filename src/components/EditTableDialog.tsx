import { Transition, Dialog } from '@headlessui/react'
import React, { Fragment } from 'react'
import { Field, Table } from '../global/types'

interface EditTableDialogProps {
    showEditTableDialog: string | undefined,
    setShowEditTableDialog: React.Dispatch<React.SetStateAction<string | undefined>>
    table: Table,
    setTables: React.Dispatch<React.SetStateAction<Table[]>>
}

const EditTableDialog = ({ showEditTableDialog, setShowEditTableDialog, table, setTables }: EditTableDialogProps) => {
    if (Object.keys(table).length === 0 && showEditTableDialog !== undefined) { console.log(showEditTableDialog); return (<div>uhh oh bad table name</div>) }

    const [deleteButtonPressed, setDeleteButtonPressed] = React.useState<boolean>(false)
    const [selectedField, setSelectedField] = React.useState<Field>()

    React.useEffect(() => {
        if (Object.keys(table).length === 0) return

        setSelectedField(table.fields[0])
    }, [showEditTableDialog])

    const editTable = () => {

    }

    const addField = () => {

    }

    return (
        <div>
            {
                Object.keys(table).length > 0 && showEditTableDialog !== undefined ?
                    <Transition appear show={showEditTableDialog !== undefined} as={Fragment}>
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
                                        <Dialog.Panel className="w-full max-w-[1500px] h-[700px] transform overflow-hidden rounded-2xl bg-hr p-6 text-left align-middle shadow-xl transition-all">
                                            <div>
                                                <Dialog.Title
                                                    as="h3"
                                                    className="text-lg font-medium leading-6 h-[24px]"
                                                >
                                                    Edit table {showEditTableDialog}
                                                </Dialog.Title>
                                                <div className="mt-2">
                                                    <form onSubmit={(e) => {
                                                        e.preventDefault()
                                                        editTable()
                                                        setShowEditTableDialog(undefined)
                                                    }}>
                                                        <input className="form-input" placeholder='Name' id="edit-table-name" defaultValue={showEditTableDialog} />
                                                    </form>
                                                </div>
                                            </div>
                                            <div className='h-[2px] w-full bg-bg my-[10px]'></div>
                                            <div className='flex flex-row h-[calc(100%-236px)]'>
                                                <div className='w-1/5 mr-[10px]'>
                                                    <button
                                                        className='w-full bg-bgdark rounded-lg p-[10px] my-[5px] scroll-y-auto border-solid border-[2px] border-bgdark hover:border-main'
                                                        onClick={() => {
                                                            addField()
                                                        }}
                                                    >
                                                        Add new field
                                                    </button>
                                                    {
                                                        table.fields.map((val, index) => {
                                                            return (
                                                                <button key={index} className='w-full bg-bgdark rounded-lg p-[10px] my-[5px] scroll-y-auto border-solid border-[2px] border-bgdark hover:border-main'>
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
                                                            editTable()
                                                            setShowEditTableDialog(undefined)
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
                                                            setTables((prevTables) => [...prevTables.filter((table) => table.name !== showEditTableDialog)])
                                                            setShowEditTableDialog(undefined)
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