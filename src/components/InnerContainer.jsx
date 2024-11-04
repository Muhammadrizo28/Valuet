import style from '../style/InnerCont.module.scss'
import PropTypes from 'prop-types';

function InnerContainer({children, pageName, showDate, showButton, buttonText, onButtonClick }) {


    const options = { 

        day: 'numeric', 
        month: 'long', 
        weekday: 'long' 
    };
      
    const today = new Date();
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(today);

  

    return ( 

        <div className={style.inner_container}>

            <div className={style.inner_container2}>

                <section className={style.container_topSide}>

                    <div>
                        <span style={{color: 'white'}}>{pageName}</span>
                        <span style={showDate ? {display : 'block', color: '#54669C'} : {display : 'none'}}>{formattedDate}</span>
                    </div>

                    <button onClick={() => {onButtonClick()}} style={showButton ? {display : 'block', zIndex : '3'} : {display : 'none'}}>{buttonText}</button>
                </section>

                {children}

            </div>

        </div>

    );
}


InnerContainer.propTypes = {
    
    pageName: PropTypes.string.isRequired,
    showDate : PropTypes.bool.isRequired,
    showButton: PropTypes.bool.isRequired,
    buttonText : PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    onButtonClick: PropTypes.func
    
};



export default InnerContainer;