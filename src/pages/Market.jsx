import { useContext } from 'react';
import InnerContainer from '../components/InnerContainer'
import style from '../style/Market.module.scss'
import {coinsRateContext} from '../context/CoinsRate/coinsRate'
import greenLine_img from '../images/Market_page/greenLine.png'
import redLine_img from '../images/Market_page/redLine.png'

import Aeternity from "../images/Overview_page/aeternity.png";
import Bitcoin   from "../images/Overview_page/bitcoin.png";
import Dash      from "../images/Overview_page/dash.png";
import Ethereum from  "../images/Overview_page/ethereum.png";
import GridCoin  from "../images/Overview_page/gridCoin.png";
import LiteCoin  from "../images/Overview_page/liteCoin.png";
import Nano      from "../images/Overview_page/nano.png";
import NavCoin   from "../images/Overview_page/navCoin.png";
import PeerCoin  from "../images/Overview_page/peerCoin.png";

function Market() {

    const {coinsRate} = useContext(coinsRateContext)
    

    const arrImages = {
        Aeternity: Aeternity,
        Bitcoin: Bitcoin,
        Dash: Dash,
        Ethereum: Ethereum,  
        GridCoin: GridCoin,
        Litecoin: LiteCoin,
        Nano: Nano,
        Navcoin: NavCoin,
        Peercoin: PeerCoin,
    };
    

    return ( 

        <InnerContainer pageName='Market' showButton={false} showDate={false} buttonText=''>

            <div className={style.market_cont}>
                {coinsRate.map((item) => (

                    <div className={style.market_item} key = {item.name}>
                        <div className={style.market_itemTop_side}>

                            <div className={style.market_circleText_box}>

                                <div className={style.market_circle_text_box}> 

                                    <div className={`${style.market_itemCircle} ${style[item.name]}`}>
                                        <div><img src={arrImages[item.name]} alt="" /></div>
                                    </div>
    
                                    <div className={style.market_textBox}>
    
                                        <h3>{item.name}</h3>
                                        <span style={item.volatility[0].slice(0, 1) === '-' ? {color : 'red'} : {color: 'rgba(0, 232, 172, 1)'}}>{item.volatility[0]}</span>
    
                                    </div>
    
                                    </div>


                            </div>

                            <div className={style.market_infoBox}>
                                <h3>{Number(item.rate.toFixed(4))} <span>USD</span></h3>
                                <div>
                                    <p>Volume <span>{item.volume}</span> {item.shortName}</p>
                                </div>
                            </div>


                        </div>

                        <img src={item.volatility[0].slice(0, 1) === "+" ? greenLine_img : redLine_img} alt="" />

                    </div>
                ))}
            </div>


        </InnerContainer>
    );
}

export default Market;