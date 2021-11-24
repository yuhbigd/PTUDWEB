import React, { useState } from 'react';
import ProvinceTable from './ProvinceTable';
import DistrictTable from './DistrictTable';
import TownTable from './TownTable'
import RenderDir from './RenderDir';
import './table.css'


const Table = () => {
    const [lastLevel, setLastLevel] = useState(0);
    const [dir, setDir] = useState([{id: 0, name: 'Viet Nam'}])

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
