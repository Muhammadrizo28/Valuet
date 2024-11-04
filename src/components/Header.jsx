
import '../style/header.scss'

import search_img from '../images/Header/search.png'
import email_img from '../images/Header/email.png'
import bell_img from '../images/Header/bell.png'
import { setAside, setModalValue } from '../store'
import { useDispatch } from 'react-redux'
import { useContext, useEffect, useState } from 'react'
import {coinsRateContext} from '../context/CoinsRate/coinsRate'
import { useDebounce } from '@uidotdev/usehooks'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import menu_img from '../images/Header/menu.png'

function Header() {

    const dispatch = useDispatch()


    const {coinsRate} = useContext(coinsRateContext)

    const [inputValue, setInputValue] = useState('')

    const [searchingItems, setSearchingItems] = useState([])

    const debounce = useDebounce(inputValue, 500)

    const navigate = useNavigate()

    const findCoins = useCallback(() => {

        const filteredCoins = coinsRate.filter((item) =>

            item.name.toLowerCase().includes(debounce.toLowerCase())
        );
        setSearchingItems(filteredCoins);
    }, [coinsRate, debounce]);
    
    useEffect(() => {

        if(debounce) {

            findCoins()
        }
        else {

            setSearchingItems([])
        }

    }, [debounce, findCoins])


    return ( 

        <header>

            <div className="header_container">

                <button onClick={() => {dispatch(setAside(true))}} className='headerAside_button'><img src={menu_img} alt="" /></button>

                <div style={searchingItems.length !== 0  ? {zIndex : '4'} : {zIndex : '1'}} className='search_container'>

                    <div className='headerSearch_div'>
    
                        <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} type="text" />
    
                        <button className='headerSearch_button'>
    
                            <img onClick={() => {navigate('/market'), setSearchingItems([]), setInputValue('')}} src={search_img} alt="" />
    
                        </button>
    
                    </div>

                    <div style={searchingItems.length > 0 ? {display : "block"} : {display : "none"}} className='search_clueBox'>

                        {searchingItems.map((item, index) => (

                            <div onClick={() => {navigate('/market'), setSearchingItems([]), setInputValue('')}} className='search_item' key = {index}>

                                <div>
                                    <span>{item.name}</span>
                                    <span style={item.volatility[0].slice(0, 1) === '+' ? {color :  'rgba(0, 232, 172, 1)'} : {color : 'rgba(243, 80, 80, 1)'}}>{item.volatility[0]}</span>
                                </div>

                            </div>
                        ))}

                    </div>

                </div>




                <div className='headerAnnouncments_div'>

                    <button onClick={() => {dispatch(setModalValue('email'))}} className='headerAnnouncment_button'><img src={email_img} alt="" /> </button>
                    <button onClick={() => {dispatch(setModalValue('bell'))}} className='headerAnnouncment_button'><img src={bell_img} alt="" /> </button>

                </div>
            </div>

            <div className='header_line'></div>

        </header>
   
    );
}

export default Header;