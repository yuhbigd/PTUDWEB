import React, { useEffect, useState, useCallback, useRef} from 'react'
import './cityzenTable.css'
import { useAsyncFn, useMountedState, useTimeoutFn} from 'react-use'
import moment from 'moment'
import SelectOp from './SelectOp'
import Loading from '../loading/Loading'
import UpdateCityzen from '../updateCityzen/UpdateCityzen'
import WarningModal from '../warningModal/WarningModal'
import ContinueModal from '../continueModal/ContinueModal'
import Pageination from './../pagination/Pagination'

const CitizenTable = () => {
    const [serverErr, setServerErr] = useState(null)
    const [people, setPeople] = useState([])
    // by id, name, dob, gender, dan toc, ton giao, nhom mau, quoc tich, ket hon 
    const [searchSort, setSearchSort] = useState({
        search: '',
    })
    const isMounted = useMountedState()
    const [selectedValue, setSelectedValue] = useState({
        key: 'id',
        value: 'id'
    })
    const [directOrder, setDirectOrder] = useState({
        key: 'asc',
        value: 'Tăng dần'
    })
    const [more, setMore] = useState(null)
    const [update, setUpdate] = useState(null)
    const [deleteCityzen, setDeleteCityzen] = useState(null)
    const [messagePac, setMessagePac] = useState({
        message: null,
        dataId: null,
        action: false,
    })
    const [succcesMessage, setSuccessMessage] = useState(null)
    const successRef_ = useRef(null)
    const [selectedItem, setSelectedItem] = useState([])
    const [isMulti, setIsMulti] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [numPerPage, setNumPerPage] = useState(5)
    const [totalPage, setTotalPage] = useState(null)

    const [request, setRequest] = useAsyncFn(async(search, order, direction, numPerPage, currentPage) => {
        const res1 = await fetch(`${process.env.REACT_APP_BASE_URL}/residents?detail=1&searchString=${search}&isCount=1`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        const result1 = await res1.text()
        setTotalPage(parseInt(JSON.parse(result1).count / numPerPage) + 1)

        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/residents?detail=1&searchString=${search}&order=${order}&direction=${direction}&pageNum=${currentPage}&numPerPage=${numPerPage}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        const result = await res.text()
        if(JSON.parse(result).error) {
            setServerErr(JSON.parse(result).error)
            return
        }
        return result
    })

    const [request1, setRequest1] = useAsyncFn(async(_id) => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/residents/${_id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        const result = await res.text()
        if(JSON.parse(result).error) {
            setServerErr(JSON.parse(result).error)
            return
        }
        if(JSON.parse(result).message==='done') {
            setSuccessMessage('Xóa thành công 1 công dân')
            successRef_.current.classList.add('active')
            setTimeout(() => {
                if(successRef_.current) {
                    successRef_.current.classList.remove('active') 
                }
            }, 4000)
        }
        return result
    })

    const [request2, setRequest2] = useAsyncFn(async(ids) => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/residents`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                "data":{
                    "residents": [...ids]
                }
            })
        })
        const result = await res.text()
        if(JSON.parse(result).error) {
            setServerErr(JSON.parse(result).error)
            return
        }
        if(JSON.parse(result).message==='done') {
            setSuccessMessage(`Xóa thành công ${ids.length} công dân`)
            successRef_.current.classList.add('active')
            setTimeout(() => {
                if(successRef_.current) {
                    successRef_.current.classList.remove('active') 
                }
            }, 4000)
            setSelectedItem([])
            callGetRequest()
            setIsMulti(false)
        }
        return result
    })

    const callGetRequest = () => {
        setRequest(searchSort.search, selectedValue.key, directOrder.key, numPerPage, currentPage)
    }    
    const [isReady, cancel, reset] = useTimeoutFn(callGetRequest, 500); 

    useEffect(() => {
        if(request.value && isMounted()) {
            setPeople(JSON.parse(request.value).data)
        }
        handleCloseUpdate()
    }, [request.value])

    const handleSearchOnchange = useCallback(
        ({target:{name,value}}) => setSearchSort(state => ({ ...state, [name]:value }), [])
    );

    useEffect(() => {
        if(isMounted()) {
            if(isReady() === false) {
                cancel();
            }else {
                reset();
            }
        }
    }, [directOrder, selectedValue, currentPage, numPerPage])

    useEffect(() => {
        if(isMounted()) {
            if(isReady() === false) {
                cancel();
            }else {
                reset();
            }
        }
    }, [searchSort])

    const handleSetMore = (_id) => {
        setMore(_id)
        setUpdate(null)
        setDeleteCityzen(null)
        handleCloseUpdate()
    }

    const handleSetUpdate = (_id) =>{
        setMessagePac({
            message: 'Có chắc muốn cập nhật thông tin của công dân này chứ?',
            dataId: _id,
            action: false,
            method: 'update'
        })
    }

    const handleSetDeleteCityzen = (_id) => {
        setMessagePac({
            message: 'Có chắc muốn xóa thông tin của công dân này chứ?',
            dataId: _id,
            action: false,
            method: 'delete'
        })
    }

    const handleMultiDelete = () => {
        if(isMulti && selectedItem.length) {
            setMessagePac({
                message: 'Có chắc muốn xóa thông tin của các công dân này chứ?',
                dataId: selectedItem,
                action: false,
                method: 'multi-delete'
            })
        }
    }

    useEffect(() =>{
        if(isMounted()) {
            if(messagePac.action && messagePac.method === 'update' && messagePac.dataId) {
                setMore(null)
                setUpdate(messagePac.dataId)
                setDeleteCityzen(null)
            }else if(messagePac.action && messagePac.method === 'delete' && messagePac.dataId) {
                setMore(null)
                setUpdate(null)
                setDeleteCityzen(messagePac.dataId)
            }else if(messagePac.action && messagePac.method === 'multi-delete' && messagePac.dataId) {
                // console.log(selectedItem)
                setRequest2([...selectedItem])
            }
        }
        handleCloseUpdate()
    }, [messagePac.action])

    const handleCloseUpdate = () => {
        setMessagePac({
            message: null,
            dataId: null,
            action: false
        })
    }

    useEffect(() => {
        if(deleteCityzen && isMounted()) {
            setRequest1(deleteCityzen)
        }
    }, [deleteCityzen])

    useEffect(() => {
        if(request1.value && deleteCityzen && isMounted()) {
            const temp = [...people.filter((item) => { return item._id !== deleteCityzen})]
            setPeople(temp)
            setDeleteCityzen(null)
        }
    }, [request1])

    const handleMultiOption = (e, item) => {
        if(e.target.checked) {
            setSelectedItem(state => [...state, item._id])
        }else {
            setSelectedItem(selectedItem.filter((unchecked) => item._id !== unchecked))
        }
    }

    const handleuMultiToggle = () => {
        if(isMulti) {
            setSelectedItem([])
        }   
        setIsMulti(!isMulti)
    }

    return (
        <div id='cityzen-table'>
            <WarningModal serverErr={serverErr} setServerErr={setServerErr}></WarningModal>
            <ContinueModal messagePac={messagePac} setMessagePac={setMessagePac}></ContinueModal>
            <div className= {request1.loading || request2.loading ? 'loading-wrapper active' : 'loading-wrapper'}>
                {
                    request1.loading || request2.loading ? <Loading></Loading> : null
                }
            </div>
            <div className='popup-success' ref={successRef_}>
                {succcesMessage ? succcesMessage : 'this is before the picture'} 
            </div>
            <div className='search-table-container'>
                <div>   
                    <i className='bx bx-search-alt'></i>
                    <div className='break-icon-input'></div>
                    <input type='text' placeholder='search' name='search' key='search' value={searchSort.search} onChange={handleSearchOnchange}></input>
                </div>           
            </div>
            <SelectOp 
                selectedValue={selectedValue} 
                setSelectedValue={setSelectedValue}
                directOrder={directOrder}
                setDirectOrder={setDirectOrder}    
            ></SelectOp>
            <div className='multi-option-wrapper'>
                <div>
                    <div className='option-item' onClick={() => {handleuMultiToggle()}}>
                        <span>
                            <i className='bx bx-select-multiple'></i>
                        </span>
                    </div>
                    <div className={(isMulti && selectedItem.length) ? 'option-item' : 'option-item blur'} onClick={() => handleMultiDelete()}>
                        <span>
                            <i className='bx bxs-trash'></i>
                        </span>
                    </div>
                    <div className='selected-number'>
                        <span>
                            {`(${isMulti ? selectedItem.length : ''})`}
                        </span>
                    </div>
                </div>
            </div>
            {
                !(request.value && !request.loading) ? <Loading></Loading>:
                    <div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Họ Tên</th>
                                    <th>Giới tính</th>
                                    <th>Ngày sinh</th>
                                    <th>CCCD</th>
                                    <th>{isMulti ? 'multi' : null}</th>
                                </tr>
                            </thead>
                            {
                                people ? 
                                people.map((item, index) => {
                                    return (
                                        <tbody key={index} className={(item._id === more || item._id === update) ? 'selected-item' : ''}>
                                            <tr className='row-item'>
                                                <td className='text-overflow'>{item.hoTen}</td>
                                                <td className='text-overflow'>{item.gioiTinh}</td>
                                                <td className='text-overflow'>{moment(item.ngaySinh).utcOffset("+0700").format("DD-MM-YYYY") }</td>
                                                <td className='text-overflow'>{item.soCCCD}</td>
                                                <td>
                                                    {isMulti ? <input type='checkbox' value={item} onChange={(e) => {handleMultiOption(e, item)}}></input>: 
                                                        <div className='table-button-container'>
                                                            <button className='more-button' onClick={() => handleSetMore(item._id)}>
                                                                <i className='bx bx-dots-horizontal-rounded' ></i>
                                                            </button>
                                                            <button className='update-button' onClick={() => handleSetUpdate(item._id)}>
                                                                <i className='bx bx-edit-alt'></i>
                                                            </button>
                                                            <button className='delete-button' onClick={() => handleSetDeleteCityzen(item._id)}>
                                                                <i className='bx bx-trash'></i>
                                                            </button>
                                                        </div>
                                                    }
                                                </td>
                                            </tr>
                                            {
                                                more === item._id ? 
                                                    <tr >
                                                        <td colSpan='5' id='more-info-section'>
                                                            <div className='close-more-button'>
                                                                <button onClick={(e) => {setMore(null)}}>
                                                                    <i className='bx bxs-x-circle'></i>
                                                                </button>
                                                            </div>
                                                            <div className='more-info-container'>
                                                                <div className='card-container'>
                                                                    <span className='card-title'>
                                                                        Thông tin cá nhân
                                                                    </span>
                                                                    <div className='column-container'>
                                                                        <div className='item-container'>
                                                                            <span>Họ Tên</span>
                                                                            <span>{item.hoTen}</span>
                                                                        </div>
                                                                        <div className='item-container'>
                                                                            <span>Giới tính</span>
                                                                            <span>{item.gioiTinh}</span>
                                                                        </div>
                                                                        <div className='item-container'>
                                                                            <span>Ngày sinh</span>
                                                                            <span>{ moment(item.ngaySinh).utcOffset("+0700").format("DD-MM-YYYY")}</span>
                                                                        </div>
                                                                        <div className='item-container'>
                                                                            <span>Nhóm máu</span>
                                                                            <span>{item.nhomMau}</span>
                                                                        </div>
                                                                        <div className='item-container'>
                                                                            <span> TT Hôn nhân</span>
                                                                            <span>{item.honNhan}</span>
                                                                        </div>
                                                                        <div className='item-container'>
                                                                            <span>Dân tộc</span>
                                                                            <span>{item.danToc}</span>
                                                                        </div>
                                                                        <div className='item-container'>
                                                                            <span>Quốc tịch</span>
                                                                            <span>{item.quocTich}</span>
                                                                        </div>
                                                                        <div className='item-container'>
                                                                            <span>Tôn giáo</span>
                                                                            <span>{item.tonGiao}</span>
                                                                        </div>
                                                                        <div className='item-container'>
                                                                            <span>Địa chỉ thường trú</span>
                                                                            <span>{item.noiThuongTru}</span>
                                                                        </div>
                                                                        <div className='item-container'>
                                                                            <span>Nơi ở hiện tại</span>
                                                                            <span>{item.noiThuongTru}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='card-container'>
                                                                    <span className='card-title'>
                                                                        Thông tin cha mẹ
                                                                    </span>
                                                                    <div className='column-container'>
                                                                        <div className='item-container'>
                                                                            <span>Họ tên cha</span>
                                                                            <span>{item.tenCha}</span>
                                                                        </div>
                                                                        <div className='item-container'>
                                                                            <span>CCCD cha</span>
                                                                            <span>{item.soCCCDCha}</span>
                                                                        </div>
                                                                        <div className='item-container'>
                                                                            <span>Quốc tịch cha</span>
                                                                            <span>{item.quocTichCha}</span>
                                                                        </div>
                                                                        <div className='item-container'>
                                                                            <span>Họ tên mẹ</span>
                                                                            <span>{item.tenMe}</span>
                                                                        </div>
                                                                        <div className='item-container'>
                                                                            <span>CCCD mẹ</span>
                                                                            <span>{item.soCCCDMe}</span>
                                                                        </div>
                                                                        <div className='item-container'>
                                                                            <span>Quốc tịch mẹ</span>
                                                                            <span>{item.quocTichMe}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='card-container'>
                                                                    <span className='card-title'>
                                                                        Thông tin hộ khẩu
                                                                    </span>
                                                                    <div className='column-container'>
                                                                        <div className='item-container'>
                                                                            <span>Tên chủ hộ</span>
                                                                            <span>{item.tenChuHo}</span>
                                                                        </div>
                                                                        <div className='item-container'>
                                                                            <span>Số hộ khẩu</span>
                                                                            <span>{item.soHoKhau}</span>
                                                                        </div>
                                                                        <div className='item-container'>
                                                                            <span>CCCD chủ hộ</span>
                                                                            <span>{item.cccdDaiDienHopPhap}</span>
                                                                        </div>
                                                                        <div className='item-container'>
                                                                            <span>Quan hệ với chủ hộ</span>
                                                                            <span>{item.quanHeVoiChuHo}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                : null
                                            }
                                            {
                                                update === item._id ? 
                                                    <tr>
                                                        <td colSpan='5' className='update-wrapper'>
                                                            <div className='close-more-button'>
                                                                <button onClick={(e) => {setUpdate(null)}}>
                                                                    <i className='bx bxs-x-circle'></i>
                                                                </button>
                                                            </div>
                                                            <UpdateCityzen setUpdate={setUpdate} setPeople={setPeople} people={people} setServerErr={setServerErr} cityzenItem={item} setSuccessMessage={setSuccessMessage} successRef_={successRef_}></UpdateCityzen>
                                                        </td>
                                                    </tr>
                                                : null
                                            }
                                        </tbody>    
                                    )                               
                                })
                                :
                                null
                            }
                        </table>
                        <Pageination currentPage={currentPage} setCurrentPage={setCurrentPage} pages={totalPage} numPerPage={numPerPage} setNumPerPage={setNumPerPage}></Pageination>
                    </div>
            }            
        </div>
    )
}

export default CitizenTable
