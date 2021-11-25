import React, {useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useAsyncFn } from 'react-use'
import * as actions from './../../actions/index'
const DistrictTable = (props) => {
    const district = useSelector(state => state.districtRe)
    const districtOnclick = (id, index) => {
        props.setDir(state => [...state, district[index]])
        props.setLastLevel(2)
    }

    const dispatch = useDispatch()

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
        setRequest(props.dir[props.dir.length - 1].id)
    }, [])

    useEffect(() =>{
        if(request.value) {
            const action = actions.set_district([...JSON.parse(request.value).data])
            dispatch(action)
        }
    }, [request])
    

    return (
        <table className="table">
            <thead>
                <tr>
                    <th>Mã</th>
                    <th>tên</th>
                    <th>cấp</th>
                </tr>
            </thead>
            <tbody>
                {district.map((item, index) => {
                    return(
                        <tr onClick={() => districtOnclick(item.id, index)} key={index}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.level}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export default DistrictTable
