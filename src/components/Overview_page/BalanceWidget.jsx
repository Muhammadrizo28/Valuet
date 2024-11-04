import { useContext} from 'react';
import style from '../../style/Widgets/Balance.module.scss'
import DoughnutChart from './Doughnut_chart';
import { userBalanceContext } from '../../context/userBalance/userBalanceContext';
import BalancePoints from '../BalancePoints';


function BalanceWidget() {

    const {userBalance} = useContext(userBalanceContext)

    
    return ( 

        <div className={style.balanceWidget}> 


            <div className={style.chartContainer}>
    
    
                <div className={style.balanceContainer}>
                    <p>Balance</p>
                    <span>{userBalance.totalBalance !== undefined ? userBalance.totalBalance + '$' : '0 $'}</span>
    
                </div>
    
    
                <DoughnutChart />
                    
            </div>

            <BalancePoints />
    
           


        </div>
    );
}

export default BalanceWidget;