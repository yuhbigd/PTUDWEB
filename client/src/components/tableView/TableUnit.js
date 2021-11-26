import React, { useState, useEffect } from 'react'

const TableUnit = (props) => {
    const [unit, setUnit] = useState([])
    useEffect(() => {
        if(props.data.length) {
            setUnit(props.data)
            console.log(unit)
        }
    }, [props.data])

    return (
        <table className="table table-hover">
            <thead>
                <tr>
                    <th>Ma</th>
                    <th>Ten</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {
                    unit.map((item, index) => {
                        return(
                            <tr key={index}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td></td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
        
    )
}

export default TableUnit
