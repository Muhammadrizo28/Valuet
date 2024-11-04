import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom"
import Layout from "./layout/Layout"
import Exchange from "./pages/Exchange"
import Market from "./pages/Market"
import Overview from "./pages/Overview"
import Transactions from "./pages/Transactions"
import Wallets from "./pages/Wallets"
import Authorization from "./pages/Authorization"
import { authorizationContext } from "./context/authorization"
import { modalanounceContext } from "./context/authorization"
import { useEffect, useState } from "react"
import GetCoinsRate from "./context/CoinsRate/GetCoinsRate"
import UserBalance from "./context/userBalance/UserBalance"
import Profile from "./pages/Profile"
import { useDispatch, useSelector } from "react-redux"
import { requestBalance } from "./store"

function App() {
  const [signed, setSigned] = useState(true)
  const [modalText, setModalText] = useState({bull : false, value : ''})

  const requestedBalance = useSelector((state) => state.requestBalance.value)

  const dispatch = useDispatch()

  localStorage.setItem('updateInfo', false)

  
  useEffect(() => {

    if(requestedBalance.length === 0 ) {

      dispatch(requestBalance())
    }
    
}, [dispatch, requestedBalance.length])

  

  return (

    <authorizationContext.Provider value={{ signed, setSigned }}>
    <modalanounceContext.Provider value={{modalText, setModalText}} >
      <Router>
        <GetCoinsRate>
          <UserBalance>

              <Routes>
      
                <Route path='/' element={<Layout />}>

                
                  <Route index element={<Overview />} />
                  <Route path='/exchange' element={<Exchange />} />
                  <Route path='/market' element={<Market />} />
                  <Route path='/transactions' element={<Transactions />} />
                  <Route path='/wallets' element={<Wallets />} />
                  <Route path="/profile" element={<Profile />}></Route>
      
                </Route>
      
                <Route path='/authorization' element={<Authorization />} />
         
              </Routes>
              <AuthRedirect />
              
          </UserBalance>
        </GetCoinsRate>
      </Router>
    </modalanounceContext.Provider>
    </authorizationContext.Provider>
  )
}

function AuthRedirect() {
  const navigate = useNavigate()

  useEffect(() => {

    !localStorage.getItem('signedIn') ? navigate('/authorization') : null

  }, [navigate])

  return null
}

export default App
