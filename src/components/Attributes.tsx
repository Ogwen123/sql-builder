import { Field } from '../global/types'

interface AttributesProps {
    fields: Field[]
}

// border-solid border-[2px] border-bgdark

const Attributes = ({ fields }: AttributesProps) => {
    return (
        <div className='w-[300px] '>
            {
                fields.map((val, index) => {
                    let classname = "fc w-1/6 border-solid border-[2px]"
                    if (val.key === "PRIMARY") {
                        return (
                            <div key={index} className={"flex flex-row w-[300px]"}>
                                <div className={classname + " bg-blue-700 border-blue-900"}>
                                    PK
                                </div>
                                <div className='fc w-5/6 px-[5px] border-solid border-[2px] border-bgdark'>
                                    {val.name}
                                </div>
                            </div>
                        )
                    }
                    else if (val.key === "FOREIGN") {
                        return (
                            <div key={index} className={"flex flex-row w-[300px]"}>
                                <div className={classname + " bg-purple-700 border-purple-900"}>
                                    FK
                                </div>
                                <div className='fc w-5/6 px-[5px] border-solid border-[2px] border-bgdark'>
                                    {val.name}
                                </div>
                            </div>
                        )
                    }
                    else {
                        return (
                            <div key={index} className={"flex flex-row w-[300px]"}>
                                <div className={'fc w-full px-[5px] border-solid border-[2px] border-bgdark'}>
                                    {val.name}
                                </div>
                            </div>
                        )
                    }
                })
            }
        </div>
    )
}

export default Attributes