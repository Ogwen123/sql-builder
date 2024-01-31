import { Transition, Dialog } from '@headlessui/react'
import React, { Fragment } from 'react'
import { Table } from '../global/types'

interface EditTableDialogProps {
    showEditTableDialog: string | undefined,
    setShowEditTableDialog: React.Dispatch<React.SetStateAction<string | undefined>>
    setTables: React.Dispatch<React.SetStateAction<Table[]>>
}

const EditTableDialog = ({ showEditTableDialog, setShowEditTableDialog, setTables }: EditTableDialogProps) => {

    const [deleteButtonPressed, setDeleteButtonPressed] = React.useState<boolean>(false)

    const editTable = () => {

    }

    return (
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
                            <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-bg p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 "
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

                                <div className="mt-4 ">
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
                                            Create
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
    )
}

export default EditTableDialog