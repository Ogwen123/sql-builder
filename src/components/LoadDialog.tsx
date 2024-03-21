import { Transition, Dialog } from '@headlessui/react'
import React, { Fragment } from 'react'
import Alert from './Alert'
import { Alert_t } from '../global/types'

import { CheckIcon, TrashIcon } from '@heroicons/react/20/solid'

interface LoadDialogProps {
    showLoadDialog: boolean,
    setShowLoadDialog: React.Dispatch<React.SetStateAction<boolean>>,
    loadDatabase: (name: string) => boolean,
    deleteDatabase: (name: string) => boolean,
    error: Alert_t
}

const LoadDialog = ({ showLoadDialog, setShowLoadDialog, loadDatabase, deleteDatabase, error }: LoadDialogProps) => {
    const [name, setName] = React.useState<string>()
    const [savedDatabases, setSavedDatabases] = React.useState<string[]>()

    React.useEffect(() => {
        setSavedDatabases(undefined)
        setName(undefined)
        if (showLoadDialog === false) return

        for (let i of Object.keys(localStorage)) {
            const split_name = i.split(":")
            if (split_name[split_name.length - 1] !== "saveddb") continue
            setSavedDatabases((prevSaved) => ([...(prevSaved ? prevSaved : []), i]))
        }

    }, [showLoadDialog])

    return (
        <Transition appear show={showLoadDialog} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => { setShowLoadDialog(false) }}>
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
                                <Alert show={error[0]} message={error[2]} severity={error[1]} />
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 "
                                >
                                    Load a database
                                </Dialog.Title>
                                <div className="mt-2">
                                    <div className='bg-bgdark p-[10px] overflow-y-auto rounded-lg my-[5px]'>
                                        {
                                            savedDatabases?.map((databaseName, index) => {
                                                return (
                                                    <div
                                                        key={index}
                                                        className='hover:bg-white hover:bg-opacity-10 rounded-lg p-[5px] flex flex-row items-center'
                                                        onClick={() => {
                                                            setName(databaseName)
                                                        }}
                                                    >
                                                        {
                                                            name === databaseName &&
                                                            <CheckIcon className='h-5 w-5 mr-[10px]' />
                                                        }
                                                        {databaseName.split(":").splice(0, databaseName.split(":").length - 1).join(":")}
                                                        <TrashIcon className='ml-auto h5 w-5 hover:text-error' onClick={() => {
                                                            deleteDatabase(databaseName)
                                                            setSavedDatabases((prevSaved) => ([...(prevSaved ?? []).filter((saved) => (saved !== databaseName))]))
                                                        }} />
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    <div className={name ? "" : "text-gray-500"}>
                                        Selected saved database: {name ? name.split(":").splice(0, name.split(":").length - 1).join(":") : "Select a database to continue"}
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-row">
                                    <button
                                        type="button"
                                        className="button bg-warning hover:bg-warningdark mr-[5px]"
                                        onClick={() => setShowLoadDialog(false)}
                                    >
                                        Exit
                                    </button>
                                    <button
                                        type="button"
                                        className="button ml-[5px]"
                                        onClick={(e) => {
                                            if (!name) {
                                                return
                                            }
                                            e.preventDefault()
                                            const res = loadDatabase(name)
                                            console.log("res: " + res)
                                            if (res === true) setShowLoadDialog(false)
                                        }}
                                    >
                                        Load
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

export default LoadDialog