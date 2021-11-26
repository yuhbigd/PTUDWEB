import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import InfoLog from '../infoLog/InfoLog'
import { useAsyncFn} from 'react-use'
import { useDispatch } from 'react-redux'
import * as actions from './../../actions/index'
import {useMountedState} from 'react-use'
import Alog from '../Alog/Alog'
import MultiOption from '../options/MultiOption'

const ProvinceTable = (props) => {
    const province = useSelector(state => state.provinceRe)
    const [keyIndex, setKeyIndex] = useState(null)
    const dispatch = useDispatch()
    const isMounted = useMountedState()
    const [multiOption, setMultiOption] = useState(false)
    const [selectedUnit, setSelectedUnit] = useState([])

    const provinceOnclick = (id, index, e) => {
        props.setDir(state => [...state, province[index]])
        props.setLastLevel(1)
    }

    const [request, setRequest] = useAsyncFn(async() => {
        const res = await fetch('http://localhost:3001/country', {
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
            setRequest()
        }
    }, [])

    useEffect(() =>{
        if(request.value) {
            const action = actions.set_province([...JSON.parse(request.value).data])
            dispatch(action)
        }
    }, [request])

    const buttonOnclick = (id, index ,e) => {
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
            setSelectedUnit([])
        }
    }    
    
    return (
        <div id='unit-table-container'>
            <div className='overall-info-container'>
                <Alog data={props.dir[props.dir.length - 1]}></Alog>
            </div>
            <div className='unit-table'>
                <div className='option-container'>
                    <button onClick={() => {multiOptionToggle()}}>
                        {multiOption ? 'close multiselect' : 'multiSelect' } 
                    </button>
                    {   
                        selectedUnit.length || !multiOption ? <MultiOption selectedUnit={multiOption ? selectedUnit : province}></MultiOption> : null
                    }
                </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Mã</th>
                                <th>tên</th>
                                <th>cấp</th>
                                <th></th>
                                <th>
                                    {multiOption ? 'multiselect': null}
                                </th>
                            </tr>
                        </thead>
                        {province.map((item, index) => {
                            return(
                                <tbody key={index}>
                                    <tr>
                                        <td>{item.id}</td>
                                        <td onClick={(e) => provinceOnclick(item.id, index, e)}>{item.name}</td>
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
                                            <td colSpan="4"><InfoLog data={province[index]} setKeyIndex={setKeyIndex}></InfoLog></td>
                                        : null}
                                    </tr>
                                </tbody>            
                            )
                        })}
                    </table>
                </div>
            </div>
            
       
    )
}

export default ProvinceTable
