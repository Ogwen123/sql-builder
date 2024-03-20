import { Transition, Dialog } from '@headlessui/react'
import React, { Fragment } from 'react'
import { Alert_t } from '../global/types'
import Alert from './Alert'

interface SaveAsDialogProps {
    showSaveAsDialog: boolean,
    setShowSaveAsDialog: React.Dispatch<React.SetStateAction<boolean>>
    saveAs: (name: string) => boolean,
    error: Alert_t
}

const SaveAsDialog = ({ showSaveAsDialog, setShowSaveAsDialog, saveAs, error }: SaveAsDialogProps) => {

    const replaceAllImpl = (str: string, charE: string, charR: string): string => {
        let buf: string = ""
        for (let i of str) {
            if (i === charE) buf += charR
            else buf += i
        }
        return buf
    }

    const [name, setName] = React.useState<string>("")
    return (
        <Transition appear show={showSaveAsDialog} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => { setShowSaveAsDialog(false) }}>
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
                                    Save table as
                                </Dialog.Title>
                                <div className="mt-2">
                                    <form onSubmit={(e) => {
                                        e.preventDefault()
                                        const res = saveAs(name)
                                        if (res === true) setShowSaveAsDialog(false)
                                    }}>
                                        <input
                                            className="form-input"
                                            placeholder='Name'
                                            id="save-as-name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />

                                        <div>Name: {replaceAllImpl(name, " ", "-")}</div>
                                    </form>
                                </div>

                                <div className="mt-4 flex flex-row">
                                    <button
                                        type="button"
                                        className="button bg-warning hover:bg-warningdark mr-[5px]"
                                        onClick={() => setShowSaveAsDialog(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="button ml-[5px]"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            const res = saveAs(name)
                                            console.log("res: " + res)
                                            if (res === true) setShowSaveAsDialog(false)
                                        }}
                                    >
                                        Save
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

export default SaveAsDialog