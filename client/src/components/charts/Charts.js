import React, { useEffect, useState } from 'react'
import './charts.css'
import FadeInSection from './FadeInSection'
import { useSelector } from 'react-redux'

// const line = {       
//     series: [{
//         name: "Session Duration",
//         data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10]
//     },
//     {
//         name: "Page Views",
//         data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35]
//     },
//     {
//         name: 'Total Visits',
//         data: [87, 57, 74, 99, 75, 38, 62, 47, 82, 56, 45, 47]
//     }],
//     options: {
//         chart: {
//             height: 350,
//             type: 'line',
//             zoom: {
//             enabled: false
//             },
//         },
//         dataLabels: {
//             enabled: false
//         },
//         stroke: {
//             width: [5, 7, 5],
//             curve: 'straight',
//             dashArray: [0, 8, 5]
//         },
//         title: {
//             text: 'Page Statistics',
//             align: 'left'
//         },
//         legend: {
//             tooltipHoverFormatter: function(val, opts) {
//                 return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
//         }
//         },
//         markers: {
//             size: 0,
//             hover: {
//             sizeOffset: 6
//         }
//       },
//       xaxis: {
//             categories: ['01 Jan', '02 Jan', '03 Jan', '04 Jan', '05 Jan', '06 Jan', '07 Jan', '08 Jan', '09 Jan',
//                 '10 Jan', '11 Jan', '12 Jan'
//             ],
//       },
//       tooltip: {
//             y: [{
//                 title: {
//                     formatter: function (val) {
//                         return val + " (mins)"
//                     }
//                 }
//             },
//         {
//         title: {
//                 formatter: function (val) {
//                     return val + " per session"
//                 }
//             }
//         },
//         {
//             title: {
//                 formatter: function (val) {
//                     return val;
//                 }
//             }
//         }]},
//         grid: {
//             borderColor: '#f1f1f1',
//         }
//     },
// };

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
        categories: ['Đã kết hôn', 'Chưa kết hôn', 'Đã ly hôn'],
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

var basicBar = {
    series: [{
        data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
    }],
    options: {
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
            categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan',
                'United States', 'China', 'Germany'
            ],
        }
    },
};

const nam = 8;
const nu = 4;
const sodan = 12;
const kethon = 3;
const chuakethon = 4;
const lyhon = 5;
const tu0_15 = 3;
const tu16_64 = 4;
const hon65 = 5;
const dantoc = {
    "kinh": 11,
    "Hmong": 1
};
const tongiao = {
    "Khong": 10,
    "thienchua": 2 
}
const quoctich = {
    "vietnam": 12,
    "khac": 0
}

const Charts = () => {
    const data = useSelector(state => state.multiRe)
    console.log(data)
    const [proData, setProData] = useState({
        nam: nam, nu: nu, sodan: sodan, kethon: kethon, 
        chuakethon: chuakethon, lython: lyhon, dantoc: dantoc,
        tongiao: tongiao, quoctich: quoctich, tu0_15: tu0_15, tu16_64: tu16_64,
        hon65: hon65 
    })
    const [keyValue, setKeyValue] = useState(null)
    const [option, setOption] = useState(null)
    const [item, setItem] = useState([])

    useEffect(() => {
        let tongiaoKey = []
        let tongiaoValue = []
        Object.keys(proData.tongiao).map((key) => {
            tongiaoKey = [...tongiaoKey, key]
            tongiaoValue = [...tongiaoValue, proData.tongiao[key]]
        })
        let dantocKey = []
        let dantocValue = []
        Object.keys(proData.dantoc).map((key) => {
            dantocKey = [...dantocKey, key]
            dantocValue = [...dantocValue, proData.dantoc[key]]
        })
        let quoctichKey = []
        let quoctichValue = []
        Object.keys(proData.quoctich).map((key) => {
            quoctichKey = [...quoctichKey, key]
            quoctichValue = [...quoctichValue, proData.quoctich[key]]   
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
    }, [proData])
    
    useEffect(() => {
        if(option) {
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
                    {options: marryBarOption, series: [{data:[proData.chuakethon, proData.kethon, proData.lython]}], type:"bar"},
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
                :null
            }
            
        </div>
    )
}

export default Charts
