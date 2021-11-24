import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import InfoLog from '../infoLog/InfoLog'
import { useAsyncFn } from 'react-use'
import { useDispatch } from 'react-redux'
import * as actions from './../../actions/index'

const ProvinceTable = (props) => {
    const province = useSelector(state => state.provinceRe)
    const [keyIndex, setKeyIndex] = useState(null)
    const dispatch = useDispatch()

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
        console.log(result)
        return result
    })

    useEffect(() => {
        setRequest()
    }, [])
    
    const provinceOnclick = (id, index, e) => {
        // <InfoLog data={province}></InfoLog>
        console.log('this')
        props.setDir(state => [...state, province[index]])
        props.setLastLevel(1)
    }

    const buttonOnclick = (id, index ,e) => {
        setKeyIndex(index)
    }

    return (
        <table className="table">
            <thead>
                <tr>
                    <th>Mã</th>
                    <th>tên</th>
                    <th>cấp</th>
                    <th></th>
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
                        </tr>
                        <tr>
                            {index === keyIndex ? 
                                <td colSpan="4"><InfoLog data={province[index]}></InfoLog></td>
                            : null}
                        </tr>
                    </tbody>            
                )
            })}
        </table>
    )
}

export default ProvinceTable
