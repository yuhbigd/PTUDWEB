import React from 'react'
import { useSelector } from 'react-redux'
const DistrictTable = (props) => {
    const district = useSelector(state => state.districtRe)
    const districtOnclick = (id, index) => {
        props.setDir(state => [...state, district[index]])
        props.setLastLevel(2)
    }   
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
