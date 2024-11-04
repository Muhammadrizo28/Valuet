import { useCallback, useContext, useEffect, useState } from 'react';
import InnerContainer from '../components/InnerContainer';
import BalanceWidget from '../components/Overview_page/BalanceWidget';
import Coinswidget from '../components/Overview_page/CoinsWidget';
import SpendingsWidget from '../components/Overview_page/SpendingsWidget';
import style from '../style/Overview.module.scss'
import ModalWindow from '../components/Overview_page/ModalCryptoWindow';

import Aeternity from "../images/Overview_page/aeternity.png";
import Bitcoin   from "../images/Overview_page/bitcoin.png";
import Dash      from "../images/Overview_page/dash.png";
import Ethereum from  "../images/Overview_page/ethereum.png";
import GridCoin  from "../images/Overview_page/gridCoin.png";
import LiteCoin  from "../images/Overview_page/liteCoin.png";
import Nano      from "../images/Overview_page/nano.png";
import NavCoin   from "../images/Overview_page/navCoin.png";
import PeerCoin  from "../images/Overview_page/peerCoin.png";
import { coinsRateContext } from '../context/CoinsRate/coinsRate';
import http_change from '../hooks/http_change';
import { useDispatch, useSelector } from 'react-redux';
import { requestBalance } from "../store.js";
import CryptoGrafic from '../components/Overview_page/CryptoGrafic.jsx';
import RecentNews from '../components/Overview_page/RecentNews.jsx';




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

function Overview() {

    const [clicked, setClicked] = useState(false)
    const [modalWidgets, setModalWidgets] = useState([])
    const [userWidgets, setUserWidgets] = useState([])


  
    const [intilization, setIntilization] = useState(false)

    const user = localStorage.getItem('user')

    const {coinsRate} = useContext(coinsRateContext)

    const requestedBalance = useSelector((state) => state.requestBalance.value)

    const dispatch = useDispatch()

    useEffect(() => {

        if(requestedBalance.length === 0 ) {
    
          dispatch(requestBalance())
        }
        
    }, [dispatch, requestedBalance.length])





    useEffect(() => {

        setUserWidgets(requestedBalance[0]?.widgets) 

    }, [requestedBalance])

 

   

    
    function handleClick() {

        setClicked(!clicked)
  

    }

    useEffect(() => {

        if (coinsRate && requestedBalance[0]?.widgets) {

            setModalWidgets(
                coinsRate.filter((coin) => 
                    !requestedBalance[0].widgets.some((balance) => balance === coin.name)
                )
            );
        }
    }, [coinsRate, requestedBalance]);


    

    const addWidget = useCallback(async (id) => {

        if (user) {
            try {

                const res = await http_change("widgets", userWidgets)(id);
    
                if (res.status >= 200 && res.status < 300) {

                    if (requestedBalance[0]?.widgets.length !== userWidgets.length) {

                        dispatch(requestBalance());
                    }
                } else {

                    console.log('Ошибка: некорректный статус ответа', res.status);
                }
            } catch (err) {
                console.log('Ошибка', err);
            }
        }
    }, [userWidgets, user, dispatch, requestedBalance]);

    useEffect(() => {

        if (user){            

            const parsedUser = JSON.parse(user)
    
            if(parsedUser.id  && intilization){
    
                addWidget(parsedUser.id)
                setIntilization(false)
    
            }

        }


    }, [user, addWidget, intilization])


    return ( 

        <InnerContainer  pageName='Overview' showDate = {true} showButton = {true} buttonText={clicked ? 'Cancel' : 'Add widget'} onButtonClick={handleClick}>
            
            {  
                clicked &&   userWidgets.length <= 3 && (

                <ModalWindow header = {false} > 
                    
                    {modalWidgets.map((item) => (

                        <div onClick={() => {setUserWidgets([...userWidgets, item.name]), setIntilization(true), setClicked(!clicked)}} className={style.modalWidget} key={item.name}>

                            <img src={arrImages[item.name]} alt="" />
                            <p>{item.name}</p>

                        </div>
                    ))}
                    
                </ModalWindow> ) 

            }

            <section className={style.overview_middleSide}>


                <div className={style.balanceWidget_cont}> <BalanceWidget /></div>


                <div className={style.spendingsWidget_cont}><SpendingsWidget /></div>
                <Coinswidget clicked = {clicked}/>


            </section>



            <section className={style.overview_bottomSide}>

                <div className={style.crypto_grafic}>

                    <div className={style.cryptoGrafic_topSide}>
                        <span className={style.cryptoGrafic_topSideTitle}>Market</span>
                     
                        <p>SpectrumCoin</p>
                           
                        
                    </div>
                    <div className={style.cryptoGrafic_box}>

                        <CryptoGrafic></CryptoGrafic>

                    </div>




                </div>

                <div className={style.recentNews_box}>
                    <RecentNews />
                </div>
            </section>



        </InnerContainer>

    );
}




export default Overview;