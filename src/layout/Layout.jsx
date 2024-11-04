import { Outlet, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useEffect } from "react";
import Aside from "../components/Aside";
import Container from "../components/Container";



function Layout() {


    let navigate = useNavigate()     //Checking authorization

    useEffect(() => {

        let signeIn = localStorage.getItem('signedIn')

        if(signeIn !== 'true') {

            navigate('/authorization')
        }
    }, [navigate])

    const userLocation = window.location.href.includes('profile')



    return (  

        <div style = {{display : 'flex', position : 'relative' }}>  

            <Aside />

            <Container>

                {!userLocation && <Header />}
                <Outlet/>    
            

            </Container>
        
        </div>
    );
}

export default Layout;