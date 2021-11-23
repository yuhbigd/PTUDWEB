import React, { useState, useEffect } from 'react';
import ProvinceTable from './ProvinceTable';
import DistrictTable from './DistrictTable';
import TownTable from './TownTable'
import RenderDir from './RenderDir';
import './table.css'
import { useDispatch } from 'react-redux';
import * as actions from './../../actions/index'

const province = [
    {
        "id": 1,
        "name": "Ha Noi",
        "level": "tinh"
    },
    {
        "id": 2,
        "name": "TPHCM",
        "level": "tinh"
    },
    {
        "id": 3,
        "name": "Da Nang",
        "level": "tinh"
    }
]

const district = [
    {
        "id": 101,
        "name": "Ba Dinh",
        "level": "Huyen",
        "of": {
            "province": 1,
        }
    },
    {
        "id": 102,
        "name": "Cau Giay",
        "level": "Huyen",
        "of": {
            "province": 2,
        }
    },
    {
        "id": 103,
        "name": "Quan 8",
        "level": "Huyen",
        "of": {
            "province": 3,
        }
    },   
]

const town = [
    {
        "id": 1001,
        "name": "Xuan Thuy",
        "level": "Phuong",
        "of": {
            "province": 0,
            "district": 102
        }
    },  
]

const Table = () => {
    const [lastLevel, setLastLevel] = useState(0);
    const [dir, setDir] = useState([{id: 0, name: 'Viet Nam'}])
    const dispatch = useDispatch()
    useEffect(() => {
        const action = actions.set_province(province)
        dispatch(action)
        const action2 = actions.set_district(district)
        dispatch(action2)
        const action3 = actions.set_town(town)
        dispatch (action3)
    }, )


    return (
        <div>
            <div className="like-file-surf">
                <RenderDir dir={dir} setDir = {setDir} setLastLevel={setLastLevel}></RenderDir>
            </div>
            <div className="table-container"> 
                {lastLevel === 0 ?
                        <ProvinceTable setDir={setDir} dir ={dir} setLastLevel={setLastLevel}></ProvinceTable>: lastLevel === 1 ?
                        <DistrictTable setDir={setDir} dir ={dir}  setLastLevel={setLastLevel}></DistrictTable>: lastLevel === 2 ?
                        <TownTable setDir={setDir} dir={dir} setLastLevel={setLastLevel}></TownTable>: null       
                }
            </div>

        </div>
    )
}

export default Table
