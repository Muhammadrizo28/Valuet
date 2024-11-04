import { useContext, useEffect, useState, useCallback, useRef } from 'react';
import style from '../../style/Widgets/Coins.module.scss';
import { coinsRateContext } from '../../context/CoinsRate/coinsRate';
import WidgetsRates from './WidgetRates';
import PropTypes from "prop-types"

import Aeternity from "../../images/Overview_page/aeternity.png";
import Bitcoin   from "../../images/Overview_page/bitcoin.png";
import Dash      from "../../images/Overview_page/dash.png";
import Ethereum from "../../images/Overview_page/ethereum.png";
import GridCoin  from "../../images/Overview_page/gridCoin.png";
import LiteCoin  from "../../images/Overview_page/liteCoin.png";
import Nano      from "../../images/Overview_page/nano.png";
import NavCoin   from "../../images/Overview_page/navCoin.png";
import PeerCoin  from "../../images/Overview_page/peerCoin.png";

import ex_img from "../../images/Overview_page/ex.png"
import http_change from '../../hooks/http_change';
import { useDispatch, useSelector } from 'react-redux';
import { requestBalance } from '../../store';





function Coinswidget({clicked}) {
    const [widgets, setWidgets] = useState([]);
    const [animation, setAnimation] = useState(false)
    const user = localStorage.getItem('user');
    const { coinsRate } = useContext(coinsRateContext);
    const firstRenderButton = useRef(false)
    const [intilization, setIntilization] = useState(false)

    const requestedBalance = useSelector((state) => state.requestBalance.value)

    const dispatch = useDispatch()



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

  

      
    const getWidgets = useCallback(() => {
    
        if (requestedBalance.length !== 0) {
            
            const array = requestedBalance[0].widgets.map((item) => {
                const matchedRate = coinsRate.find((rate) => rate.name === item);
                return matchedRate
                    ? {
                        name: item,
                        volatility: matchedRate.volatility,
                        price : matchedRate.rate,
                        shortName : matchedRate.shortName
                    }
                    : null;
            }).filter(Boolean); 
            setWidgets(array);
            
        }
       
    }, [coinsRate, requestedBalance]);

    
    useEffect(() => {
        if (user) {
            const parsedUser = JSON.parse(user);
            if (parsedUser?.id) {
                getWidgets(parsedUser.id);
            }
        }
    }, [user, getWidgets, requestedBalance]); 




    useEffect(() => {

        

        if(firstRenderButton.current && widgets.length > 0) {

            widgets.length > 2 && clicked? setAnimation(true) : setAnimation(false)
        }
        else {
            firstRenderButton.current = true
            setAnimation(false)
        }
        
    }, [clicked, widgets])


    function deleteWidget(name) {

        setWidgets(prev => prev.filter((item) => item !== name))
        setIntilization(true)
   
    }


    const deleteWidgetDb = useCallback(async (id) => {
        if (user && widgets.length > 0) {
            const updatedWidgets = widgets.map((item) => item.name);
    
            try {
                const res = await http_change("widgets", updatedWidgets)(id);
    
                if (res.status >= 200 && res.status < 300) {
                    if (requestedBalance[0].widgets.length !== updatedWidgets.length) {
                        
                        dispatch(requestBalance());
                    } else {
                        console.log('Данные не изменились, dispatch не вызывается');
                    }
                } else {
                    console.log('Ошибка: некорректный статус ответа', res.status);
                }
            } catch (err) {
                console.log('Ошибка при удалении виджета:', err);
            }
        }
    }, [user, widgets, dispatch, requestedBalance]);
    
    useEffect(() => {

        const parsedUser = JSON.parse(user);
    
        if (parsedUser?.id && intilization) {

            deleteWidgetDb(parsedUser.id);

            setIntilization(false); 
        }
    }, [user, deleteWidgetDb, intilization]);

 

    return (

        <section className={style.coinsWidget}>
            {widgets.map((item) => (
                <div key={item.name} className={style.widgetItem}>

                    <div className={style.nameBox}>

                        <h1 className={style.widgetName}>{item.name}</h1>

                        <button onClick={() => {deleteWidget(item)}} className={animation === true ? style.imgAnimation : style.hiddenButton}><img src={ex_img} alt="X" /></button>

                    </div>


                    <div className={style.widgetCont}>

                        <div className={style.widgetImg_cont}>

                            <div className={style.widgetImg_circle}>
                                <div className={style.widgetImg_circle2}>
                                    <img src={arrImages[item.name]} alt="" />
                                </div>
                            </div>

                            <div className={style.coinName_price} style={{width : "fit-content", height : 'fit-content'} }>
                                <h2 className={style.widgetItem_shortName}>{item.shortName}</h2>
                                <span className={style.widgetPrice}>{item.price % 1 === 0 ? parseFloat(item.price.toFixed(0)) : parseFloat(item.price.toFixed(3))} $</span>
                            </div>


                        </div>

                        

                        <WidgetsRates obj={item}/>


                       
                    </div>
                  
                   
                </div>
            ))}
        </section>

    );
}

Coinswidget.propTypes = {

    clicked : PropTypes.bool,
    widgetsArr : PropTypes.array
}

export default Coinswidget;
