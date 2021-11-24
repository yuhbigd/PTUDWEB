import React from 'react'

const RenderDir = (props) => {
    const {dir} = props
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
