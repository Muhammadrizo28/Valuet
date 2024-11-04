import '../style/aside.scss'
import overview_img from '../images/Aside/overview.png'
import wallets_img from '../images/Aside/wallets.png'
import transactions_img from '../images/Aside/transactions.png'
import exchanges_img from '../images/Aside/exchanges.png'
import market_img from '../images/Aside/market.png'
import logOut_img from '../images/Aside/logOut.png'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAside, setModalValue } from '../store'



function Aside() {
    
    const openAside = useSelector((state) => state.openAside.value)

    const navigate = useNavigate()

    const userLocation = window.location.href.split('/')

    const userLocation2 = userLocation[userLocation.length -1]

    const userInfo = useSelector((state) => state.requestBalance.value) 

    const dispatch = useDispatch()


    function asideFunc() {

        window.innerWidth > 560 ? dispatch(setAside(false)) : null
        
    }

    window.addEventListener('resize', asideFunc);



    return (
        
        <aside className={openAside === false ? 'aside' : 'aside2'}>

            <div className='topSide_div'>

                <h1>VALUET</h1>

                <div className='line'></div>

            </div>

            <nav>

                <div className={userLocation2 === '' ? 'showOther && nav_item' : 'nav_item'}>
                    <div  onClick={() => {navigate('/'), dispatch(setAside(false))}} id='navItem'>
                        <img src={overview_img} alt="" />
                        <span className='navItem_text'>Overview</span>
                    </div>
                    <div className='line'></div>
                </div>

               
                <div className={userLocation2 === 'wallets' ? 'showOther && nav_item' : 'nav_item'}>
                    <div onClick={() => {navigate('/wallets'), dispatch(setAside(false))}}  id='navItem'>
                        <img src={wallets_img} alt="" />
                        <span>Wallets</span>
                    </div>
                    <div className='line'></div>
                </div>

               
                <div onClick={() => {navigate('/transactions'), dispatch(setAside(false))}} className={userLocation2 === 'transactions' ? 'showOther && nav_item' : 'nav_item'}>
                    <div  id='navItem'>
                        <img src={transactions_img} alt="" />
                        <span>Transactions</span>
                    </div>
                    <div className='line'></div>
                </div>

               
                <div onClick={() => {navigate('/exchange'), dispatch(setAside(false))}} className={userLocation2 === 'exchange' ? 'showOther && nav_item' : 'nav_item'}>
                    <div  id='navItem'>
                        <img src={exchanges_img} alt="" />
                        <span>Exchange</span>
                    </div>
                    <div className='line'></div>
                </div>

               
                <div onClick={() => {navigate('/market'), dispatch(setAside(false))}} className={userLocation2 === 'market' ? 'showOther && nav_item' : 'nav_item'}>
                    <div  id='navItem'>
                        <img src={market_img} alt="" />
                        <span>Market</span>
                    </div>
                    <div className='line'></div>
                </div>

               


            </nav>

            <div className='middleSide_div'>

                <div className='line'></div>

            </div>


            <div className='bottomSide_div'>

                <div >

                    <div onClick={() => {navigate('/profile'), dispatch(setAside(false))}} id='bottomSide_div2' className={userLocation2 === 'profile' ? 'showOther2 && bottomSide_div2' : 'bottomSide_div2'}>
                        <div></div>
                        <span >{userInfo[0]?.name}</span>   
                    </div>
    
                    <div onClick={() => {dispatch(setModalValue('logOut'))}} id='bottomSide_div2'>
                        <img src={logOut_img} alt="" />
                        <span>Log Out</span>
                    </div>

                </div>

            </div>



        </aside>

    );
}

export default Aside;








