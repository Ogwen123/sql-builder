import React from 'react'
import { ArrowUpTrayIcon, PlusIcon } from '@heroicons/react/16/solid'

const App = () => {

    const exportSQL = (e: React.MouseEvent<HTMLButtonElement>) => {
        e
        console.log("export sql")
    }

    const addTable = (e: React.MouseEvent<HTMLButtonElement>) => {
        e
        console.log("add table")
    }

    return (
        <div className=''>
            <div id="canvas" className='min-w-[100vw] min-h-[100vh]'>
                <div id="action-bar" className='z-10 my-[10px] bottom-[30px] left-[10%] absolute w-4/5 h-[70px] bg-bgdark rounded-lg p-[5px]'>
                    <div className='flex flex-row'>
                        <button className='bg-bg rounded-lg h-[60px] w-[60px] fc mr-[10px]' onClick={(e) => exportSQL(e)}>
                            <ArrowUpTrayIcon className='h-9 w-9 hover:text-main' />
                        </button>
                        <button className='bg-bg rounded-lg h-[60px] w-[60px] fc mr-[10px]' onClick={(e) => addTable(e)}>
                            <PlusIcon className='h-9 w-9 hover:text-success' />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App