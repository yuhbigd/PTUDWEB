import React, {useState, useEffect, useCallback} from 'react'
import InfoLog from '../infoLog/InfoLog'
import { useAsyncFn} from 'react-use'
import {useMountedState} from 'react-use'
import MultiOption from '../options/MultiOption'
import Loading from '../loading/Loading'
import ExportToExcel from '../exportToExcel/ExportToExcel'

const ProvinceTable = (props) => {
    const [province, setProvince] = useState([])
    const [keyIndex, setKeyIndex] = useState(null)
    const isMounted = useMountedState()
    const [multiOption, setMultiOption] = useState(false)
    const [selectedUnit, setSelectedUnit] = useState([])
    const [serverErr, setServerErr] = useState(null)
    const [searchSort, setSearchSort] = useState({
        search: '',
        sort: 1,
        keySort: 'id'
    })
    const [showTableData, setShowTableData] = useState(province)

    const provinceOnclick = (id, index, e) => {
        if(province[index].id !== props.dir[props.dir.length-1].id && province[index].count) {
                props.setDir(state => [...state, province[index]])
                props.setLastLevel(props.dir.length)
        }
    }

    
    const [request, setRequest] = useAsyncFn(async(id) => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/country/${id === 'root' ? '' : id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        const result = await res.text()
        return result
    })

    useEffect(() => {
        const lastDir = props.dir[props.dir.length - 1]
        if(isMounted() && lastDir) {
            setRequest(lastDir.id)
        }
    }, [props.dir])

    useEffect(() =>{
        if(request.value) {
            if(!JSON.parse(request.value).error) {
                setProvince([...JSON.parse(request.value).data])   
            }else {
                setServerErr(JSON.parse(request.value).error)
            }
        }
    }, [request])

    const buttonOnclick = (id, index ,e) => {
        setKeyIndex(index)
    }

    const handleMultiOption = (e, item) => {
        if(e.target.checked) {
            setSelectedUnit(state => [...state, item])
        }else {
            setSelectedUnit(selectedUnit.filter((unchecked) => item.id !== unchecked.id))
        }
    }

    const multiOptionToggle = () => {
        setMultiOption(!multiOption)
        if(multiOption) {
            setSelectedUnit([])
        }
    }   
    
    useEffect(() => {
        setShowTableData([...province])
    }, [province])

    useEffect(() => {
        setShowTableData([... province.filter((item) => {
            return item.name.toLowerCase().includes(searchSort.search)
        })])
    },[searchSort])

    const handleSearchOnchange = useCallback(
        ({target:{name,value}}) => setSearchSort(state => ({ ...state, [name]:value }), [])
    );
    
    return (
        <div id='unit-table-container'>
            {!(request.value && !request.loading) ? <Loading></Loading>:
                <div className='unit-table'>
                    <div className='search-table-container'>
                        <div>
                            <i className='bx bx-search-alt'></i>
                            <div className='break-icon-input'></div>
                            <input type='text' placeholder='search' name='search' key='search' value={searchSort.search} onChange={handleSearchOnchange}></input>
                        </div>           
                    </div>
                    <div className='option-container'>
                        <div>
                            <ExportToExcel csvData={province} fileName={'this'}/>
                            <div onClick={() => {multiOptionToggle()}} className='select-multiple-button'>
                                {multiOption ? <i className='bx bxs-select-multiple'></i> : <i className='bx bx-select-multiple' ></i> } 
                            </div>
                            <MultiOption multiOption={multiOption} selectedUnit={multiOption ? selectedUnit : province}></MultiOption>
                        </div>
                    </div>
                    <div className='table-container'>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Mã</th>
                                    <th>Tên</th>
                                    <th>Cấp dưới</th>
                                    <th></th>
                                    <th>
                                        {multiOption ? 'multi': null}
                                    </th>
                                </tr>
                            </thead>
                            {showTableData.map((item, index) => {
                                return(
                                    <tbody key={index} className={keyIndex === index ? 'row-selected' : ''}>
                                        <tr className='row-item'>
                                            <td>{item.id}</td>
                                            <td onClick={(e) => provinceOnclick(item.id, index, e)}>{item.name}</td>
                                            <td>{item.count}</td>
                                            <td>
                                                <button className='more-button' onClick={(e) => buttonOnclick(item.id, index, e)}>
                                                    <i className='bx bx-dots-horizontal-rounded'></i>    
                                                </button>
                                            </td>
                                            <td>
                                                {multiOption ? <input type='checkbox' value={item} onChange={(e) => {handleMultiOption(e, item)}}></input>: null}
                                            </td>
                                        </tr>
                                        <tr>
                                            {index === keyIndex ? 
                                                <td colSpan="6"><InfoLog data={province[index]} setKeyIndex={setKeyIndex}></InfoLog></td>
                                            : null}
                                        </tr>
                                    </tbody>            
                                )
                            })}
                        </table>
                    </div>
                </div>
            }
        </div>  
    )
}

export default ProvinceTable
