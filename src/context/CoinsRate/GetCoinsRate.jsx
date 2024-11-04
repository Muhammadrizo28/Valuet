import { useEffect, useState } from "react";
import Http_request from "../../hooks/http_request";
import PropTypes from 'prop-types'
import { coinsRateContext } from "./coinsRate";

function GetCoinsRate({children}) {


    const [coinsRate, setCoinsRate] = useState([])

    async function getRate() {
    
        try {
    
            const res = await Http_request()('get', '/coinRate')
      
            res.status >= 200 &&  res.status < 300 ? setCoinsRate(res.data) : null
    
        
        }
        catch(err) {
          console.log(err);
        }
        
    }
    
    
    useEffect(() => {

      getRate()

    }, [])







    


    return ( 

        <coinsRateContext.Provider value = {{coinsRate, setCoinsRate}}>

            {children}

        </coinsRateContext.Provider>

     
    );
}


GetCoinsRate.propTypes = {

    children : PropTypes.node.isRequired
}

export default GetCoinsRate;