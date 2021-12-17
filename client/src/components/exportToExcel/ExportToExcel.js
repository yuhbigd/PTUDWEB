import React from 'react'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import './exportToExcel.css'

const ExportToExcel = (props) => {
    const {csvData, fileName} = props
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const exportToCSV = (csvData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }
   
    return (
        <div id='export-excel'>
           <button className='download' onClick={(e) => exportToCSV(csvData,fileName)}>
                <i className='bx bx-down-arrow-alt'></i>
               <span>Excel</span>
           </button>
        </div>
    )
}

export default ExportToExcel
