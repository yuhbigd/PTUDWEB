import React, { useState, useEffect } from 'react';
import ProvinceTable from './ProvinceTable';
import RenderDir from './RenderDir';
import './table.css'
import { useSelector } from 'react-redux';

const Table = () => {
    const user = useSelector (state => state.userRe)
    const [dir, setDir] = useState([])

    useEffect(() => {
        setDir(state => [{id: 'root', name: 'root'}])
    }, [user])
   
    return (
        <div id='app'>
            <div className='explorer-container'> 
                <div className="like-file-surf">
                    <RenderDir dir={dir} setDir = {setDir}></RenderDir>
                </div>
                <div className='line-break'></div>
            </div>
            <ProvinceTable setDir={setDir} dir ={dir}></ProvinceTable>
        </div>
    )
}

export default Table
