
import "../../style/authorization.scss"
import user_img from "../../images/Authorization_page/user.png"
import lock_img from "../../images/Authorization_page/lock.png"
import pencil_img from "../../images/Authorization_page/pencil.png"
import { useContext, useState } from "react";
import { authorizationContext, modalanounceContext } from "../../context/authorization";
import http_request from "../../hooks/http_request";




function NewPassword_block() {

    const {setSigned} = useContext(authorizationContext)

    const {setModalText} = useContext(modalanounceContext)

    const {modalText} = useContext(modalanounceContext)


    const [form, setForm] = useState({login : true, password : true, name: true})


    async function checkForm(e) {

        e.preventDefault();
    
        const fm = new FormData(e.target);

        const obj = {};
    
        fm.forEach((value, key) => {

            const trimmedValue = value.trim();

            if (trimmedValue !== '') {

                obj[key] = trimmedValue;

                setForm((prevData => ({...prevData, [key] : true})))

            } else  setForm((prevData => ({...prevData, [key] : false})))
            
        });
    
    
        if (Object.keys(obj).length === 3) {

            const request = http_request();
    
            try {

                const res = await request('get', `/users?login=${obj.login}`);

                const response = res.data[0] 

                if (res.data.length > 0 ) {

                    if (response.name === obj.name) {

                        try {
    
                            const res2 = await request('patch', `/users/${response.id}`, {password : obj.password});
    
                            if (res2.status >= 200 && res2.status < 300) {

                                setSigned(true)
                                setModalText({bull : !modalText.bull, value : 'Password has changed succesfully'})
                            }
                            else console.log(res2);
                            
                            
    
                        } catch (err) {
                        console.error(err); }


                    }
                    else setForm(prevData => ({...prevData, name : false})) 

                }
                else setForm(prevData => ({...prevData, login : false})) 
                
  
            } 
            catch (err) {
                console.error(err); 
            }
        } else console.log(obj);
        
    }

    return ( 

        <div className="authorization_block">

            <h1>Welcome!</h1>

            <form className="form2" onSubmit={(e) => checkForm(e)}>

                <div className="inputHoverBox">

                    <div className="input_box">
                    
                        <div className="input_imgBox">
    
                            <div><img className="pencil_img" src={pencil_img} alt="img_src" /></div>
    
                        </div>
                        <input name="name" type="text" placeholder="Full name"   onChange={(e) => {e.target.value.trim() !== '' ? setForm(prevData => ({...prevData, name : true})) : setForm(prevData => ({...prevData, name : false}))}}/>
                    
                    </div>

                    <div className={form.name ? "inputLineHover" : "inputLineRed"}></div>

                </div>


                <div className="inputHoverBox">

                    <div className="input_box2">
                    
                        <div className="input_imgBox">
    
                            <div><img src={user_img} alt="img_src" /></div>
    
                        </div>
                        <input name="login" type="text" placeholder="E-mail or Login"  onChange={(e) => {e.target.value.trim() !== '' ? setForm(prevData => ({...prevData, login : true})) : setForm(prevData => ({...prevData, login : false}))}}/>

                    
                    </div>

                    <div className={form.login ? "inputLineHover" : "inputLineRed"}></div>

                </div>


                <div className="inputHoverBox">

                    <div className="input_box3">
                 
                        <div className="input_imgBox">
    
                            <div> <img src={lock_img} alt="img_src"/></div> 
                        
                        </div>
                        <input name="password" type="password" className="passwordInput" placeholder="New password"  onChange={(e) => {e.target.value.trim() !== '' ? setForm(prevData => ({...prevData, password : true})) : setForm(prevData => ({...prevData, password : false}))}}/>
                   
                    </div>

                    <div className={form.password ? "inputLineHover" : "inputLineRed"}></div>

                </div>


              
                <div className="buttons_block2">
                    <button type="submit" className="signIn_button" >CHANGE</button>
                    <button type="button" className="signUp_button" onClick={() => {setSigned(true)}}>SIGN IN</button>
                </div>
            </form>

        </div>

    );
}

export default NewPassword_block;