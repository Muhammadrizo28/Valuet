import style from "../../style/Widgets/CoinsRates.module.scss";
import Proptypes from "prop-types";

import growth_img from "../../images/Overview_page/growth.png";
import reduce_img from "../../images/Overview_page/reduce.png";

function WidgetsRates({ obj }) {
    return (
        <section className={style.widgetRates_cont}>

            <nav className={style.ratesCont}>

                <div className={style.rateItem}>

                    <img src={obj.volatility[0].startsWith('+') ? growth_img : reduce_img} alt="" />
                    <div className={style.rates_txt}>

                        <span className={style.date_txt}>This week</span>
                        <span className={style.procent_txt}>{obj.volatility[0]}%</span>

                    </div>

                </div>
                
                <div className={style.rateItem}>

                    <img src={obj.volatility[1].startsWith('+') ? growth_img : reduce_img} alt="" />
                    <div className={style.rates_txt}>

                        <span className={style.date_txt}>Last week</span>
                        <span className={style.procent_txt}>{obj.volatility[1]}%</span>

                    </div>

                </div>

                <div className={style.rateItem}>
                    
                    <img src={obj.volatility[2].startsWith('+') ? growth_img : reduce_img} alt="" />
                    <div className={style.rates_txt}>

                        <span className={style.date_txt}>Last month</span>
                        <span className={style.procent_txt}>{obj.volatility[2]}%</span>

                    </div>

                </div>
            </nav>
        </section>
    );
}

WidgetsRates.propTypes = {
    obj: Proptypes.object.isRequired,
};

export default WidgetsRates;
