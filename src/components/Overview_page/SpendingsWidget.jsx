import { useContext, useEffect, useState } from "react";
import style from "../../style/Widgets/Spendings.module.scss"
import LineChart from "./Line_chart";
import { coinsRateContext } from '../../context/CoinsRate/coinsRate';
import { useSelector } from "react-redux";

function SpendingsWidget() {

    const months = [

        { 1: "January" },
        { 2: "February" },
        { 3: "March" },
        { 4: "April" },
        { 5: "May" },
        { 6: "June" },
        { 7: "July" },
        { 8: "August" },
        { 9: "September" },
        { 10: "October" },
        { 11: "November" },
        { 12: "December" }
    ];
    

    const { coinsRate } = useContext(coinsRateContext);

    const [datas, setDatas] = useState([]);
    const [totalSpending, setTotalSpending] = useState('')

    const requestedBalance = useSelector((state) => state.requestBalance.value)


    const today = new Date();
    const formattedDate = today.getMonth() + 1;

    useEffect(() => {
        if (requestedBalance[0]?.transactions) {
            setDatas([]);

            const newDates = requestedBalance[0].transactions
                .filter((item) => 
                    item.date.slice(2, 5).replace('.', '').trim() === formattedDate.toString() && item.type === 'sent'
                )
                .map((item) => {
                    const rate = coinsRate.find(rate => rate.name === item.wallet);
                    return {
                        date: parseFloat(item.date.slice(0, 2).replace('.', '').trim()),
                        number: parseFloat(item.date.slice(0, 2).replace('.', '').trim()),
                        sum: rate ? item.sum * rate.rate : 0
                    };
                });

            newDates.sort((a, b) => a.date - b.date);

            if (newDates.length > 0) {
                setDatas(newDates);
            }
        }
    }, [requestedBalance, formattedDate, coinsRate]);

    useEffect(()  => {

        setTotalSpending(datas.reduce((a , b) => a + b.sum, 0).toFixed(2))
        
    }, [datas])




    return ( 

        <div className={style.spendingsWidget}>

            <div className={style.header} >
                <h2>Spending</h2>
                <span>{months.map((item) => item[formattedDate])}</span>
            </div>

            <section className={style.totalSpend_div}>
                <h2>$  {totalSpending}</h2>
                <span>Total spending</span>
            </section>

            <section className={style.chart_cont}><LineChart datas={datas}/></section>
        </div>

    );
}

export default SpendingsWidget;