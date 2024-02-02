import { Transition, Dialog } from '@headlessui/react'
import React, { Fragment } from 'react'
import { Field } from '../global/types'

interface AddFieldDialogProps {
    showAddFieldDialog: string | undefined,
    setShowAddFieldDialog: React.Dispatch<React.SetStateAction<string | undefined>>
    addField: (tableName: string, fieldData?: Field) => void
}

const AddFieldDialog = ({ showAddFieldDialog, setShowAddFieldDialog, addField }: AddFieldDialogProps) => {
    return (
        <Transition appear show={showAddFieldDialog !== undefined} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => setShowAddFieldDialog(undefined)}>
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
                                    Create new field in
                                </Dialog.Title>
                                <div className="mt-2">
                                    <form onSubmit={(e) => {
                                        e.preventDefault()
                                        addField(showAddFieldDialog!)
                                        setShowAddFieldDialog(undefined)
                                    }}>
                                        <input className="form-input" placeholder='Name' id="new-table-name" />
                                    </form>
                                </div>

                                <div className="mt-4 flex flex-row">
                                    <button
                                        type="button"
                                        className="button bg-warning hover:bg-warningdark mr-[5px]"
                                        onClick={() => setShowAddFieldDialog(undefined)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="button ml-[5px]"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            addField(showAddFieldDialog!)
                                            setShowAddFieldDialog(undefined)
                                        }}
                                    >
                                        Create
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

export default AddFieldDialog