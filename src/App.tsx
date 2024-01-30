import React, { Fragment } from 'react'
import { ArrowUpTrayIcon, PlusIcon } from '@heroicons/react/16/solid'
import { Transition, Dialog } from '@headlessui/react'

type ForeignKeyLink = {
    table: string,
    field: string
}

type Field = {
    name: string,
    type: "INT" | "FLOAT" | "VARCHAR" | "CHAR" | "DATE" | "TEXT" | "BLOB"
    length?: number,
    key: "PRIMARY" | "FOREIGN" | "NONE",
    foreignKey: ForeignKeyLink,
    notNull: boolean,
    unique: boolean,
    default: string
}

type Table = {
    name: string, // used as unique id
    fields: Field[]
}

type DraggingElement = {
    id: string,
    startX: number,
    startY: number,
}

const App = () => {

    const [tables, setTables] = React.useState<Table[]>([])
    const [showNewTableDialog, setShowNewTableDialog] = React.useState<boolean>(false)
    const [showEditTableDialog, setShowEditTableDialog] = React.useState<boolean>(false)
    const [draggingElement, setDraggingElement] = React.useState<DraggingElement>()

    React.useEffect(() => {
        if (!draggingElement) return
        document.addEventListener("mousemove", (e) => handleDrag(e))
        document.addEventListener("mouseup", (e) => handleMouseUp(e))
    }, [draggingElement])

    // handle the dragging
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        setDraggingElement({ id: e.currentTarget.id as string, startX: e.clientX, startY: e.clientY })
    }

    const handleDrag = (e: MouseEvent) => {
        if (!draggingElement) return
        e.preventDefault()
        const elem = document.getElementById(draggingElement?.id!)
        console.log(elem)
        if (!elem) return
        console.log("tf you mean")
        elem.style.top = (elem.offsetTop - (draggingElement?.startY! - e.clientX)).toString()
        elem.style.left = (elem.offsetLeft - (draggingElement?.startX! - e.clientX)).toString()

    }

    const handleMouseUp = (e: MouseEvent) => {
        console.log("fghuidfhg")
        setDraggingElement(undefined)
        document.addEventListener("mousemove", () => { })
        document.addEventListener("mouseup", () => { })
    }

    const exportSQL = (e: React.MouseEvent<HTMLButtonElement>) => {
        e
        console.log("export sql")
    }

    const addTable = () => {

        setTables((prevTables) => ([...prevTables, { name: (document.getElementById("new-table-name") as HTMLInputElement).value, fields: [] }]))
        setShowEditTableDialog(showEditTableDialog)// !remove
    }

    return (
        <div className=''>

            <Transition appear show={showNewTableDialog} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setShowNewTableDialog(false)}>
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
                                        Create new table
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <form onSubmit={(e) => {
                                            e.preventDefault()
                                            addTable()
                                            setShowNewTableDialog(false)
                                        }}>
                                            <input className="form-input" placeholder='Name' id="new-table-name" />
                                        </form>
                                    </div>

                                    <div className="mt-4 flex flex-row">
                                        <button
                                            type="button"
                                            className="button bg-warning hover:bg-warningdark mr-[5px]"
                                            onClick={() => setShowNewTableDialog(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="button ml-[5px]"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                addTable()
                                                setShowNewTableDialog(false)
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

            <div id="canvas" className='min-w-[100vw] min-h-[100vh]'>
                {
                    tables.map((table, index) => {
                        return (
                            <div
                                key={index}
                                className='cursor-move absolute'
                                onMouseDown={(e) => handleMouseDown(e)}
                                id={"table-container-" + index}
                            >
                                {table.name}
                            </div>
                        )
                    })
                }
                <div id="action-bar" className='z-10 my-[10px] bottom-[30px] left-[10%] absolute w-4/5 h-[74px] bg-bgdark rounded-lg p-[5px] border-solid border-[2px] border-main'>
                    <div className='flex flex-row'>
                        <button className='bg-bg rounded-lg h-[60px] w-[60px] fc mr-[10px]' onClick={(e) => exportSQL(e)}>
                            <ArrowUpTrayIcon className='h-9 w-9 hover:text-main' />
                        </button>
                        <button className='bg-bg rounded-lg h-[60px] w-[60px] fc mr-[10px]' onClick={() => setShowNewTableDialog(true)}>
                            <PlusIcon className='h-9 w-9 hover:text-success' />
                        </button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default App