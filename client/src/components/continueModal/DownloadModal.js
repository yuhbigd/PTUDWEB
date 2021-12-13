import React, {useRef, useEffect} from 'react'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

const DownloadModal = (props) => {
    const overlay = useRef(null)
    const {downLoadCityzen, setDownLoadCityzen} = props

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const exportToCSV = (csvData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    useEffect(() => {
        if(downLoadCityzen.length) {
            overlay.current.classList.add('active')
        }
    }, [downLoadCityzen])
    
    const cancelHandle = () => {
        overlay.current.classList.remove('active')
        setDownLoadCityzen([])
    }

    return (
        <div id='warning-modal-overlay' ref={overlay}>
            <div className='w-modal-container' ref={overlay}>
                <div>
                    <div>
                        <span className='modal-title'>Cảnh báo</span>
                    </div>
                    <div className='modal-bound'>
                        <div className='w-modal-content'>
                            <span className='warning-content'>
                                {
                                    `Tiếp tục tải xuống ${downLoadCityzen.length} bản ghi`
                                }
                            </span>
                        </div>
                    </div>
                </div>
                <div className='button-modal'>
                    <span className='ok-button' onClick={(e) => exportToCSV(downLoadCityzen, 'Danso')}>
                      <span>Tải xuống</span>
                    </span>
                    <span className='cancel-button' onClick={(e) => cancelHandle(e)}>Cancel</span>
                </div>
            </div>
        </div>
    )
}

export default DownloadModal
