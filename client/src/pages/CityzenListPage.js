import React from 'react'
import { useNavigate } from 'react-router'
import TableView from '../components/tableView/TableView'

const CityzenListPage = () => {
    const navigate = useNavigate()
    const goBackRoute = () => {
        navigate(-1)
    }

    return (
        <div>
            this
            <button onClick={() => goBackRoute()}>go back</button>
            <TableView></TableView>
        </div>
    )
}
export default CityzenListPage
