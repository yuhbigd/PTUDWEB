import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'


const RenderDir = (props) => {
    const {dir} = props
    const [dirName, setDirName] = useState([])
    console.log(dir)
    const handleDirOnclick = (level, id) => {
        const temp = dir
        props.setDir([])
        temp.map((item, index) => {
            if(index <= level) {
                props.setDir(state => [...state, item])
                props.setLastLevel(level)
                console.log(dir)
            }
        })
    }
    return (
        <>
            {dir.map((item, index) => {
                if(item !== null) {
                    return(
                        <div key={index} onClick={() => handleDirOnclick(index, item.id)}> 
                            <span>{item.name}</span>
                            <span>/</span>
                        </div>
                    )
                }
            })}
        </>
    );
}

export default RenderDir
