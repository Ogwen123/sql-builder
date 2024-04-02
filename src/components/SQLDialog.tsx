import { Transition, Dialog } from '@headlessui/react'
import React, { Fragment } from 'react'
import { generateSQL } from '../global/generateSQL'
import { Table } from '../global/types'

import { DocumentDuplicateIcon } from '@heroicons/react/20/solid'

interface SaveAsDialogProps {
    showSQLDialog: boolean,
    setShowSQLDialog: React.Dispatch<React.SetStateAction<boolean>>
    tables: Table[]
}

const SQLDialog = ({ showSQLDialog, setShowSQLDialog, tables }: SaveAsDialogProps) => {

    const [sql, setSql] = React.useState<string>()
    const [errors, setErrors] = React.useState<string[]>()

    React.useEffect(() => {
        if (showSQLDialog === false) return

        const res = generateSQL(tables)
        console.log(typeof res)
        if (typeof res !== "string") {
            setErrors(res)
        } else {
            setSql(res)
        }

    }, [showSQLDialog])


    return (
        <Transition appear show={showSQLDialog} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => { setShowSQLDialog(false) }}>
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
                                    Exported SQL
                                </Dialog.Title>
                                <div className="mt-2">
                                    {sql ?
                                        <div>
                                            <div className='text-xl flex flex-row text-success'>
                                                Success
                                                <DocumentDuplicateIcon
                                                    className='h-5 w-5 ml-auto hover:text-main text-white'
                                                    onClick={() => {
                                                        window.navigator.clipboard.writeText(sql)
                                                        alert("Copied SQL code to clipboard.")
                                                    }}
                                                />
                                            </div>
                                            <div className='bg-bgdark p-[10px] rounded-md whitespace-pre-line mt-[10px]'>
                                                {sql}
                                            </div>
                                        </div>
                                        :
                                        errors ?
                                            <div>
                                                <div className='text-xl text-error'>Errors</div>
                                                <div className='bg-bgdark p-[10px] rounded-md'>
                                                    {
                                                        errors.map((error, index) => {
                                                            return (
                                                                <div key={index}>
                                                                    {error}
                                                                    <div className='w-full h-[2px] bg-hrdark my-[5px]'></div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            :
                                            <div>Nothing to see here</div>
                                    }
                                </div>

                                <div className="mt-4 flex flex-row">
                                    <button
                                        type="button"
                                        className="button bg-warning hover:bg-warningdark mr-[5px]"
                                        onClick={() => setShowSQLDialog(false)}
                                    >
                                        Leave
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

export default SQLDialog