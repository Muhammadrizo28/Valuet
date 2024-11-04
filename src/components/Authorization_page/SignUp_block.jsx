
import "../../style/authorization.scss"
import user_img from "../../images/Authorization_page/user.png"
import lock_img from "../../images/Authorization_page/lock.png"
import pencil_img from "../../images/Authorization_page/pencil.png"
import { useContext, useState } from "react";
import { authorizationContext } from "../../context/authorization";
import { modalanounceContext } from "../../context/authorization";
import http_request from "../../hooks/http_request";


function SignUp_block() {

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

                if(key === 'name' ) {
                    
                    let fullName = value.trim().split(' ')

                    if(fullName.length < 2) {

                        setForm((prevData => ({...prevData, [key] : false}))) 
                        setModalText({bull : !modalText.bull, value : 'Please enter full name'})

                    }
                    else {

                        obj[key] = trimmedValue;
                        setForm((prevData => ({...prevData, [key] : true})))

                    }

                }
                else {

                    obj[key] = trimmedValue;
    
                    setForm((prevData => ({...prevData, [key] : true})))

                }


            } else  setForm((prevData => ({...prevData, [key] : false})))
            
        });
    
    
        if (Object.keys(obj).length === 3) {

            const request = http_request();
    
            try {

                const res = await request('get', `/users?login=${obj.login}`);

                if (res.data.length === 0) {

                    try {

                        const res2 = await request('post', '/users', {...obj, "widgets" : [], "wallets" : [], "transactions" : []});

                        if (res2.status >= 200 && res2.status < 300 ) {

                            setSigned(true)
                            setModalText({bull : !modalText.bull, value : 'Signed Up succesfully'})
                        }
                        else console.log(res2);
                        
                        

                    } catch (err) {
                    console.error(err); }

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
    
                            <div> <img src={lock_img} alt="img_src" /></div> 
                        
                        </div>
                        <input name="password" type="password" className="passwordInput" placeholder="Password"  onChange={(e) => {e.target.value.trim() !== '' ? setForm(prevData => ({...prevData, password : true})) : setForm(prevData => ({...prevData, password : false}))}}/>
                   
                    </div>

                    <div className={form.password ? "inputLineHover" : "inputLineRed"}></div>

                </div>


              
                <div className="buttons_block2">
                    <button type="submit" className="signIn_button" >SIGN UP</button>
                    <button type="button" className="signUp_button" onClick={() => {setSigned(true)}}>SIGN IN</button>
                </div>
            </form>

            <span className="forgotPassword_txt2" onClick={() => {setSigned('newPassword')}}>Forgot your password?</span>

        </div>

    );
}

export default SignUp_block;