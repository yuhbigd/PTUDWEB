import React from 'react'
const cityzen = [
    {
        "id": 1,
        "name": "nguyen van a",
        "dob": "16/8/1002",
        "gender": "male",
        "note": "dep zai" 
    },
    {
        "id": 1,
        "name": "nguyen van a",
        "dob": "16/8/1002",
        "gender": "male",
        "note": "dep zai" 
    },
    {
        "id": 1,
        "name": "nguyen van a",
        "dob": "16/8/1002",
        "gender": "male",
        "note": "dep zai" 
    },
    {
        "id": 1,
        "name": "nguyen van a",
        "dob": "16/8/1002",
        "gender": "male",
        "note": "dep zai" 
    },      
]
const CitizenTable = () => {
    
    return (
        <table className="table">
            <thead>
                <tr>
                    <th>Mã</th>
                    <th>tên</th>
                    <th>ngày sinh</th>
                    <th>giới tính</th>
                    <th>Ghi chú</th>
                </tr>
            </thead>
            <tbody>
                {cityzen.map((item, index) => {
                    return(
                        <tr  key={index}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.gender}</td>
                            <td>{item.dob}</td>
                            <td>{item.note}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export default CitizenTable
