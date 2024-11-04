import { useContext, useEffect, useState } from "react";
import style from "../style/Widgets/BalancePoints.module.scss"
import { userBalanceContext } from "../context/userBalance/userBalanceContext";

function BalancePoints() {

    const {userBalance} = useContext(userBalanceContext)

    const [procents, setProcents] = useState([])

    useEffect(() => {

        if (userBalance.updatedInfo) {

            const calculatedProcents = userBalance.updatedInfo.map((item) => (

                {
                    name : item.name,
                    procent : ((item.balance / userBalance.totalBalance) * 100).toFixed(2)
                })

            );
            setProcents(calculatedProcents);
        }
    }, [userBalance.updatedInfo, userBalance.totalBalance]);

    return ( 

        <div className={style.chartOptions_div}>
    
                {procents && procents.length > 1 ? 

                    <div className={style.chartOption}>
                    <div className={style.cryptoName_div}>
                    
                        <div style={{borderRadius: '50%', backgroundColor :'rgba(1, 143, 255, 0.27)'}}>
                            <div style={{width : '55%', height : '55%', backgroundColor : 'rgba(1, 143, 255)'}}></div>
                        </div>
                    
                        <span>{procents[0].name}</span>
                    </div>
                    <span className={style.cryptoPrecent}>{procents[0].procent + '%'}</span>
                    </div> 

                    : null
                }
    
                {procents && procents.length > 2  ? 

                    <div className={style.chartOption}>
                    <div className={style.cryptoName_div}>
                    
                        <div style={{borderRadius: '50%', backgroundColor :'rgba(245, 251, 254, 0.27)'}}>
                            <div style={{width : '55%', height : '55%', backgroundColor : 'rgba(245, 251, 254)'}}></div>
                        </div>
                    
                        <span>{procents[1].name}</span>
                    </div>
                    <span className={style.cryptoPrecent}>{procents[1].procent + '%'}</span>
                    </div> 

                    : null
                }
    
                {procents && procents.length > 3  ? 

                    <div className={style.chartOption}>
                    <div className={style.cryptoName_div}>
                    
                        <div style={{borderRadius: '50%', backgroundColor :'rgba(0, 128, 85, 0.27)'}}>
                            <div style={{width : '55%', height : '55%', backgroundColor : 'rgba(0, 128, 85)'}}></div>
                        </div>
                    
                        <span>{procents[2].name}</span>
                    </div>
                    <span className={style.cryptoPrecent}>{procents[2].procent + '%'}</span>
                    </div> 

                    : null
                }
    
                {procents && procents[3] !== undefined  && procents[3].name !== null ? 

                    <div className={style.chartOption}>
                    <div className={style.cryptoName_div}>
                    
                        <div style={{borderRadius: '50%', backgroundColor :'rgba(250, 214, 121, 0.27)'}}>
                            <div style={{width : '55%', height : '55%', backgroundColor : 'rgba(250, 214, 121)'}}></div>
                        </div> 
                    
                        <span>{procents[3].name}</span>
                    </div> 
                    <span className={style.cryptoPrecent}>{procents[3].procent + '%'}</span> 
                    </div> 

                    : null
                }
    
            </div>

    );
}

export default BalancePoints;