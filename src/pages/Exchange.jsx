import InnerContainer from '../components/InnerContainer'
import style from '../style/Exchange.module.scss'
import blueNarrow_img from '../images/Exchabge_page/image.png'
import Selector from '../components/Selector'
import { useCallback, useContext, useEffect, useState } from 'react';
import {userBalanceContext} from '../context/userBalance/userBalanceContext'
import {coinsRateContext} from '../context/CoinsRate/coinsRate'
import http_change from '../hooks/http_change'


import Aeternity from "../images/Overview_page/aeternity.png";
import Bitcoin   from "../images/Overview_page/bitcoin.png";
import Dash      from "../images/Overview_page/dash.png";
import Ethereum from "../images/Overview_page/ethereum.png";
import GridCoin  from "../images/Overview_page/gridCoin.png";
import LiteCoin  from "../images/Overview_page/liteCoin.png";
import Nano      from "../images/Overview_page/nano.png";
import NavCoin   from "../images/Overview_page/navCoin.png";
import PeerCoin  from "../images/Overview_page/peerCoin.png";

function Exchange() {

    const selectorStyle = {
        position: 'relative',
        width: '100%', 
        backgroundColor: 'transparent',
        height: '100%',
        cursor: 'pointer',
        padding: '0',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '0',
        borderRadius: '0'
    };

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
        Peercoin: "PPC",
    };


    const {userBalance, getWallets} = useContext(userBalanceContext)
    const {coinsRate} = useContext(coinsRateContext)
    const [wallets, setWallets] = useState([])
    const [userWallets, setUserWallets] = useState([])
    const [allow , setAllow] = useState(null)
    const [redLine, setRedLine] = useState(false)
    const [leftCoin, setLeftCoin] = useState('Select')
    const [rightCoin, setRightCoin] = useState('Select')

    const [updatedWallets, setUpdatedWallets] = useState([])

    const user = JSON.parse(localStorage.getItem('user')).id

    

    const [leftSidePrise, setLeftSidePrise] = useState(0)

    const [rightSidePrise, setRightSidePrise] = useState(0)

    

    useEffect(() => {

        if(userBalance.userWallets){

            setUserWallets(userBalance.userWallets)
        }
    },[userBalance.userWallets])

    useEffect(() => {

        if(coinsRate) {

            setWallets(coinsRate.map((item) => item.name))
        }
    }, [coinsRate])


    const leftCoinFunc = (lCoin) => {

        setLeftCoin(lCoin);
        setLeftSidePrise(0); 
    }
    
    const rightCoinFunc = (rCoin) => {
        
        setRightCoin(rCoin);
        setRightSidePrise(0); 
    }
    


    function exchangeCoins({value, coin}) {

        const regex = /^[0-9.]*$/;

        if(regex.test(value)) {

            let newValue = value; 

                if (newValue.split('.').length - 1 <= 1 && newValue.slice(0, 2) !== '00') {

                    if (newValue.startsWith('0') && newValue.length > 1 && newValue[1] !== '.') {
                        newValue = '0.' + newValue.slice(1);
                    }
                
                    if (newValue.includes('.')) {

                        coin === 'right' ? setRightSidePrise(newValue.slice(0, 7)) : setLeftSidePrise(newValue.slice(0, 7))
                         
                    } else {

                        coin === 'right' ? setRightSidePrise(newValue.slice(0, 3)) : setLeftSidePrise(newValue.slice(0, 3))
                    }
                }
        }
        
    }
    
    useEffect(() => {

        if(coinsRate && leftSidePrise >= 0 && allow === false) {

            setRightSidePrise(Number((leftSidePrise * coinsRate.find((item) => item.name === leftCoin)?.rate / coinsRate.find((item) => item.name === rightCoin)?.rate).toFixed(5)))

        }

        leftSidePrise > userWallets.find((item) => item.name === leftCoin)?.balance ? setRedLine(true) : setRedLine(false)
           
        
    }, [leftSidePrise, leftCoin, rightCoin, coinsRate, allow, redLine, userWallets])

    useEffect(() => {

        if(coinsRate && rightSidePrise >= 0 && allow === true) {

            setLeftSidePrise(Number((rightSidePrise * coinsRate.find((item) => item.name === rightCoin)?.rate / coinsRate.find((item) => item.name === leftCoin)?.rate).toFixed(5)))

        }

    }, [rightSidePrise, leftCoin, rightCoin, coinsRate, allow])



  
    function buttonClickFunc() {
        if (leftSidePrise > 0 && rightSidePrise > 0 && redLine === false && leftCoin !== rightCoin) {
            const neededWallets = userWallets.filter((item) => item.name !== leftCoin);
    
            if (neededWallets.find((item) => item.name === rightCoin)) {
                setUpdatedWallets([
                    ...neededWallets.filter((item) => item.name !== rightCoin),
                    {
                        name: leftCoin,
                        balance: Number((Number(userWallets.find((item) => item.name === leftCoin)?.balance) - Number(leftSidePrise)).toFixed(6))
                    },
                    {
                        name: rightCoin,
                        balance: Number((Number(rightSidePrise) + Number(neededWallets.find((item) => item.name === rightCoin).balance)).toFixed(6))
                    }
                ]);
            } else {
                setUpdatedWallets([
                    ...neededWallets,
                    {
                        name: leftCoin,
                        balance: Number((Number(userWallets.find((item) => item.name === leftCoin)?.balance) - Number(leftSidePrise)).toFixed(6))
                    },
                    {
                        name: rightCoin,
                        balance: Number((Number(rightSidePrise)).toFixed(7))
                    }
                ]);
            }
    
        }
    }
    
    const updateDataTransactions = useCallback(async () => {

        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth() + 1; 
        const year = today.getFullYear();
        
        const formattedDate = `${day}.${month}.${year}`;

        const transactions = userBalance.transactions

        const newTransaction = {

            wallet : rightCoin,
            sum : rightSidePrise,
            date : formattedDate,
            type : 'exchange',
            walletAdress : `${leftSidePrise} ${leftCoin} to ${rightCoin}`,
            userName : 'Exchanged'
        }
        try {

            const res = await http_change('transactions', [...transactions, newTransaction])(user);
            
            if (res.status >= 200 && res.status < 300) {

                setUpdatedWallets([]); 
                getWallets()
                setLeftSidePrise(0);
                setRightSidePrise(0);

            } else {

                console.log('Error');
            }
        } catch (err) {
            console.log(err);
        }
    }, [leftCoin, rightCoin, getWallets, rightSidePrise, user, userBalance.transactions, leftSidePrise]);


    const updateData = useCallback(async () => {
        try {

            const res = await http_change('wallets', updatedWallets)(user);
            
            if (res.status >= 200 && res.status < 300) {

                updateDataTransactions()

            } else {

                console.log('Error');
            }
        } catch (err) {
            console.log(err);
        }
    }, [updatedWallets, user, updateDataTransactions]);
    
    useEffect(() => {

        if (updatedWallets.length > 0) {

            updateData();
        }

    }, [updatedWallets, updateData]);
    
    
    return ( 
        <InnerContainer pageName='Exchange' showButton={false} showDate={false} buttonText=''>
            <div className={style.exchange_cont}>
                <div className={style.exchange_box}>
                    <div className={style.exchange_coinsBox}>

                        <div className={style.coinBox} >

                            <span>{leftSidePrise} &nbsp; {arrShort[leftCoin]}</span>
                            <div>{leftCoin !== 'Select'? <img src={arrImages[leftCoin]} alt="" /> : null}</div>

                        </div>

                        <img src={blueNarrow_img} alt="" />

                        <div className={style.coinBox}>

                            <div>{rightCoin !== 'Select'? <img src={arrImages[rightCoin]} alt="" /> : null}</div>
                            <span>{rightSidePrise} &nbsp; {arrShort[rightCoin]}</span>

                        </div>

                    </div>

                    <div className={style.exchange_inputBox}>

                        <div className={style.input_box}>
                            <div className={style.exchange_info}>
                                <input onChange={(e) => {exchangeCoins({'value' : e.target.value, 'coin' : 'left'}), setAllow(false)}} value={leftSidePrise} placeholder='0' type="text" />
                                <div className={style.selectorBox}>
                                    <Selector main={leftCoin}  options={userWallets.length > 0 ? userWallets.map((item) => item.name) : ['Loading']} customStyles = {selectorStyle} arrowSize={{width : '20%'}} onDataChange={leftCoinFunc}></Selector>
                                </div>

                            </div>
                            <div className={!redLine ? style.exchange_line : style.redLine}></div>
                            <span className={!redLine ? style.balance_txt : style.balance_txt2}>Balance : {userWallets.find((item) => item.name === leftCoin)?.balance ? Number(userWallets.find((item) => item.name === leftCoin)?.balance)  : 0 } {arrShort[leftCoin]}</span>
                        </div>


                        <div className={style.input_box}>
                            <div className={style.exchange_info}>
                                <input onChange={(e) => {exchangeCoins({'value' : e.target.value, 'coin' : 'right'}), setAllow(true)}} value={rightSidePrise} placeholder='0' type="text" />
                                <div className={style.selectorBox}>
                                    <Selector main={rightCoin} options={wallets.length > 0 ? wallets.map((item) => item) : ['Loading']} customStyles = {selectorStyle} arrowSize={{width : '20%'}} onDataChange={rightCoinFunc}></Selector>
                                </div>

                            </div>
                            <div className={style.exchange_line}></div>
                            <span className={style.balance_txt}>Balance : {userWallets.find((item) => item.name === rightCoin)?.balance ? Number(userWallets.find((item) => item.name === rightCoin)?.balance) : 0} {arrShort[rightCoin]}</span>
                        </div>


                    </div>
                    <button onClick={() => {buttonClickFunc()}} className={style.exchange_button}>Exchange</button>

                </div>
            </div>
        </InnerContainer>
    );
}

export default Exchange;