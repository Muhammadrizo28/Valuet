import { useContext, useEffect, useState } from "react";
import BalancePoints from "../components/BalancePoints";
import InnerContainer from "../components/InnerContainer";
import style from '../style/Wallets.module.scss';
import { userBalanceContext } from "../context/userBalance/userBalanceContext";
import { coinsRateContext } from "../context/CoinsRate/coinsRate";
import ModalCryptoWindow from '../components/Overview_page/ModalCryptoWindow';

import Aeternity from "../images/Overview_page/aeternity.png";
import Bitcoin from "../images/Overview_page/bitcoin.png";
import Dash from "../images/Overview_page/dash.png";
import Ethereum from "../images/Overview_page/ethereum.png";
import GridCoin from "../images/Overview_page/gridCoin.png";
import LiteCoin from "../images/Overview_page/liteCoin.png";
import Nano from "../images/Overview_page/nano.png";
import NavCoin from "../images/Overview_page/navCoin.png";
import PeerCoin from "../images/Overview_page/peerCoin.png";
import lines from "../images/Wallets/image.png";
import http_change from "../hooks/http_change";
import ex_img from "../images/Overview_page/ex.png"
import BalanceLineChart from "../components/Wallets_page/BalanceLineChart";
import RecentTransactions from "../components/Wallets_page/RecentTransactions";

