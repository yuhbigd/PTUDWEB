import React, { useEffect, useState } from 'react'
import './charts.css'
import FadeInSection from './FadeInSection'
import { useSelector } from 'react-redux'
import { useMountedState } from 'react-use'
import _ from 'lodash'
import Loading from '../loading/Loading'

const genderBarOptions = {
    chart: {
        type: 'basic-bar',
        height: 350
    },
    plotOptions: {
        bar: {
            borderRadius: 4,
            horizontal: true,
        }
    },
    dataLabels: {
        enabled: false
        },
    xaxis: {
        categories: ['Nam', 'Nữ'],
    }
}

const genderPieOptions = {
    chart: {
        width: 380,
        type: 'pie',
    },
    labels: ['Nam', 'Nữ'],
    responsive: [{
        breakpoint: 480,
        options: {
        chart: {
            width: 200
        },
        legend: {
            position: 'bottom'
        }
        }
    }]
}

const ageBarOptions = {
    chart: {
        type: 'basic-bar',
        height: 350
    },
    plotOptions: {
        bar: {
            borderRadius: 4,
            horizontal: false,
        }
    },
    dataLabels: {
        enabled: false
        },
    xaxis: {
        categories: ['(0-15)', '(16-64)', '>65'],
    }
}

const agePieOptions = {
    chart: {
        width: 380,
        type: 'pie',
    },
    labels: ['(0-15)', '(16-64)', '>65'],
    responsive: [{
        breakpoint: 480,
        options: {
        chart: {
            width: 200
        },
        legend: {
            position: 'bottom'
        }
        }
    }]
}

const marryBarOption = {
    chart: {
        type: 'basic-bar',
        height: 350
    },
    plotOptions: {
        bar: {
            borderRadius: 4,
            horizontal: false,
        }
    },
    dataLabels: {
        enabled: false
        },
    xaxis: {
        categories: ['Đã kết hôn', 'Chưa kết hôn', 'Ly hôn'],
    }   
}

const marryRadialOption = {
    chart: {
        height: 350,
        type: 'radialBar',
    },
    plotOptions: {
            radialBar: {
            hollow: {
                margin: 0,
                size: "70%",
                background: "#293450"
            },
            track: {
                dropShadow: {
                enabled: true,
                top: 2,
                left: 0,
                blur: 4,
                opacity: 0.15
                }
            },
            dataLabels: {
                name: {
                offsetY: -10,
                color: "#fff",
                fontSize: "13px"
                },
                value: {
                color: "#fff",
                fontSize: "30px",
                show: true
                }
            }
            }
    },
    fill: {
        type: "gradient",
        gradient: {
        shade: "dark",
        type: "vertical",
        gradientToColors: ["#87D4F9"],
        stops: [0, 100]
        }
    },
    stroke: {
        lineCap: "round"
    },
    labels: ["Tỷ lệ ly hôn"]
}

