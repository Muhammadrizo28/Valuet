import "../style/authorization.scss"
import bottom_img from "../images/Authorization_page/bottom.png"
import middle_img from "../images/Authorization_page/middle.png"
import Authorization_block from "../components/Authorization_page/SignIn_block";
import tringle_img from "../images/Authorization_page/tringle.png";
import square_img from "../images/Authorization_page/square.png"
import tringleBlue_img from "../images/Authorization_page/tringleBlue.png"
import Authorization_block2 from "../components/Authorization_page/SignUp_block";
import { useContext } from "react";
import { authorizationContext, modalanounceContext} from "../context/authorization";
import NewPassword_block from "../components/Authorization_page/NewPassword_block";
import Modal_anouncment from "../components/Modal_anouncment";

function Authorization() {

    const {signed} = useContext(authorizationContext)

    const {modalText} = useContext(modalanounceContext)


    return ( 
        
        <>
        

            <img className="bottom_img" src={bottom_img} alt="img_src" />

            <img className="middle_img" src={middle_img} alt="img-src" />


            <div className="additional_cont">

                <div className="cont">

                    {modalText.value !== '' && modalText.bull ? <Modal_anouncment modalText = {modalText}/> : modalText.value !== '' && modalText.bull === false ?  <Modal_anouncment modalText = {modalText} /> : null}
    
                    <div className="title_box">
    
                        <h1>VALUET</h1>
    
                        <div></div>
    
                        <span>Your currency dashboard</span>
                    </div>
    
                    {signed === true ? <Authorization_block /> : signed === 'newPassword' ? <NewPassword_block/> : <Authorization_block2 />}
                    <img className="tringle_img" src={tringle_img} alt="img_src" />
                    <img className="square_img" src={square_img} alt="img_src" />
                    <img className="tringleBlue_img" src={tringleBlue_img} alt="img_src" />


                </div>


            </div>

        </>

    );
}

export default Authorization;