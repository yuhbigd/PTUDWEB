import React, {useRef, useState, useEffect} from 'react'
import ReactApexChart from 'react-apexcharts'

const FadeInSection = (props) => {
    const {i} = props
    const domRef = useRef();
    const [isVisible, setVisible] = useState(false);
  
    useEffect(() => {
        if(domRef.current) {
            const observer = new IntersectionObserver(entries => {
                // In your case there's only one element to observe:     
                if (entries[0].isIntersecting) {
                // Not possible to set it back to false like this:
                setVisible(true);
                // No need to keep observing:
                observer.unobserve(domRef.current);
                }
            });
          
            observer.observe(domRef.current);
            // if(domRef.current) {
            //     return () => observer.unobserve(domRef.current ? domRef.current : '');
            // }
        }
    }, []);
    return (
        <div id='fade-in-section' ref={ domRef } className={ isVisible ? ' is-visible' : '' }>
            <div>
                <span className='title'>
                    {i[2].tite}
                </span>
            </div>
            <div className='charts-group'>
                <div className='chart-item'>   
                    <ReactApexChart options={i[0].options} series={i[0].series} type={i[0].type} height={350} width={'100%'}/>
                </div>
                    {
                        !i[1] ? null :
                        <div className='chart-item'>   
                            <ReactApexChart options={i[1].options} series={i[1].series} type={i[1].type} width={380} height={400} />
                        </div>
                    }
            </div>  
        </div>);
};

export default FadeInSection