const Charts = () => {
    const data = useSelector(state => state.multiRe)
    const isMounted = useMountedState()
    const [proData, setProData] = useState({
        nam: 0, nu: 0, sodan: 0, kethon: 0, 
        chuakethon: 0, lython: 0, dantoc: null,
        tongiao: null, quoctich: null, tu0_15: 0, tu16_64: 0,
        hon65: 0 
    })    
    const [keyValue, setKeyValue] = useState(null)
    const [option, setOption] = useState(null)
    const [item, setItem] = useState([])
    
    useEffect(() => {
        if(data.length){
            let soNam = 0;
            let soNu = 0;
            let daKetHon = 0;
            let chuaKetHon = 0;
            let lyHon = 0;
            let danToc = {};
            let tonGiao = {};
            let quocTich = {};
            let nhoHon15 = 0;
            let tu15_64 = 0;
            let hon64 = 0;
            let soDan = 0;
            data.map((it, index) => {
                if(Object.keys(it).length === 18) {
                    soNam += it.soNam;
                    soNu += it.soNu
                    daKetHon += it.daKetHon
                    chuaKetHon += it.chuaKetHon
                    lyHon += it.lyHon
                    nhoHon15 += it.nhoHon15
                    tu15_64 += it.tu15_64
                    hon64 += it.hon64
                    soDan += it.soDan
                    danToc = _.mergeWith(danToc, it.danToc, (a, b) => {
                        if (_.every([a, b], _.isNumber)) return a + b;
                    })
                    tonGiao = _.mergeWith(tonGiao, it.tonGiao, (a, b) => {
                        if (_.every([a, b], _.isNumber)) return a + b;
                    })
                    quocTich = _.mergeWith(quocTich, it.quocTich, (a, b) => {
                        if (_.every([a, b], _.isNumber)) return a + b;
                    })
                }
            })
            setProData({
                nam: soNam, nu: soNu, sodan: soDan, kethon: daKetHon, 
                chuakethon: chuaKetHon, lython: lyHon, dantoc: danToc,
                tongiao: tonGiao, quoctich: quocTich, tu0_15: nhoHon15, tu16_64: tu15_64,
                hon65: hon64
            })
        }
    },[data])
    
    useEffect(() => {
        if(proData.tongiao) {
            let tongiaoKey = []
            let tongiaoValue = []
            Object.keys(proData.tongiao).map((key) => {
                if( proData.tongiao[key]) {
                    tongiaoKey = [...tongiaoKey, key]
                    tongiaoValue = [...tongiaoValue, proData.tongiao[key]]
                }
            })
            let dantocKey = []
            let dantocValue = []
            Object.keys(proData.dantoc).map((key) => {
                if(proData.dantoc[key]) {
                    dantocKey = [...dantocKey, key]
                    dantocValue = [...dantocValue, proData.dantoc[key]]
                }
            })
            let quoctichKey = []
            let quoctichValue = []
            Object.keys(proData.quoctich).map((key) => {
                if(proData.quoctich[key]) {
                    quoctichKey = [...quoctichKey, key]
                    quoctichValue = [...quoctichValue, proData.quoctich[key]]
                }
            })  

            setKeyValue({
                tongiaoKey: [...tongiaoKey],
                tongiaoValue: [...tongiaoValue],
                dantocKey: [...dantocKey],
                dantocValue: [...dantocValue],
                quoctichKey: [...quoctichKey],
                quoctichValue: [...quoctichValue]
            })

            setOption({
                tongiaoBarOptions:{
                    chart: {
                        type: 'basic-bar',
                        height: 350
                    },
                    plotOptions: {
                        bar: {
                            borderRadius: 4,
                            horizontal: false,
                        }
                    },
                    dataLabels: {
                        enabled: false
                        },
                    xaxis: {
                        categories: [...tongiaoKey],
                    }
                },
                tongiaoPieOptions:{
                    chart: {
                        width: 380,
                        type: 'pie',
                    },
                    labels: [...tongiaoKey],
                    responsive: [{
                        breakpoint: 480,
                        options: {
                        chart: {
                            width: 200
                        },
                        legend: {
                            position: 'bottom'
                        }
                        }
                    }]
                },
                ethnicBarOptions:{
                    chart: {
                        type: 'basic-bar',
                        height: 350
                    },
                    plotOptions: {
                        bar: {
                            borderRadius: 4,
                            horizontal: true,
                        }
                    },
                    dataLabels: {
                        enabled: false
                        },
                    xaxis: {
                        categories: [...dantocKey],
                    }
                },
                ethnicPieOptions: {
                    chart: {
                        width: 380,
                        type: 'pie',
                    },
                    labels: [...dantocKey],
                    responsive: [{
                        breakpoint: 480,
                        options: {
                        chart: {
                            width: 200
                        },
                        legend: {
                            position: 'bottom'
                        }
                        }
                    }]
                },
                nationBarOptions:{
                    chart: {
                        type: 'basic-bar',
                        height: 350
                    },
                    plotOptions: {
                        bar: {
                            borderRadius: 4,
                            horizontal: false,
                        }
                    },
                    dataLabels: {
                        enabled: false
                        },
                    xaxis: {
                        categories: [...quoctichKey],
                    }
                },
                nationPieOptions: {
                    chart: {
                        width: 380,
                        type: 'pie',
                    },
                    labels: [...quoctichKey],
                    responsive: [{
                        breakpoint: 480,
                        options: {
                        chart: {
                            width: 200
                        },
                        legend: {
                            position: 'bottom'
                        }
                        }
                    }]
                }
            })
        }  
    }, [proData])
    
    useEffect(() => {
        if(option && isMounted()) {
            setItem([
                // nam nu
                [
                    {options: genderBarOptions, series: [{data:[proData.nam, proData.nu]}], type:"bar"},
                    {options: genderPieOptions, series: [proData.nam, proData.nu], type:"pie"},
                    {tite: 'Tỷ lệ Nam, Nữ'}
                ],
                [
                    {options: ageBarOptions, series: [{data:[proData.tu0_15, proData.tu16_64, proData.hon65]}], type:"bar"},
                    {options: agePieOptions, series: [proData.tu0_15, proData.tu16_64, proData.hon65], type:'donut'},
                    {tite: 'Tỷ lệ các nhó tuổi'}
                ],
                [
                    {options: marryBarOption, series: [{data:[proData.kethon, proData.chuakethon, proData.lython]}], type:"bar"},
                    {options: marryRadialOption, series: [parseInt(100*proData.lython/proData.sodan)], type:'radialBar'},
                    {tite: 'Tỷ lệ kết hôn'}
                ],
                [
                    {options: option.tongiaoBarOptions, series: [{data:[...keyValue.tongiaoValue]}], type:"bar"},
                    {options: option.tongiaoPieOptions, series: [...keyValue.tongiaoValue], type:'pie'},
                    {tite: 'Tỷ lệ tôn giáo'}
                ],
                [
                    {options: option.ethnicBarOptions, series: [{data:[...keyValue.dantocValue]}], type:"bar"},
                    {options: option.ethnicPieOptions, series: [...keyValue.dantocValue], type:'donut'},
                    {tite: 'Tỷ lệ dân tộc'}
                ],
                [
                    {options: option.nationBarOptions, series: [{data:[...keyValue.quoctichValue]}], type:"bar"},
                    {options: option.nationPieOptions, series: [...keyValue.quoctichValue], type:'pie'},
                    {tite: 'Tỷ lệ quốc tịch'}
                ],      
            ])
        }
    }, [option])
    
    return (
        <div id='chart-session'>
            {
                keyValue && option ?
                <div >
                    {
                        item.map((i, index) => {
                            return(
                                    <FadeInSection i={i} key={index}></FadeInSection>
                            )
                        })
                    }
                </div>
                :<Loading></Loading>
            }
            
        </div>
    )
}

export default Charts
