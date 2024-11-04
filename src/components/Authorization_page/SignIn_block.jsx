import "../../style/authorization.scss"
import user_img from "../../images/Authorization_page/user.png"
import lock_img from "../../images/Authorization_page/lock.png"
import { useContext, useState } from "react";
import { authorizationContext } from "../../context/authorization";
import Http_request from "../../hooks/http_request";
import { useNavigate } from "react-router-dom";


function SignIn_block() {

    const {setSigned} = useContext(authorizationContext)

    const [form, setForm] = useState({login : true, password : true})

    const navigate = useNavigate()

    
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
    
    
        if (Object.keys(obj).length === 2) {

            const request = Http_request();
    
            try {

                const res = await request('get', `/users?login=${obj.login}`);

                const response = res.data[0] 

                if (response.password === obj.password) {

                    const userData = {

                        name : response.name,
                        id : response.id
                    }

                    

                    localStorage.setItem('signedIn', 'true');
                    localStorage.setItem('user', JSON.stringify(userData));
                    navigate('/');

                } else setForm(prevData => ({...prevData, password : false}));
                
                
            } catch (err) { 

                setForm(prevData => ({...prevData, login : false}))
            
            }
        } else console.log(obj);
        
    }
    


    return ( 

        <div className="authorization_block">

            <h1>Welcome!</h1>

            <form onSubmit={(e) => {checkForm(e)}}>

                <div className="inputHoverBox">

                    <div className="input_box">
                    
                        <div className="input_imgBox">
    
                            <div><img src={user_img} alt="img_src" /></div>
    
                        </div>
                        <input name="login" type="text" placeholder="E-mail or Login"  onChange={(e) => {e.target.value.trim() !== '' ? setForm(prevData => ({...prevData, login : true})) : setForm(prevData => ({...prevData, login : false}))}}/>

                    </div>

                    <div className={form.login ? "inputLineHover" : "inputLineRed"}></div>

                </div>


                <div className="inputHoverBox">


                    <div className="input_box2">
                 
                        <div className="input_imgBox">
    
                            <div> <img src={lock_img} alt="img_src" /> </div> 
                        
                        </div>
                        <input className="passwordInput" name="password" type="password"  placeholder="Password" onChange={(e) => {e.target.value.trim() !== '' ? setForm(prevData => ({...prevData, password : true})) : setForm(prevData => ({...prevData, password : false}))}} />
                   
                    </div>

                    <div className={form.password? "inputLineHover" : "inputLineRed"}></div>

                </div>


              
                <div className="buttons_block">
                    <button type="button" className="signUp_button" onClick={() => {setSigned(false)}}>SIGN UP</button>
                    <button type="submit" className="signIn_button">SIGN IN</button>
                </div>
            </form>

            <span className="forgotPassword_txt" onClick={() => {setSigned('newPassword')}}>Forgot your password?</span>

        </div>

    );
}

export default SignIn_block;