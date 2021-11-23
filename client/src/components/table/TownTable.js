import React from 'react'
import { useSelector } from 'react-redux'
const TownTable = (props) => {
    const province = useSelector(state => state.townRe)    
    const provinceOnclick = (id) => {
        console.log(id)
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
                {province.map((item, index) => {
                    return(
                        <tr onClick={() => provinceOnclick(item.id)} key={index}>
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

export default TownTable
