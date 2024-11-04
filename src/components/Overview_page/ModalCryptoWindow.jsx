import style from "../../style/Widgets/ModalWindow.module.scss"
import ex_img from '../../images/Overview_page/ex.png'
import PropTypes from "prop-types"

function ModalCryptoWindow({children, header, grid = true}) {


    return ( 

        <div  className={style.ModalContainer}>

            <div className={style.modalWindow}>
                {
                    header &&
                    <div className={style.modalWindow_header}><img style={{width : '26px', height : "26px", marginRight: "1%"}} src={ex_img} alt="" /></div>
                }

                <div className={grid ? style.gridModal_window : style.noGrid_window}>{children}</div>
            </div>
            

        </div>
    );

}

ModalCryptoWindow.propTypes = {

    children : PropTypes.node,
    header : PropTypes.bool,
    grid : PropTypes.bool
}

export default ModalCryptoWindow;