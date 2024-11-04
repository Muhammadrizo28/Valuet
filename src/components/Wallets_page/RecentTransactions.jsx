import { useContext, useEffect, useRef, useState } from "react";
import style from "../../style/Wallets/RecentTran.module.scss";
import { userBalanceContext } from "../../context/userBalance/userBalanceContext";
import redNarrrow from "../../images/Transactions/RedNarrow.png";
import greenNarrrow from "../../images/Transactions/greenNarrow.png";
import narrowDown from "../../images/Overview_page/narrowDown.png";

function RecentTransactions() {
    const [transactions, setTransactions] = useState([]);
    const { userBalance } = useContext(userBalanceContext);
    const recentTranBoxRef = useRef(null);
    const [scrollDirection, setScrollDirection] = useState('down');
    

    useEffect(() => {
        const today = new Date();
        if (userBalance.transactions) {
            const arr = userBalance.transactions.filter((item) => {
                const itemMonth = item.date.split('.')[1];
                const itemDay = Number(item.date.slice(0, 2));

                return (
                    itemMonth === String(today.getMonth() + 1).padStart(2, '0') &&
                    itemDay + 5 > today.getDate()
                );
            });

      
            const sortedArr = arr.sort((a, b) => {
                const dateA = new Date(a.date.split('.').reverse().join('-')); 
                const dateB = new Date(b.date.split('.').reverse().join('-'));
                return dateB - dateA; 
            });

            setTransactions(sortedArr);
        }
    }, [userBalance.transactions]);

    const scrollTransactions = (percentage) => {
        if (recentTranBoxRef.current) {
            const box = recentTranBoxRef.current;
            const currentScroll = box.scrollTop;

            const scrollHeight = box.scrollHeight - box.clientHeight;

            const pixelsToScroll = (scrollHeight * percentage) / 100;

            if (scrollDirection === 'down') {
                box.scrollTo({
                    top: currentScroll + pixelsToScroll,
                    behavior: 'smooth' 
                });

              
                if (currentScroll + pixelsToScroll >= scrollHeight) {
                    setScrollDirection('up'); 
                }
            } else {
                box.scrollTo({
                    top: currentScroll - pixelsToScroll,
                    behavior: 'smooth' 
                });

                if (currentScroll - pixelsToScroll <= 0) {
                    setScrollDirection('down');
                }
            }
        }
    };

    const handleScroll = () => {
        scrollTransactions(50);
    };

    return (
        <div className={style.recentTran_cont}>
            <div className={style.recentTran_header}>
                <h4>RECENT TRANSACTIONS</h4>
            </div> 

            <div className={scrollDirection === 'down' ? style.scroller_div : style.scroller_div2} onClick={handleScroll}>
                <img className={scrollDirection === 'down' ? style.imgDown : style.imgUp} src={narrowDown} alt="" />
            </div>
            <div className={style.recentTran_box} ref={recentTranBoxRef}>
                {transactions.map((item, index) => (
                    <div className={style.recentTran_item} key={index}>
                        <div className={style.firstBox_info}>
                            <span>{item.date.split('.').slice(0, 2).join('.')}</span>

                            <div className={style.recentTran_circle}>
                                <img src={item.type === 'sent' ? redNarrrow : greenNarrrow} alt="" />
                            </div>
                        </div>

                        <div className={style.secondBox_info}>
                            <div className={style.recentTran_textBox}>
                                <span className={style.recentTran_wallet}>
                                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)} {item.wallet}
                                </span>
                                <span className={style.recentTran_person}>{item.userName}</span>
                            </div>

                            <span className={style.recentTran_quentity}>
                                {item.type === 'sent' ? "-" + item.sum : "+" + item.sum}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RecentTransactions;
