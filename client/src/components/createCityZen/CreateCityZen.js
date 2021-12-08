import React, {useRef, useCallback, useState, useEffect} from 'react'
import './createCityZen.css'
import { useAsyncFn, useMountedState } from 'react-use'
import WarningModal from './../warningModal/WarningModal'
import Loading from '../loading/Loading'

const Create = (props) => {
    const [serverErr, setServerErr] = useState(null)
    const isMounted = useMountedState()
    const[cityzen, setCityZen] = useState({
        name: '', // city zen name
        dob: '',  // date of birth
        bloodg: '', // nhóm máu
        gender: '', //giới tính
        marry: '', // tình trạng kết hôn
        bornRegister: '', //nơi đăng ký khai sinh
        hometown: '', // quê quán 
        ethnic: '', //dân tộc
        nationality: '', //quốc tịch việt nam, nếu khác ghi bên cạnh
        othderNationality: '',
        iden: '',
        resident: '', //nơi thường chú
        curentRes: '', // nơi ở hiện tại
        dadName: '', // tên cha
        tonGiao:'',
        dadIden: '', // cccd
        dadNat: '', // quốc tịch cha
        momNat: '',
        momOtherNat: '',
        dadOtherNat: '',
        momName: '',
        momIden: '',
        ownerName: '',
        resNumber: '',
        ownerIden: '',
        withOwner: '',
    })
    const [succcesMessage, setSucccesMessage] = useState(null)
    const successRef = useRef(null)
    const reset = () => {
        setCityZen({
            name: '', // city zen name
            dob: '',  // date of birth
            bloodg: '', // nhóm máu
            gender: '', //giới tính
            marry: '', // tình trạng kết hôn
            bornRegister: '', //nơi đăng ký khai sinh
            hometown: '', // quê quán 
            ethnic: '', //dân tộc
            nationality: '', //quốc tịch việt nam, nếu khác ghi bên cạnh
            othderNationality: '',
            iden: '',
            resident: '', //nơi thường chú
            curentRes: '', // nơi ở hiện tại
            dadName: '', // tên cha
            tonGiao:'',
            dadIden: '', // cccd
            dadNat: '', // quốc tịch cha
            momNat: '',
            momOtherNat: '',
            dadOtherNat: '',
            momName: '',
            momIden: '',
            ownerName: '',
            resNumber: '',
            ownerIden: '',
            withOwner: '',
        })
    }

    const [request, setRequest] = useAsyncFn(async(item) => {
        const res = await fetch(`http://localhost:3001/residents`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                "data":{
                    "hoTen": item.name,
                    "ngaySinh": item.dob,
                    "gioiTinh": item.gender,
                    "nhomMau": item.bloodg, 
                    "honNhan": item.marry,
                    "noiDangKyKhaiSinh": item.bornRegister,
                    "queQuan": item.hometown,
                    "danToc": item.ethnic,
                    "quocTich": item.nationality === 'Khác' ? item.othderNationality : item.nationality,
                    "tonGiao": item.tonGiao,
                    "soCCCD": item.iden,
                    "noiThuongTru": item.resident,
                    "noiOHienTai": item.curentRes,
                    "tenCha": item.dadName,
                    "tenMe": item.momName,
                    "soCCCDMe": item.momIden,
                    "soCCCDCha": item.dadIden,
                    "quocTichCha": item.dadNat === 'Khác' ? item.dadOtherNat : item.dadNat,
                    "quocTichMe": item.momNat === 'Khác' ? item.momOtherNat : item.momNat,
                    "tenVoChong": "",
                    "cccdVoChong": "",
                    "quocTichVoChong": "", 
                    "daiDienHopPhap": "",
                    "quocTichDaiDienHopPhap": "",
                    "cccdDaiDienHopPhap": item.ownerIden,
                    "tenChuHo": item.ownerName,
                    "quanHeVoiChuHo": item.withOwner,
                    "soHoKhau": item.resNumber
                  }
            })
        })

        const result = await res.text()
        if(JSON.parse(result).error) {
            setServerErr(JSON.parse(result).error)
            return null
        }
        reset()
        return result
    })

    const textInputOnChange = useCallback(
        ({target:{name,value}}) => setCityZen(state => ({ ...state, [name]:value }), [])
    );

    const handleRadioSelect =  useCallback(
        ({target:{name,value}}) => setCityZen(state => ({ ...state, [name]:value }), [])
    );

    useEffect(() => {
        setCityZen(state => ({...state, othderNationality: ''}))
    }, [cityzen.nationality]) 

    const handleSubmitButton = () => {
        setRequest(cityzen)
    }    

    useEffect(() => {
        if(request.value) {
            setSucccesMessage(`Tạo thành công thông tin cho 1 công dân`)
            successRef.current.classList.add('active')
            setTimeout(() => {
                if(successRef.current) {
                    successRef.current.classList.remove('active')
                }
            }, 4000)
        }
    }, [request.value])

    return (
        <div id='create-cityzen'>
            <WarningModal serverErr={serverErr} setServerErr={setServerErr}></WarningModal>
            <div className='popup-success' ref={successRef}>
                {succcesMessage ? succcesMessage : 'this is before the picture'} 
            </div>
            <div className='private-information'>
                <div className='header-container'>
                    <span>Thông tin cá nhân</span>
                </div>
                <div className='private-information-input'>
                    <div className='column'>
                        <div className='input-container'>
                            <div className='input-title-container'>
                                <span>Họ và tên</span>
                                <span className='star'>*</span>
                            </div>
                            <input 
                                type='text' 
                                name='name'
                                key='name' 
                                value={cityzen.name}
                                onChange={(e) => {textInputOnChange(e)}}
                            ></input>
                        </div>
                        <div className='input-container'>
                            <div className='input-title-container'>
                                <span>Ngày sinh</span>
                                <span className='star'>*</span>
                            </div>
                            <input 
                                type='date' 
                                name='dob'
                                key='dob' 
                                value={cityzen.dob}
                                onChange={(e) => {textInputOnChange(e)}}    
                            ></input>
                        </div>
                        <div className='input-container'>
                            <span>Nhóm máu</span>
                            <div className='group-input' onChange={(e) => handleRadioSelect(e)}>
                                <div>
                                    <input onChange={(e) => handleRadioSelect(e)} type="radio" value={'O'} checked={'O' === cityzen.bloodg} name="bloodg"/> O
                                </div>
                                <div>
                                    <input onChange={(e) => handleRadioSelect(e)} type="radio" value={'A'} checked={'A' === cityzen.bloodg} name="bloodg"/> A
                                </div>
                                <div>
                                    <input onChange={(e) => handleRadioSelect(e)} type="radio" value={'B'} checked={'B' === cityzen.bloodg} name="bloodg"/> B
                                </div>
                                <div>
                                    <input onChange={(e) => handleRadioSelect(e)} type="radio" value={'AB'} checked={'AB' === cityzen.bloodg} name="bloodg"/> AB
                                </div>
                            </div>
                        </div>
                        <div className='input-container'>
                            <div className='input-title-container'>
                                <span>Giới tính</span>
                                <span className='star'>*</span>
                            </div>
                            <div className='group-input'>
                                <div>
                                    <input
                                        type="radio" 
                                        value={'nam'} 
                                        checked={'nam' === cityzen.gender} 
                                        name="gender"
                                        onChange={(e) => handleRadioSelect(e)}
                                        />Nam
                                </div>
                                <div>
                                    <input onChange={(e) => handleRadioSelect(e)} type="radio" value={'nữ'} checked={'nữ' === cityzen.gender} name="gender"/> Nữ
                                </div>
                            </div>
                        </div>
                        <div className='input-container'>
                            <span>Tình trạng hôn nhân</span>
                            <div className='group-input' >
                                <div>
                                    <input type="radio" onChange={(e) => handleRadioSelect(e)} value={'Đã kết hôn'} checked={'Đã kết hôn' === cityzen.marry} name="marry"/> Đã kết hôn
                                </div>
                                <div>
                                    <input type="radio" onChange={(e) => handleRadioSelect(e)} value={'Chưa kết hôn'}  checked={'Chưa kết hôn' === cityzen.marry} name="marry"/> Chưa kết hôn
                                </div>
                                <div>
                                    <input type="radio" onChange={(e) => handleRadioSelect(e)} value={'Ly hôn'}  checked={'Ly hôn' === cityzen.marry} name="marry"/> Ly hôn
                                </div>
                            </div>
                        </div>
                        <div className='input-container'>
                            <div className='input-title-container'>
                                <span>Nơi đăng ký khai sinh</span>
                                <span className='star'>*</span>
                            </div>
                            <input 
                                type='text' 
                                name={'bornRegister'}
                                key='bornRegister' 
                                value={cityzen.bornRegister}
                                onChange={(e) => {textInputOnChange(e)}}    
                            ></input>
                        </div>
                        <div className='input-container'>
                            <span>Quê quán</span>
                            <input 
                                type='text' 
                                name={'hometown'}
                                key='hometown' 
                                value={cityzen.hometown}
                                onChange={(e) => {textInputOnChange(e)}}  
                            ></input>
                        </div>
                    </div>
                    <div className='column'>  
                        <div className='input-container'>
                            <div className='input-title-container'>
                                <span>Dân tộc</span>
                                <span className='star'>*</span>
                            </div>
                            <input 
                                type='text' 
                                name={'ethnic'}
                                key='ethnic' 
                                value={cityzen.ethnic}
                                onChange={(e) => {textInputOnChange(e)}}      
                            ></input>
                        </div>
                        <div className='input-container'>
                            <div className='input-title-container'>
                                <span>Quốc tịch</span>
                                <span className='star'>*</span>
                            </div>
                            <div className='group-input'>
                                <div>
                                    <input 
                                        type="radio" 
                                        value={'Việt Nam'} 
                                        name="nationality"
                                        onChange={(e) => handleRadioSelect(e)}    
                                        checked={'Việt Nam' === cityzen.nationality}    
                                    /> Việt Nam
                                </div>
                                <div>
                                    <input 
                                        type="radio" 
                                        value={'Khác'} 
                                        name="nationality"
                                        onChange={(e) => handleRadioSelect(e)}
                                    /> Khác
                                    <div className='other-nat-container'>
                                        {
                                            cityzen.nationality === 'Khác' ?
                                                <input 
                                                    type='text'
                                                    name={'othderNationality'}
                                                    key='othderNationality' 
                                                    value={cityzen.othderNationality}
                                                    onChange={(e) => {textInputOnChange(e)}}      
                                                ></input>
                                            :
                                            null    
                                        }   
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='input-container'>
                            <div className='input-title-container'>
                                <span>CCCD</span>
                            </div>
                            <input 
                                type='number'
                                name={'iden'}
                                key='iden' 
                                value={cityzen.iden}
                                onChange={(e) => {textInputOnChange(e)}}  
                            ></input>
                        </div>
                        <div className='input-container'>
                            <div className='input-title-container'>
                                <span>Tôn giáo</span>
                                <span className='star'>*</span>
                            </div>
                            <input 
                                type='text'
                                key='tonGiao'
                                name='tonGiao' 
                                value={cityzen.tonGiao}
                                onChange={(e) => {textInputOnChange(e)}}  
                            ></input>
                        </div>
                        <div className='input-container'>
                            <div className='input-title-container'>
                                <span>Địa chỉ thường chú</span>
                                <span className='star'>*</span>
                            </div>
                            <input 
                                type='text' 
                                name={'resident'}
                                key='resident' 
                                value={cityzen.resident}
                                onChange={(e) => {textInputOnChange(e)}}  
                            ></input>
                        </div>
                        <div className='input-container'>
                            <span>Nơi ở hiện tại(Chỉ kê khai nếu khác nơi ở thường chú)</span>
                            <input 
                                type='text'
                                name='curentRes'
                                key='curentRes'
                                value={cityzen.curentRes}
                                onChange={(e) => {textInputOnChange(e)}}      
                            ></input>
                        </div>
                    </div>
                </div>
                
            </div>

            <div className='parent-information'>
                <div className='header-container'>
                    <span>Thông tin cha mẹ</span>
                </div>
                <div className='parent-information-input'>
                    <div className='column'>
                        <div className='input-container'>
                            <span>Họ và tên đệm cha</span>
                            <input 
                                type='text' 
                                name={'dadName'}
                                key='dadName' 
                                value={cityzen.dadName}
                                onChange={(e) => {textInputOnChange(e)}}  
                            ></input>
                        </div>
                        <div className='input-container'>
                            <span>CCCD</span>
                            <input 
                                type='number' 
                                name={'dadIden'}
                                key='dadIden' 
                                value={cityzen.dadIden}
                                onChange={(e) => {textInputOnChange(e)}}  
                            ></input>
                        </div>
                        <div className='input-container'>
                            <span>Quốc tịch</span>
                            <div className='group-input'>
                                <div>
                                    <input 
                                        type="radio" 
                                        name="dadNat"
                                        key='dadNat' 
                                        value='Việt Nam'
                                        onChange={(e) => {textInputOnChange(e)}}   
                                        checked={'Việt Nam' === cityzen.dadNat}   
                                    /> Việt Nam
                                </div>
                                <div>
                                    <input 
                                        type="radio" 
                                        name='dadNat'
                                        value='Khác'
                                        key='dadNat'
                                        onChange={(e) => {textInputOnChange(e)}} 
                                    /> Khác
                                    <div className='other-nat-container'>
                                        {
                                            cityzen.dadNat === 'Khác' ?
                                                <input 
                                                    type='text'
                                                    name={'dadOtherNat'}
                                                    key='dadOtherNat' 
                                                    value={cityzen.dadOtherNat}
                                                    onChange={(e) => {textInputOnChange(e)}}      
                                                ></input>
                                            :
                                            null    
                                        }   
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='column'>
                        <div className='input-container'>
                            <span>Họ và tên đệm mẹ</span>
                            <input 
                                type='text' 
                                name={'momName'}
                                key='momName' 
                                value={cityzen.momName}
                                onChange={(e) => {textInputOnChange(e)}} 
                            ></input>
                        </div>
                        <div className='input-container'>
                            <span>CCCD</span>
                            <input 
                                type='number' 
                                name={'momIden'}
                                key='momIden' 
                                value={cityzen.momIden}
                                onChange={(e) => {textInputOnChange(e)}} 
                            ></input>
                        </div>
                        <div className='input-container'>
                            <span>Quốc tịch</span>
                            <div className='group-input'>
                                <div>
                                    <input 
                                        type="radio" 
                                        name="momNat"
                                        key='momNat' 
                                        value='Việt Nam'
                                        onChange={(e) => {textInputOnChange(e)}}
                                        checked={'Việt Nam' === cityzen.momNat}
                                    /> Việt Nam
                                </div>
                                <div>
                                    <input type="radio" value='Khác' name='momNat' onChange={(e) => {textInputOnChange(e)}}/> Khác
                                    <div className='other-nat-container'>
                                        {
                                            cityzen.momNat === 'Khác' ?
                                                <input 
                                                    type='text'
                                                    name={'momOtherNat'}
                                                    key='momOtherNat' 
                                                    value={cityzen.momOtherNat}
                                                    onChange={(e) => {textInputOnChange(e)}}      
                                                ></input>
                                            :
                                            null    
                                        }   
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                
            <div className='relate-information'>
                <div className='header-container'>
                    <span>Quan hệ với chủ hộ</span>
                </div>
                <div className='relate-information-input'>
                    <div className='column'>
                        <div className='input-container'>
                            <span>Tên chủ hộ</span>
                            <input 
                                type='text'
                                key='ownerName' 
                                name='ownerName'
                                value={cityzen.ownerName}
                                onChange={(e) => {textInputOnChange(e)}} 
                            ></input>
                        </div>
                        <div className='input-container'>
                            <span>CCCD</span>
                            <input 
                                type='number'
                                key='ownerIden'
                                name='ownerIden' 
                                value={cityzen.ownerIden}
                                onChange={(e) => {textInputOnChange(e)}} 
                            ></input>
                        </div>
                        
                    </div>
                    <div className='column'>
                        <div className='input-container'>
                            <span>Số hộ khẩu</span>
                            <input 
                                type='number'
                                key='resNumber'
                                name='resNumber' 
                                value={cityzen.resNumber}
                                onChange={(e) => {textInputOnChange(e)}} 
                            ></input>
                        </div>
                        <div className='input-container'>
                            <span>Quan hệ với chủ hộ</span>
                            <input 
                                type='text'
                                name='withOwner'
                                key='withOwner' 
                                value={cityzen.withOwner}
                                onChange={(e) => {textInputOnChange(e)}} 
                            ></input>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <button className='submit-button' onClick={(e) => handleSubmitButton(e)}>
                    Lưu kết quả
                </button>
            </div>
            <div className={request.loading ? 'loading-wrapper active' : 'loading-wrapper'} >
                <div>
                    {
                        (request.loading) ? <Loading></Loading> : null
                    }
                </div>
            </div>
        </div>
    )
}

export default Create
