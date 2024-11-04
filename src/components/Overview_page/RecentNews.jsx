import style from '../../style/RecentNews.module.scss'
import narrow_down from "../../images/Overview_page/narrowDown.png"
import { useEffect, useRef, useState } from 'react';

function RecentNews() {

    const dataArray = [

        { date: '2 hours ago', text: 'Bitcoin Hits New High as Investor Interest Grows' },
        { date: '19 hours ago', text: 'Ethereum Introduces New Staking System' },
        { date: '21 hours ago', text: 'Solana Network Fees Drop by 15%' },
        { date: '2 days ago', text: 'Ripple Wins Court Case, XRP Price Surges' },
        { date: '2 days ago', text: 'Binance Expands Trading on New Markets' },
        { date: '3 days ago', text: 'Cardano Launches Upgraded Network for DeFi' }
    ];

    const bottomSideRef = useRef(null);

    const [click, setClick] = useState(false)

    const scrollToBottom = () => {
        bottomSideRef.current?.scrollTo({
            top: bottomSideRef.current.scrollHeight,
            behavior: 'smooth' 
        });
    };

    const scrollToTop = () => {
        bottomSideRef.current?.scrollTo({
            top: 0,
            behavior: 'smooth' 
        });
    };

    useEffect(() => {

        click ? scrollToBottom() : scrollToTop()

    }, [click])
    

    return ( 

        <div className={style.newsBox}>
            <div className={style.boxWrap}>
                <div className={click ? style.showBack : style.showBack2}><img className={click ? style.imgBottom : style.imgTop} onClick={() => setClick(!click)} src={narrow_down} alt="" /></div>
            </div>

            <div className={style.topSide}><span>Recent News</span></div>
            <div ref={bottomSideRef} className={style.bottomSide}>
                {dataArray.map((item, index) => (

                    <div className={style.newsItem} key={index}>

                        <p>{item.date}</p>
                        <span>{item.text}</span>
                    
                    </div>
                    
                ))}
            </div>

        </div>

    );
}

export default RecentNews;