import React, { useEffect, useState, useCallback, useRef} from 'react'
import { useAsyncFn, useMountedState, useTimeoutFn} from 'react-use'
import moment from 'moment'
import SelectOp from './../cityzenTable/SelectOp'
import Loading from '../loading/Loading'
import WarningModal from '../warningModal/WarningModal'
import Pageination from './../pagination/Pagination'
import DownloadModal from '../continueModal/DownloadModal'
import { useSelector } from 'react-redux'

const ViewCityzen = () => {
    const [serverErr, setServerErr] = useState(null)
    const [people, setPeople] = useState([])
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
    const units = useSelector(state => state.multiRe)
    const [unitId, setUnitId] = useState([])
    const [totalCityzen, setTotalCityzen] = useState()
    const [downLoadCityzen, setDownLoadCityzen] = useState([])

    const [succcesMessage, setSuccessMessage] = useState(null)
    const successRef_ = useRef(null)
    const [isMulti, setIsMulti] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [numPerPage, setNumPerPage] = useState(5)
    const [totalPage, setTotalPage] = useState(null)

    const [request, setRequest] = useAsyncFn(async(search, order, direction, numPerPage, currentPage, ids) => {
        const res1 = await fetch(`${process.env.REACT_APP_BASE_URL}/residents/country/children?detail=1&searchString=${search}&isCount=1`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "data":{
                    "children":[...ids]
                }            
            }),
            credentials: 'include'
        })
        const result1 = await res1.text()
        setTotalPage(parseInt(JSON.parse(result1).count / numPerPage) + 1)
        setTotalCityzen(JSON.parse(result1).count)
        
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/residents/country/children?detail=1&searchString=${search}&order=${order}&direction=${direction}&pageNum=${currentPage}&numPerPage=${numPerPage}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                "data":{
                    "children":[...ids]
                }            
            }),
        })
        const result = await res.text()
        if(JSON.parse(result).error) {
            setServerErr(JSON.parse(result).error)
            return
        }
        return result
    })

    const [request1, setRequest1] = useAsyncFn(async(search, order, direction, numPerPage, ids) => {
        
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/residents/country/children?detail=1&searchString=${search}&order=${order}&direction=${direction}&pageNum=${1}&numPerPage=${numPerPage}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                "data":{
                    "children":[...ids]
                }            
            }),
        })
        const result = await res.text()
        if(JSON.parse(result).error) {
            setServerErr(JSON.parse(result).error)
            return
        }else {
            setDownLoadCityzen(JSON.parse(result).data)
        }
        return result
    })

    const callGetRequest = () => {
        if(unitId) {
            setRequest(searchSort.search, selectedValue.key, directOrder.key, numPerPage, currentPage, unitId)
        }
    }    
    const [isReady, cancel, reset] = useTimeoutFn(callGetRequest, 500); 

    useEffect(() => {
        if(request.value && isMounted()) {
            setPeople(JSON.parse(request.value).data)
        }
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
    }, [directOrder, selectedValue, currentPage, numPerPage, unitId])

    useEffect(() => {
        if(isMounted()) {
            if(isReady() === false) {
                cancel();
            }else {
                reset();
            }
        }
    }, [searchSort, unitId])

    const handleSetMore = (_id) => {
        setMore(_id)
    }

    useEffect(() => {
        if(units) {
            var ids = []
            units.map((item, index) => {
                ids.push(item.id)
            })
            setUnitId(ids)
        }
    }, [units])

    const handleDownloadExcel = () => {
        setRequest1(searchSort.search, selectedValue.key, directOrder.key, totalCityzen, unitId)
    }

    return (
        <div id='cityzen-table'>
            <WarningModal serverErr={serverErr} setServerErr={setServerErr}></WarningModal>
            {
                downLoadCityzen ? <DownloadModal downLoadCityzen={downLoadCityzen} setDownLoadCityzen={setDownLoadCityzen}></DownloadModal> : null
            }

            <div className= {request1.loading ? 'loading-wrapper active' : 'loading-wrapper'}>
                {
                    request1.loading? <Loading></Loading> : null
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
            <div className='download-button'>
                <button onClick={() => handleDownloadExcel()}>
                    <i className='bx bx-down-arrow-alt'></i>
                    <span>Excel</span>
                </button>
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
                                        <tbody key={index} className={(item._id === more) ? 'selected-item' : ''}>
                                            <tr className='row-item'>
                                                <td className='text-overflow'>{item.hoTen}</td>
                                                <td className='text-overflow'>{item.gioiTinh}</td>
                                                <td className='text-overflow'>{moment(item.ngaySinh).utcOffset("+0700").format("DD-MM-YYYY") }</td>
                                                <td className='text-overflow'>{item.soCCCD}</td>
                                                <td>
                                                <div className='table-button-container'>
                                                        <button className='more-button' onClick={() => handleSetMore(item._id)}>
                                                            <i className='bx bx-dots-horizontal-rounded' ></i>
                                                        </button> 
                                                    </div>
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

export default ViewCityzen
