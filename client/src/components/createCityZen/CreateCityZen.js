import React, { useCallback, useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import './createCityZen.css'

const CreateCityZen = () => {
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
        momName: '',
        momIden: '',
        ownerName: '',
        resNumber: '',
        ownerIden: '',
        withOwner: '',
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
        console.log(cityzen)
    }
    return (
        <div id='create-cityzen'>
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
                                    <input type="radio" value={'O'} name="bloodg"/> O
                                </div>
                                <div>
                                    <input type="radio" value={'A'} name="bloodg"/> A
                                </div>
                                <div>
                                    <input type="radio" value={'B'} name="bloodg"/> B
                                </div>
                                <div>
                                    <input type="radio" value={'AB'} name="bloodg"/> AB
                                </div>
                            </div>
                        </div>
                        <div className='input-container'>
                            <div className='input-title-container'>
                                <span>Giới tính</span>
                                <span className='star'>*</span>
                            </div>
                            <div className='group-input' onChange={(e) => handleRadioSelect(e)}>
                                <div>
                                    <input type="radio" value={'nam'} name="gender"/> Nam
                                </div>
                                <div>
                                    <input type="radio" value={'nữ'} name="gender"/> Nữ
                                </div>
                            </div>
                        </div>
                        <div className='input-container'>
                            <span>Tình trạng hôn nhân</span>
                            <div className='group-input' onChange={(e) => handleRadioSelect(e)}>
                                <div>
                                    <input type="radio" value={'Đã kết hôn'} name="mary"/> Đã kết hôn
                                </div>
                                <div>
                                    <input type="radio" value={'Chưa kết hôn'} name="mary"/> Chưa kết hôn
                                </div>
                                <div>
                                    <input type="radio" value={'Đã ly hôn'} name="mary"/> Đã ly hôn
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
                            <div className='group-input' onChange={(e) => handleRadioSelect(e)}>
                                <div>
                                    <input type="radio" value={'Việt Nam'} name="nationality"/> Việt Nam
                                </div>
                                <div>
                                    <input type="radio" value={'Khác'} name="nationality"/> Khác
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
                                name='currentRes'
                                key='currentRes'
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
                            <input type='text' name={'dadName'}></input>
                        </div>
                        <div className='input-container'>
                            <span>CCCD</span>
                            <input type='text' name={'dadIden'}></input>
                        </div>
                        <div className='input-container'>
                            <span>Quốc tịch</span>
                            <div className='group-input'>
                                <div>
                                    <input type="radio" name="dadNat"/> Việt Nam
                                </div>
                                <div>
                                    <input type="radio" name="dadNat"/> Khác
                                    <input type='text'></input>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='column'>
                        <div className='input-container'>
                            <span>Họ và tên đệm mẹ</span>
                            <input type='text' name={'momName'}></input>
                        </div>
                        <div className='input-container'>
                            <span>CCCD</span>
                            <input type='text' name={'momIden'}></input>
                        </div>
                        <div className='input-container'>
                            <span>Quốc tịch</span>
                            <div className='group-input'>
                                <div>
                                    <input type="radio" name="momNat"/> Việt Nam
                                </div>
                                <div>
                                    <input type="radio" name="momNat"/> Khác
                                    <input type='text'></input>
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
                            <input type='text'></input>
                        </div>
                        <div className='input-container'>
                            <span>CCCD</span>
                            <input type='text'></input>
                        </div>
                        
                    </div>
                    <div className='column'>
                        <div className='input-container'>
                            <span>Số hộ khẩu</span>
                            <input type='text'></input>
                        </div>
                        <div className='input-container'>
                            <span>Quan hệ với chủ hộ</span>
                            <input type='text'></input>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <Link to="/doc/Phở.docx">Tải Xuống phiếu mẫu</Link>
            </div>
            <div>
                <button className='submit-button' onClick={(e) => handleSubmitButton(e)}>
                    Lưu kết quả
                </button>
            </div>
        </div>
    )
}

export default CreateCityZen
