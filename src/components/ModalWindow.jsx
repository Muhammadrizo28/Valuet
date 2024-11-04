import style from "../style/ModalWind.module.scss"
import ex_img from "../images/Overview_page/ex.png"
import PropTypes from 'prop-types'
import loop_img from "../images/notFound.png"
import { useNavigate } from "react-router-dom"

function ModalWindow({click, type}) {

    const navigate = useNavigate()


    return ( 

        <div className={style.modalWindow_box}>

            <div className={style.modalBox}>
                <div className={style.modalHeader}><img onClick={click} src={ex_img} alt="" /></div>


                <div className={style.modalMain_box}>
    
                {type === 'email' || type === 'bell' ? 

                    <div style={{display : 'flex', flexDirection : 'column', alignItems : 'center', gap : '5%', width: "100%", height : "100%"}} >

                        <img style={{width : '30%', height : '30%', marginTop : '20%'}} src={loop_img} alt="" />
                        <span className={style.modalText}>{type === 'email' ? 'No messages yet ...' : 'No notifications yet ...'}</span>

                    </div> : type === 'logOut' ?

                    <div style={{display : "flex", flexDirection : "column", alignItems : "center"}}>
                        <h1 className={style.logoutText}>Are you sure ?</h1>
                        <button onClick={() => {click, localStorage.clear(), navigate('/authorization'), location.reload(true)}} className={style.logoutButton}>Log Out</button>
                    </div> : null
    
                }
    
                </div>

            </div>



        </div>

    );
}

ModalWindow.propTypes = {

    click : PropTypes.func,
    type : PropTypes.string
}

export default ModalWindow;