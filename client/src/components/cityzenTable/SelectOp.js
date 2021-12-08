import React, {useRef} from 'react'

const SelectOp = (props) => {
    const {selectedValue, setSelectedValue, directOrder, setDirectOrder} = props
    const orderRef = useRef(null)
    const directRef = useRef(null)
    const value = {
        id: 'id',
        hoTen: 'Họ tên',
        ngaySinh: 'Ngày sinh',
        gioiTinh: 'Giới tính',
        danToc: 'Dân tộc',
        quocTich: 'Quốc tịch',
        tonGiao: 'Tôn giáo'
    }

    const directions = {
        asc: 'Tăng dần',
        desc: 'Giảm dần'
    }

    const handleSelectValue = (key) => {
        setSelectedValue({
            key: key,
            value: value[key]
        })
        handleSelectOpClick()       
    }

    const handleDirect = (key) => {
        setDirectOrder({
            key: key,
            value: directions[key] 
        })
        handleDirectClick()
    }

    const handleSelectOpClick = (e) => {
        if(orderRef.current.classList.contains('active')) {
            orderRef.current.classList.remove('active')
        }else {
            orderRef.current.classList.add('active')
            directRef.current.classList.remove('active')
        }
    }

    const handleDirectClick = (e) => {
        if(directRef.current.classList.contains('active')) {
            directRef.current.classList.remove('active')
        }else {
            directRef.current.classList.add('active')
            orderRef.current.classList.remove('active')
        }
    }

    return (
        <div id='select-option' >
            <div className='select-option' ref={orderRef}>
                <div onClick={() => {handleSelectOpClick()}}>
                    <div className='select-title'>
                        <i className='bx bx-sort-alt-2'></i>
                        <div className='title-container'>
                            <span>{selectedValue.value}</span>
                        </div>
                        <i className='bx bxs-down-arrow'></i>
                    </div>
                </div>
                <div className='popup-select'>
                    <ul>
                        <li onClick={() => {handleSelectValue('id')}}>
                            {value.id}
                        </li>
                        <li onClick={() => {handleSelectValue('hoTen')}}>
                            {value.hoTen}
                        </li>
                        <li onClick={() => {handleSelectValue('ngaySinh')}}>
                            {value.ngaySinh}
                        </li>
                        <li onClick={() => {handleSelectValue('gioiTinh')}}>
                            {value.gioiTinh}
                        </li>
                        <li onClick={() => {handleSelectValue('danToc')}}>
                            {value.danToc}
                        </li>
                        <li onClick={() => {handleSelectValue('tonGiao')}}>
                            {value.tonGiao}
                        </li>
                        <li onClick={() => {handleSelectValue('quocTich')}}>
                            {value.quocTich}
                        </li>
                    </ul>
                </div>
            </div>

            <div className='direct-option' ref={directRef}>
                <div onClick={() => {handleDirectClick()}}>
                    <div className='select-title'>
                        <i className='bx bx-sort-alt-2'></i>
                        <div className='title-container'>
                            <span>{directOrder.value}</span>
                        </div>
                        <i className='bx bxs-down-arrow'></i>
                    </div>
                </div>
                <div className='popup-select'>
                    <ul>
                        <li onClick={() => {handleDirect('asc')}}>
                            {directions.asc}
                        </li>
                        <li onClick={() => {handleDirect('desc')}}>
                            {directions.desc}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        
    )
}

export default SelectOp
