import style from '../style/Transactions.module.scss'
import { useContext, useEffect, useState } from "react";
import InnerContainer from "../components/InnerContainer";
import { userBalanceContext } from '../context/userBalance/userBalanceContext';
import html2canvas from 'html2canvas';


import Aeternity from "../images/Overview_page/aeternity.png";
import Bitcoin   from "../images/Overview_page/bitcoin.png";
import Dash      from "../images/Overview_page/dash.png";
import Ethereum from "../images/Overview_page/ethereum.png";
import GridCoin  from "../images/Overview_page/gridCoin.png";
import LiteCoin  from "../images/Overview_page/liteCoin.png";
import Nano      from "../images/Overview_page/nano.png";
import NavCoin   from "../images/Overview_page/navCoin.png";
import PeerCoin  from "../images/Overview_page/peerCoin.png";
import greenNarrow_img from '../images/Transactions/greenNarrow.png'
import redNarrow_img from '../images/Transactions/RedNarrow.png'
import exchange_img from '../images/Transactions/exchange.png'


function Transactions() {

    const {userBalance} = useContext(userBalanceContext)
    const [allTr, setAllTr] = useState([])
    const [sentTr, setSentTr] = useState([])
    const [exchangeTr, setExchangeTr] = useState([])
    const [recievedTr, setRecievedTr] = useState([])
    const [numberTr, setNumberTr] = useState({})
    const [choosen, setChoosen] = useState('all')

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

    const arrShort = {
        Aeternity: "AE",
        Bitcoin: "BTC",
        Dash: "DASH",
        Ethereum: "ETH",
        GridCoin: "GRC",
        Litecoin: "LTC",
        Nano: "NANO",
        Navcoin: "NAV",
        Peercoin: "PPC"
    };
    


    useEffect(() => {

        if(userBalance.transactions) {

            setSentTr(userBalance.transactions.filter((item) => item.type === 'sent'))
            setRecievedTr(userBalance.transactions.filter((item) => item.type === 'recieved'))
            setExchangeTr(userBalance.transactions.filter((item) => item.type === 'exchange'))
            setAllTr(userBalance.transactions)
        }

    }, [userBalance.transactions])

    useEffect(() => {
        setNumberTr(
            {
                'all' : allTr.length,
                'sent' : sentTr.length,
                'recieved' : recievedTr.length
            }
        )
    }, [allTr, sentTr, recievedTr])


    function exportHistoryAsImage() {

        const element = document.querySelector(`.${style.transactions_box}`);
        const originalOverflow = element.style.overflow;
        const originalHeight = element.style.height;
        
        if (element) {
          const originalBackgroundColor = element.style.backgroundColor;
          element.style.backgroundColor = '#130742'; 
          element.style.overflow = 'visible';
          element.style.height = 'auto';
      
          html2canvas(element).then((canvas) => {
            element.style.backgroundColor = originalBackgroundColor;
            element.style.overflow = originalOverflow;
            element.style.height = originalHeight;
            
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'transaction_history.png';
            link.click();
          });
        }
    }

    
      
      
    
    return ( 

        <InnerContainer pageName="Transactions" showDate = {false} showButton = {true} buttonText='Export History' onButtonClick={exportHistoryAsImage} >
             
            <div className={style.transactions_cont}>
                <div className={style.transactions_topSide}>
                    <h3>Total {numberTr[choosen]}</h3>

                    <div className={style.transactions_navigation}>
                        <div onClick={() => setChoosen('all')}      className={choosen === 'all' ? style.clicked : style.navigation_item}><span>All</span><div></div></div>
                        <div onClick={() => setChoosen('sent')}     className={choosen === 'sent' ? style.clicked : style.navigation_item}><span>Sent</span><div></div></div>
                        <div onClick={() => setChoosen('recieved')} className={choosen === 'recieved' ? style.clicked : style.navigation_item}><span>Recieved</span><div></div></div>
                        <div onClick={() => setChoosen('exchange')} className={choosen === 'exchange' ? style.clicked : style.navigation_item}><span>Exchanges</span><div></div></div>
                    </div>
                </div>

                <div className={style.transactions_box}>
                    {
                        (choosen === 'sent' ? sentTr : choosen === 'recieved' ? recievedTr : choosen === 'exchange' ? exchangeTr : allTr).map((item, index) => (

                            <div className={style.transaction_item} key = {index}>

                                <div className={style.transaction_itemTop}>
                                    <span>
                                        {(() => {
                                            const [day, month, year] = item.date.split('.'); 
                                            const formattedDate = new Date(year, month - 1, day);
                                    
                                            const dateString = formattedDate.toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            });
                                    
                                            const [dayStr, monthStr, yearStr] = dateString.split(' '); 
                                            return `${dayStr} ${monthStr.toLowerCase()} ${yearStr}`; 
                                        })()}
                                    </span>

                                    <div className={style.transaction_itemCircle}><img src={arrImages[item.wallet]} alt="" /></div>

                                </div>

                                <div className={item.type === 'exchange' ? style.transaction_itemMiddle2 : style.transaction_itemMiddle}>
                                    <img src={item.type === "sent" ? redNarrow_img : item.type === 'exchange' ? exchange_img : greenNarrow_img} alt="" />
                                    <span>{item.walletAdress}</span>
                                </div>
                                <div className={style.transaction_itemBottom}>
                                    <span>{item.sum + ' ' + arrShort[item.wallet]}</span>
                                    <div>Completed</div>
                                </div>

                            </div>
                        ))
                    }
                </div>
            </div>
        </InnerContainer>
    );
}

export default Transactions;