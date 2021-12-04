import React, { useEffect, useState, useCallback} from 'react'
import './cityzenTable.css'
import { useAsyncFn, useMountedState, useTimeoutFn} from 'react-use'
import moment from 'moment'
import SelectOp from './SelectOp'
import Loading from '../loading/Loading'
import UpdateCityzen from '../updateCityzen/UpdateCityzen'

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

    const [request, setRequest] = useAsyncFn(async(search, order, direction) => {
        const res = await fetch(`http://localhost:3001/residents?detail=1&searchString=${search}&order=${order}&direction=${direction}`, {
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

    const callGetRequest = () => {
        setRequest(searchSort.search, selectedValue.key, directOrder.key)
    }    
    const [isReady, cancel, reset] = useTimeoutFn(callGetRequest, 500); 

    useEffect(() => {
        if(request.value) {
            setPeople(JSON.parse(request.value).data)
        }
    }, [request.value])

    const handleSearchOnchange = useCallback(
        ({target:{name,value}}) => setSearchSort(state => ({ ...state, [name]:value }), [])
    );

    useEffect(() => {
        if(isReady() === false) {
            cancel();
        }else {
            reset();
        }
    }, [directOrder, selectedValue, ''])

    useEffect(() => {
        if(isReady() === false) {
            cancel();
        }else {
            reset();
        }
    }, [searchSort])

    const handleSetMore = (_id) => {
        setMore(_id)
        setUpdate(null)
        setDeleteCityzen(null)
    }

    const handleSetUpdate = (_id) => {
        setMore(null)
        setUpdate(_id)
        setDeleteCityzen(null)
    }

    const handleSetDeleteCityzen = (_id) => {
        setMore(null)
        setUpdate(null)
        setDeleteCityzen(_id)
    }

    return (
        <div id='cityzen-table'>
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
            {
                !(request.value && !request.loading) ? <Loading></Loading>:
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Họ Tên</th>
                                <th>Giới tính</th>
                                <th>Ngày sinh</th>
                                <th>CCCD</th>
                                <th></th>
                            </tr>
                        </thead>
                        {
                            people ? 
                            people.map((item, index) => {
                                return (
                                    <tbody key={index}>
                                        <tr>
                                            <td>{item.hoTen}</td>
                                            <td>{item.gioiTinh}</td>
                                            <td>{moment(item.ngaySinh).utcOffset("+0700").format("DD-MM-YYYY") }</td>
                                            <td>{item.soCCCD}</td>
                                            <td>
                                                <button onClick={() => handleSetMore(item._id)}>
                                                    more
                                                </button>
                                                <button onClick={() => handleSetUpdate(item._id)}>
                                                    update
                                                </button>
                                                <button onClick={() => handleSetDeleteCityzen(item._id)}>
                                                    delete
                                                </button>
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
                                                                        <span>Địa chỉ</span>
                                                                        <span>{item.diaChi}</span>
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
                                                    <td colSpan='5'>
                                                        <UpdateCityzen setServerErr={setServerErr} cityzenItem={item}></UpdateCityzen>
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
            }            
        </div>
    )
}

export default CitizenTable
