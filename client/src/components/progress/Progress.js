import React, {useState, useEffect, useRef} from 'react'
import './progress.css'
import ReactApexChart from 'react-apexcharts';
import { useAsyncFn } from 'react-use';
import { useSelector } from 'react-redux';
import moment from 'moment';
import WarningModal from './../warningModal/WarningModal'

const Progress = () => {
    const unitId = useSelector(state => state.multiRe)
    const [series, setSeries] = useState([])
    const [option, setOption] = useState({})
    const [serverErr, setServerErr] = useState(null)
    const [total, setTotal] = useState(null)
    const [mostReach, setMostReach] = useState(null)
    const [lowestReach, setLowestReach] = useState(null)
    const [Avarage, setAvarage] = useState(null)
    const theme = (localStorage.getItem('theme')) 
    const selectRef = useRef(null)
    const [query, setQuery] = useState({
        value: 'Theo ngày',
        key: 'days=1'   
    })

    function generateDay(baseval, count, item) {
        const progress = item.progress
        var i = 0;
        var series = [];

        while(i < count) {
            const da1 = moment(new Date(baseval).getTime()).utcOffset("+0700").format("DD-MM-YYYY")
            var amount = 0
            // eslint-disable-next-line no-loop-func
            progress.map((pro, index) => {
                const da2 = moment(`${pro.year}-${pro.month}-${pro.day}`).utcOffset("+0700").format("DD-MM-YYYY")
                if(da1 === da2) {
                    amount = pro.count
                }
            }) 
            series.push(amount)
            baseval += 86400000;
            i++;
        }
        return [...series];
    }

    const generateCategory = (baseval = new Date('2021-11-29').getTime(), count = 30) => {
        var i = 0;
        var result = []
        while(i < count) {
            const da = moment(new Date(baseval)).utcOffset("+0700").format("DD-MM")
            const day = moment(new Date(baseval)).utcOffset("+0700").format("DD")
            if(i === 0 || i === count - 1 || i % 5 === 0) {
                result = [...result, da]
            }else {
                result = [...result, '']
            }
            baseval += 86400000;
            i++;
        }
        return result
    }

    function generateWeek(baseval, count, item) {
        const progress = item.progress
        var i = 0;
        var series = [];
        while(i < count) {
            var amount = 0
            // eslint-disable-next-line no-loop-func
            progress.map((pro, index) => {
                if(baseval === pro.week) {
                    amount = pro.count
                }
            }) 
            series.push(amount)
            baseval += 1;
            i++;
        }
        return [...series];
    }

    const generateCategoryWeek = (baseval, count) => {
        var i = 0;
        var result = []
        while(i < count) {
            result.push(`week: ${baseval}` )
            baseval += 1;
            i++;
        }
        return result
    }
    
    const [request1, setRequest1] = useAsyncFn(async(ids, query = 'weeks=1') => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/account/progression/children?${query}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                "data": {
                    "children": [...ids]
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

    useEffect(() => {
        var foreColor
        if(parseInt(theme) === 1 || parseInt(theme) === 3) {
            foreColor = 'black'
        }else if(parseInt(theme) === 2 ) {
            foreColor = 'white'
        }else {
            foreColor = 'black'
        }
        
        if(request1.value) {
            const data = JSON.parse(request1.value).data
            const startDate = new Date('2021-11-29').getTime()
            const momentStart = moment('2021-11-29', 'YYYY-MM-DD')
            const momentEnd = moment().format('YYYY-MM-DD')
            const weekStart = momentStart.week()
            const weekEnd = moment().week()
            const countWeek = weekStart - weekEnd + 4;
            const countDay = Math.abs( moment.duration(momentStart.diff(momentEnd)).asDays()) + 2
            if(data) {
                var series = []
                var categories = []
                if(query.key === 'days=1' || !query) {
                    categories =  generateCategory(startDate, countDay)
                    data.map((item, index) => { 
                        const subSeries = generateDay(startDate, countDay, item)
                        series = [...series,{
                            name: item.id,
                            data: subSeries
                        }]
                    })
                }else if(query.key === 'weeks=1') {
                    categories =  generateCategoryWeek(weekStart, countWeek)
                    data.map((item, index) => { 
                        const subSeries = generateWeek(weekStart, countWeek, item)
                        series = [...series,{
                            name: item.id,
                            data: subSeries
                        }]
                    })                 
                }
                setSeries(series)
                setOption({
                    chart: {
                        height: 350,
                        type: 'line',
                        zoom: {
                        enabled: false
                        },
                        foreColor: foreColor
                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        width: [5, 7, 5],
                        curve: 'straight',
                        dashArray: [0, 8, 5]
                    },
                    title: {
                        text: 'Progress',
                        align: 'left'
                    },
                    legend: {
                        tooltipHoverFormatter: function(val, opts) {
                            return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
                    }
                    },
                    markers: {
                        size: 0,
                        hover: {
                        sizeOffset: 6
                    }
                },
                xaxis: {
                        categories: [...categories],
                },
                tooltip: {
                        y: [{
                            title: {
                                formatter: function (val) {
                                    return val + " (mins)"
                                }
                            }
                        },
                    {
                    title: {
                            formatter: function (val) {
                                return val + " per session"
                            }
                        }
                    },
                    {
                        title: {
                            formatter: function (val) {
                                return val;
                            }
                        }
                    }]},
                grid: {
                    borderColor: foreColor,
                }
                })
            }
        }
    }, [request1])

    useEffect(() => {
        var ids = []
        if(unitId.length) {
            unitId.map((item) => {
                ids.push(item.id)
            })
        }
        setRequest1(ids, query.key)
        // find most, find least, find total, find, avarage
        var most = {
            num: unitId[0].soDan,
            name: unitId[0].name
        };
        var least = {
            num: unitId[0].soDan,
            name: unitId[0].name
        };
        var avarage = 0;
        var total = 0;
        unitId.map((item, index) => {
            total += item.soDan;
            if(most.num < item.soDan) {
                most = {
                    num: item.soDan,
                    name: item.name
                }
            }
            if(least.num > item.soDan) {
                least = {
                    num: item.soDan,
                    name: item.name
                }
            }
        })
        avarage = 1.0*total/ids.length
        setAvarage(avarage)
        setMostReach(most)
        setLowestReach(least)
        setTotal(total)
    
    }, [unitId, query])

    const handleSelectOpClick = () => {
        if(selectRef.current.classList.contains('active')) {
            selectRef.current.classList.remove('active')
        }else {
            selectRef.current.classList.add('active')
        }
    } 

    const handleSelectValue = (key) => {
        setQuery({
            key: key,
            value: key==='weeks=1' ? 'Theo Tuần' : 'Theo ngày'
        })
        selectRef.current.classList.remove('active')
    }

    return (
        <div id='progress-section'>
            <div id='select-option' >
                <div className='select-option' ref={selectRef}>
                    <div onClick={() => {handleSelectOpClick()}}>
                        <div className='select-title'>
                            <i className='bx bx-sort-alt-2'></i>
                            <div className='title-container'>
                                <span>{query.value}</span>
                            </div>
                            <i className='bx bxs-down-arrow'></i>
                        </div>
                    </div>
                    <div className='popup-select'>
                        <ul>
                            <li onClick={() => {handleSelectValue('days=1')}}>
                                {'Theo Ngày'}
                            </li>
                            <li onClick={() => {handleSelectValue('weeks=1')}}>
                                {'Theo Tuần'}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <WarningModal setServerErr={setServerErr} serverErr={serverErr}/>
            <div className='line-chart-container'>
                {   
                    option && series ? 
                        <ReactApexChart options={option} series={series} type={'line'} height={350} width={'100%'}/>            
                    : null
                }
            </div>
            

            {
                unitId && mostReach ? <div className='more-info-progress'>
                    <div className='table-container'>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Mã</th>
                                    <th>Tên đơn vị</th>
                                    <th>Kết quả</th>
                                </tr>
                            </thead>
                            <tbody>
                                {unitId.map((item, index) => {
                                    return(
                                        <tr key={index}>
                                            <td>
                                                {item.id}
                                            </td>
                                            <td>
                                                {item.name}
                                            </td>
                                            <td>
                                                {item.soDan}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className='info-card-container'>
                        <div>
                            <div className='info-card-item'>
                                <div className='title'>
                                    <span>KQ cao nhất</span>
                                </div>
                                <div className='subtitle'>
                                    <span>
                                        {mostReach.name}
                                    </span>
                                </div>
                                <div className='content'>
                                    <span>{mostReach.num}</span>
                                </div>
                            </div>
                            <div className='info-card-item'>
                                <div className='title'>
                                    <span>Tổng KQ đạt được</span>
                                </div>
                                <div className='content'>
                                    <span>{total}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className='info-card-item'>
                                <div className='title'>
                                    <span>KQ thấp nhất</span>
                                </div>
                                <div className='subtitle'>
                                    <span>{lowestReach.name}</span>
                                </div>
                                <div className='content'>
                                    <span>{lowestReach.num}</span>
                                </div>
                            </div>
                            <div className='info-card-item'>
                                <div className='title'>
                                    <span>KQ trung bình</span>
                                </div>
                                <div className='content'>
                                    <span>{Avarage}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                :null
            }
            
        </div>
    )
}

export default Progress
