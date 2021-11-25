import React from 'react'
import { useSelector } from 'react-redux'

const TableView = (props) => {
    const mutiSelected = useSelector(state => state.multiRe)
    return (
        <table>
            <thead>
                <tr>
                    <th>Mã</th>
                    <th>tên</th>
                </tr>
            </thead>
            <tbody >
                {mutiSelected.map((item, index) => {
                    return(
                    <tr key={index}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                    </tr>
                        )
                    })}
            </tbody>
        </table>
    )
}

export default TableView
