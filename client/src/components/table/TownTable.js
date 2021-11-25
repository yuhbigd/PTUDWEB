import React, {useEffect, useState} from 'react'
import { useAsyncFn } from 'react-use'
import { useMountedState } from 'react-use'
import InfoLog from '../infoLog/InfoLog'
import Alog from '../Alog/Alog'
import MultiOption from '../options/MultiOption'

const TownTable = (props) => {
    const [town, setTown] = useState([])
    const [keyIndex, setKeyIndex] = useState(null)
    const [multiOption, setMultiOption] = useState(false)
    const [selectedUnit, setSelectedUnit] = useState([])  
    const isMounted = useMountedState()

    const townOnclick = (id, index, e) => {
        
    }

    const [request, setRequest] = useAsyncFn(async(id) => {
        const res = await fetch(`http://localhost:3001/country/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        const result = await res.text()
        return result
    })

    useEffect(() => {
        if(isMounted) {
            setRequest(props.dir[props.dir.length - 1].id)
        }
    }, [])

    useEffect(() =>{
        if(request.value) {
            setTown([...JSON.parse(request.value).data])
        }
    }, [request])

    const buttonOnclick = (id, index, e) => {
        setKeyIndex(index)
    } 

    const handleMultiOption = (e, item) => {
        if(e.target.checked) {
            setSelectedUnit(state => [...state, item])
        }else {
            setSelectedUnit(selectedUnit.filter((unchecked) => item.id !== unchecked.id))
        }
    }

    const multiOptionToggle = () => {
        setMultiOption(!multiOption)
        if(multiOption) {
            console.log('this')
            setSelectedUnit([])
        }
    } 

    return (
        <div className='unit-table-container'>
            <div className='overall-info-container'>
                <Alog data={props.dir[props.dir.length - 1]}></Alog>
            </div>
            <div className='unit-table'>
                <div className='option-container'>
                    <button onClick={() => {multiOptionToggle()}}>
                        {multiOption ? 'close multiselect' : 'multiSelect' } 
                    </button>
                    {   
                        selectedUnit.length || !multiOption ? <MultiOption selectedUnit={multiOption ? selectedUnit : town}></MultiOption> : null
                    }
                </div>

                {request.loading ? 
                <div>
                    thisthis this this this
                </div>
                    :
                <table className="table">
                    <thead>
                        <tr>
                            <th>Mã</th>
                            <th>tên</th>
                            <th>cấp</th>
                            <th></th>
                            <th>
                                {multiOption ? <input type='checkbox'></input>: null}
                            </th>
                        </tr>
                    </thead>
                    {town.map((item, index) => {
                        return(
                            <tbody key={index}>
                                <tr >
                                    <td>{item.id}</td>
                                    <td onClick={() => townOnclick(item.id, index)} >{item.name}</td>
                                    <td>{item.level}</td>
                                    <td>
                                        <button onClick={(e) => buttonOnclick(item.id, index, e)}>Chi tiết</button>
                                    </td>
                                    <td>
                                        {multiOption ? <input type='checkbox' value={item} onChange={(e) => {handleMultiOption(e, item)}}></input>: null}
                                    </td>
                                </tr>
                                <tr>
                                    {index === keyIndex ? 
                                        <td colSpan="4"><InfoLog data={town[index]} setKeyIndex={setKeyIndex}></InfoLog></td>
                                    : null}
                                </tr>
                            </tbody>
                        )
                    })}
                </table>
                }
            </div> 
        </div>
    )
}

export default TownTable