function Wallets() {
    const { userBalance } = useContext(userBalanceContext);
    const {getWallets} = useContext(userBalanceContext)
    const { coinsRate } = useContext(coinsRateContext);
    

    const [wallets, setWallets] = useState([]);
    const [buttonClick, setButtonClick] = useState(false);
    const [addWallets, setAddWallets] = useState([]);
    const [selectedWallet, setSelectedWallet] = useState(null); 
    const [inputValue, setInputValue] = useState(""); 
    const [deleteWallet, setDeleteWallet] = useState('')
    const [totalIncome, setTotalIncome] = useState('')
    
    const [datas, setDatas] = useState([]);

    const user = localStorage.getItem('user')

    const userId = JSON.parse(user).id

    const months = [

        "January" ,
        "February" ,
        "March" ,
        "April" ,
        "May" ,
        "June" ,
        "July" ,
        "August" ,
        "September" ,
         "October" ,
         "November" ,
         "December" 
    ];

    const today = new Date();
    const formattedDate = today.getMonth() ;

    
    const arrImages = {
        Aeternity,
        Bitcoin,
        Dash,
        Ethereum,
        GridCoin,
        Litecoin: LiteCoin,
        Nano,
        Navcoin: NavCoin,
        Peercoin: PeerCoin,
    };

    useEffect(()  => {

        setTotalIncome(datas.reduce((a , b) => a + b.sum, 0).toFixed(2))
        
    }, [datas])

    function getDatas(info) {

        setDatas(info)

    }

    useEffect(() => {
        if (userBalance.userWallets && coinsRate) {
            setWallets(
                userBalance.userWallets
                    .map((item) => {
                        const rate = coinsRate.find((rate) => rate.name === item.name);
                        return rate ? { name: item.name, volatility: rate.volatility[0], balance: item.balance * rate.rate } : null;
                    })
                    .filter(Boolean)
            );

            const existingNames = userBalance.userWallets.map((item) => item.name);
            setAddWallets(
                coinsRate
                    .filter((rate) => !existingNames.includes(rate.name))
                    .map((rate) => rate.name)
            );
        }
    }, [userBalance, coinsRate]);

    function click() {
        setButtonClick(!buttonClick);
    }

    function handleSelect(walletName) {
        setSelectedWallet((prev) => (prev === walletName ? null : walletName ));
    }

    function handleInputChange(e) {
        const value = e.target.value;
        const regex = /^[0-9.]*$/;
    
        if (regex.test(value)) {
            if (selectedWallet === "Bitcoin" || selectedWallet === "Ethereum") {
                const formattedValue = parseFloat(`0.${value.replace(/^0+/, '') || "0"}`);
                setInputValue(formattedValue);                
            } else {

                let newValue = value; 

                if (newValue.split('.').length - 1 <= 1 && newValue.slice(0, 2) !== '00') {

                    if (newValue.startsWith('0') && newValue.length > 1 && newValue[1] !== '.') {
                        newValue = '0.' + newValue.slice(1);
                    }
                
                    if (newValue.includes('.')) {
                        setInputValue(newValue.slice(0, 6)); 
                    } else {
                        setInputValue(newValue.slice(0, 2)); 
                    }
                }

            }
        }
    }

    
    

    async function addWalletFunc() {

        if(selectedWallet && inputValue > 0) {

            const newWallets = [
    
                ...userBalance.userWallets,
                {name : selectedWallet,
                balance : Number(inputValue)}
    
            ]
        
            try {
    
                const res = await http_change('wallets', newWallets)(userId)
    
                if(res.status >= 200 && res.status < 300) {
                    setButtonClick(false)
                    setInputValue(0) 
                    getWallets()   
                }
                else {
                    console.log(res.status);
                    
                }
    
            }
            catch(err) {console.log(err);
            }  


        }
    }


    async function deleteWalletFunc() {
        if (deleteWallet !== '') { 
    
            const newWallets = userBalance.userWallets.filter((item) => item.name !== deleteWallet);
    
            try {
                const res = await http_change('wallets', newWallets)(userId);
    
                if (res.status >= 200 && res.status < 300) {
                    setDeleteWallet(''); 
                    getWallets(); 
                } else {
                    console.log(res.status); 
                }
            } catch (err) {
                console.log(err); 
            }
        }
    }
    



    useEffect(() => {

        if(deleteWallet !== '') {

            deleteWalletFunc()
 
        }
    })

    return ( 
        <InnerContainer 
            pageName='Wallets' 
            showDate={false} 
            showButton={true} 
            buttonText={buttonClick ? 'Cancel' : 'Add wallet'} 
            onButtonClick={click}
        >
            {buttonClick && addWallets.length > 0 && (
                <ModalCryptoWindow header={false} grid={false}>
                    <div className={style.addWalletBox}>
                        <div className={style.walletGridBox}>
                            {addWallets.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleSelect(item)}
                                    className={`${style.addWallet_item} ${selectedWallet === item ? style.selected : ''}`}
                                >
                                    <img src={arrImages[item]} alt={item} />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                        <div className={style.walletAddBottom}>
                            <span>Number of coins :</span>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={handleInputChange}
                                maxLength="6" 
                            />
                            <button onClick={() => {inputValue && selectedWallet ? addWalletFunc() : null}}>Add</button>
                        </div>
                    </div>
                </ModalCryptoWindow>
            )}

            <div className={style.wallets_cont}>
                <div className={style.wallets_topSide}>
                    <div className={style.wallets_balanceBox}>
                        <h2>Total balance : <span className={style.userBalance_txt}> {userBalance.totalBalance}$</span></h2>
                        <BalancePoints />
                    </div>

                    <div className={style.walletsBox}>
                        {wallets.map((item) => (
                            <div
                                className={style.wallet_item}
                                key={item.name}
                            
                            >
                                <div className={style.wallet_itemTopSide}>
                                    <img onClick={() => setDeleteWallet(item.name)} className={style.wallet_itemEx} src={ex_img} alt="" />
                                    <span className={style.walletName_txt}>{item.name}</span>
                                    <div className={style.wallet_info}>
                                        <div className={style.wallet_infoText}>
                                            <h2>{parseFloat(item.balance.toFixed(3))} USD</h2>
                                            <span>{item.volatility}%</span>
                                        </div>
                                        <div className={style.wallet_circle}>
                                            <img className={style.wallets_img} src={arrImages[item.name]} alt="" />
                                        </div>
                                    </div>
                                </div>
                                <img className={style.wallet_linesImg} src={lines} alt="" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className={style.wallets_midleSide}>

                    <div className={style.wallets_BalanceChart_cont}>

                        <div className={style.wallets_chartInfoBox}>

                            <div className={style.wallets_ChartText_box}>

                                <h1>Income</h1>

                                <span>Total Income : ${totalIncome}</span>

                            </div>


                            <span>{months[formattedDate]}</span>

                        </div>

                        <div className={style.walletsChart_box}>

                            <BalanceLineChart func={getDatas}></BalanceLineChart>

                        </div>

                    </div>

                    <div className={style.wallets_recentTransactions_cont}>
                        <RecentTransactions></RecentTransactions>
                    </div>

                </div>
            </div>
        </InnerContainer>
    );
}

export default Wallets;
