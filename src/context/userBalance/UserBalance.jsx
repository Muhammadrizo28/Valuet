import { useContext, useEffect, useState } from "react";
import { userBalanceContext } from "./userBalanceContext";
import PropTypes from 'prop-types'
import { coinsRateContext } from "../CoinsRate/coinsRate";
import Http_request from "../../hooks/http_request";
import { useNavigate } from "react-router-dom";




function UserBalance({children}) {

  const [userBalance, setUserBalance] = useState([])


  const navigate = useNavigate()


    const [userWallets, setUserWallets] = useState([])
    const [coinsPrice, setCoinsPrice] = useState([])
    const [updatedInfo, setUpdatedInfo] = useState([])
    const [transactions, setTransactions] = useState([])
    const [totalBalance, setTotalBalance] = useState({})
    const [widgets, setWidgets] = useState([])





  
    const {coinsRate} = useContext(coinsRateContext)
  
      
    async function getWallets() {
      
        let userId = JSON.parse(localStorage.getItem('user'))
        try {

    
            if(userId.id) {
                
              const res = await Http_request()('get', `/users?id=${userId.id}`)

              if(res.status >= 200 &&  res.status < 300 ) {

                setUserWallets(res.data[0].wallets)
                setTransactions(res.data[0].transactions)
                setWidgets(res.data[0].widgets)
              }
        
        
            }
  
        }
        catch(err) {
          console.log(err);
        }
      
    }

    
  
    useEffect(() => {
        
      setCoinsPrice([])
  
      userWallets.forEach((coin) => (
  
        coinsRate.forEach((rate) => (
  
          coin.name === rate.name ? setCoinsPrice(prev => [...prev, {
  
            name : coin.name,
            balance : parseFloat((coin.balance * rate.rate).toFixed(3))
          
          }]) : null
        ))
      
      ))
  
    }, [userWallets, coinsRate])
  
    useEffect(() => {
  
      if(coinsPrice.length > 0) {

        const topCoins = coinsPrice.sort((a, b) => b.balance - a.balance)      
  
        const topThreeCoins = topCoins.slice(0, 3)
    
        const otherCoins = topCoins.slice(3).reduce((a, b) => a + b.balance, 0)
  
        const others = topCoins.slice(3)
        
        setUpdatedInfo( [ ...topThreeCoins, {name: others.length > 1 ? 'Others' : others.length > 0 ? others[0].name : null, balance : otherCoins}])


        setTotalBalance({totalBalance : (topCoins.reduce((a ,b) => a + b.balance,  0)).toFixed(2)})

      }
  
    }, [coinsPrice])


    useEffect(() => {

      setUserBalance({coinsPrice, updatedInfo, transactions, userWallets, widgets, ...totalBalance})


    }, [coinsPrice, updatedInfo, transactions, totalBalance, userWallets, widgets])



    useEffect(() => {

      localStorage.getItem('signedIn') ? getWallets()  : null

    }, [navigate])

  

    return ( 

      <userBalanceContext.Provider value={{userBalance, getWallets}}>

        {children}

      </userBalanceContext.Provider>

    );
}



UserBalance.propTypes = {

  children : PropTypes.node.isRequired
}

export default UserBalance;