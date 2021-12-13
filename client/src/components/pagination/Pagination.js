import React, {useState, useEffect, useRef} from 'react'
import './pagination.css'

const Pagination = (props) => {
    const {pages = 1088, setCurrentPage, currentPage, numPerPage, setNumPerPage} = props
    const numberOfPages = []
    for (let i = 1; i <= pages; i++) {
        numberOfPages.push(i)
    }
    const pageNumRef = useRef(null) 

    // Current active button number
    const [currentButton, setCurrentButton] = useState(currentPage)

    // Array of buttons what we see on the page
    const [arrOfCurrButtons, setArrOfCurrButtons] = useState([])

    useEffect(() => {
        let tempNumberOfPages = [...arrOfCurrButtons]

        let dotsInitial = '...'
        let dotsLeft = '... '
        let dotsRight = ' ...'

        if (numberOfPages.length < 6) {
        tempNumberOfPages = numberOfPages
        }

        else if (currentButton >= 1 && currentButton <= 3) {
        tempNumberOfPages = [1, 2, 3, 4, dotsInitial, numberOfPages.length]
        }

        else if (currentButton === 4) {
        const sliced = numberOfPages.slice(0, 5)
        tempNumberOfPages = [...sliced, dotsInitial, numberOfPages.length]
        }

        else if (currentButton > 4 && currentButton < numberOfPages.length - 2) {            
        const sliced1 = numberOfPages.slice(currentButton - 2, currentButton)                 
        const sliced2 = numberOfPages.slice(currentButton, currentButton + 1)                
        tempNumberOfPages = ([1, dotsLeft, ...sliced1, ...sliced2, dotsRight, numberOfPages.length])
        }
        
        else if (currentButton > numberOfPages.length - 3) {                 
        const sliced = numberOfPages.slice(numberOfPages.length - 4)        
        tempNumberOfPages = ([1, dotsLeft, ...sliced])                        
        }
        
        else if (currentButton === dotsInitial) {
        setCurrentButton(arrOfCurrButtons[arrOfCurrButtons.length-3] + 1) 
        }
        else if (currentButton === dotsRight) {
        setCurrentButton(arrOfCurrButtons[3] + 2)
        }

        else if (currentButton === dotsLeft) {
        setCurrentButton(arrOfCurrButtons[3] - 2)
        }

        setArrOfCurrButtons(tempNumberOfPages)
        setCurrentPage(currentButton)
    }, [currentButton])

    const handleNumPerPage = () => {
        if(pageNumRef.current.classList.contains('active')) {
            pageNumRef.current.classList.remove('active')
        }else {
            pageNumRef.current.classList.add('active')
        }
    }

    const handleSetNumPerPage = (num) => {
        setNumPerPage(num)
        pageNumRef.current.classList.remove('active')
    }

    return (
        <div id='pagination-section'>
            <div className='num-per-page-option' ref={pageNumRef}>
                <div onClick={() => {handleNumPerPage()}}>
                    <div className='select-title'>
                        <i className='bx bx-spreadsheet'></i>
                        <div className='title-container'>
                            <span>{numPerPage + '/page'}</span>
                        </div>
                        <i className='bx bxs-down-arrow'></i>
                    </div>
                </div>
                <div className='popup-select'>
                    <ul>
                        <li onClick={() => {handleSetNumPerPage(5)}}>
                            {'5'}
                        </li>
                        <li onClick={() => {handleSetNumPerPage(10)}}>
                            {'10'}
                        </li>
                        <li onClick={() => {handleSetNumPerPage(15)}}>
                            {'15'}
                        </li>
                        <li onClick={() => {handleSetNumPerPage(20)}}>
                            {'20'}
                        </li>
                        <li onClick={() => {handleSetNumPerPage(25)}}>
                            {25}
                        </li>
                        <li onClick={() => {handleSetNumPerPage(30)}}>
                            {30}
                        </li>
                        <li onClick={() => {handleSetNumPerPage(35)}}>
                            {35}
                        </li>
                        <li onClick={() => {handleSetNumPerPage(40)}}>
                            {40}
                        </li>
                        <li onClick={() => {handleSetNumPerPage(45)}}>
                            {45}
                        </li>
                        <li onClick={() => {handleSetNumPerPage(50)}}>
                            {50}
                        </li>
                        <li onClick={() => {handleSetNumPerPage(55)}}>
                            {55}
                        </li>
                        <li onClick={() => {handleSetNumPerPage(60)}}>
                            {60}
                        </li>
                        <li onClick={() => {handleSetNumPerPage(75)}}>
                            {75}
                        </li>
                        <li onClick={() => {handleSetNumPerPage(80)}}>
                            {80}
                        </li>
                        <li onClick={() => {handleSetNumPerPage(85)}}>
                            {85}
                        </li>
                        <li onClick={() => {handleSetNumPerPage(95)}}>
                            {95}
                        </li>
                    </ul>
                </div>
            </div>
            <div id="pagination-container">
            <div
                className={`${currentButton === 1 ? 'redir disabled' : 'redir'}`}
                onClick={() => setCurrentButton(prev => prev <= 1 ? prev : prev - 1)}
            >
                <i className='bx bx-chevrons-left'></i>
            </div>

            {arrOfCurrButtons.map(((item, index) => {
                return <div
                    key={index}
                    className={`${currentButton === item ? 'pagi-button active' : 'pagi-button'}`}
                    onClick={() => setCurrentButton(item)}
                >
                    <span>
                        {item}
                    </span>
                </div>
            }))}

            <div
                className={`${currentButton === numberOfPages.length ? 'redir disabled' : 'redir'}`}
                onClick={() => setCurrentButton(prev => prev >= numberOfPages.length ? prev : prev + 1)}
            >
                    <i className='bx bx-chevrons-right'></i>
        </div>
    </div>
        </div>   
    )
}

export default Pagination
