import { useDispatch, useSelector } from 'react-redux';
import style from '../style/Profile.module.scss';
import Selector from '../components/Selector';
import { useCallback, useEffect, useReducer, useState } from 'react';
import Http_request from '../hooks/http_request';
import { requestBalance, setAside } from '../store';
import menu_img from '../images/Header/menu.png'

function Profile() {

    const userInf = useSelector((state) => state.requestBalance.value);
    const userInfo = userInf[0];

    const dispatch = useDispatch()

    const countries = [
        "United States", "Canada", "Brazil", "United Kingdom", "Germany",
        "France", "Italy", "Spain", "Australia", "India", "China", "Japan",
        "South Korea", "Russia", "South Africa"
    ];

    const cryptoJobs = [
        "Blockchain Developer", "Smart Contract Developer", "Cryptocurrency Analyst",
        "Blockchain Architect", "DeFi Specialist", "Crypto Trader", "Crypto Compliance Officer",
        "Blockchain Consultant", "Crypto Community Manager", "NFT Developer",
        "Crypto Security Analyst", "Blockchain Product Manager", "Crypto Marketing Specialist",
        "Crypto Researcher", "Blockchain UX/UI Designer", "Other"
    ];

    const [country, setCountry] = useState(userInfo?.country ?? "Not specified");
    const [job, setJob] = useState(userInfo?.job ?? "Not specified");
    const [buttonClick, setButtonClick] = useState(false);
    const [intilization, setIntilization] = useState(false)

    const countryChange = (newCountry) => setCountry(newCountry);
    const jobChange = (newJob) => setJob(newJob);

    const user = localStorage.getItem('user')



    
    function reducer(state, action) {
        switch (action.type) {
            case 'fullName':
                return { ...state, fullName: action.value };
            case 'email':
                return { ...state, email: action.value };
            default:
                return state;
        }
    }

    const [state, change] = useReducer(reducer, {
        fullName: userInfo?.name || '',
        email: userInfo?.login || ''
    });



    const deleteWidgetDb = useCallback(async (id) => {
        if (user) {
    
            try {
                const res = await Http_request()('patch', `/users/${id}`, {

                    name : state.fullName,
                    login : state.email,
                    country : country,
                    job : job

                })
    
                if (res.status >= 200 && res.status < 300) {

                    dispatch(requestBalance())
                    
                } else {
                    console.log('Ошибка: некорректный статус ответа', res.status);
                }
            } catch (err) {
                console.log('Ошибка при удалении виджета:', id);
            }
        }
    }, [user, country, job, state.fullName, state.email, dispatch]);
    
    useEffect(() => {

        const parsedUser = JSON.parse(user);
    
        if (parsedUser?.id && intilization) {

            deleteWidgetDb(parsedUser.id);

            setIntilization(false); 
        }
    }, [user, deleteWidgetDb, intilization]);

    return (
        <div className={style.profile_cont}>
            <div className={style.profile_header}>

            <button onClick={() => {dispatch(setAside(true))}} className='headerAside_button'><img src={menu_img} alt="" /></button>


            </div>
            <div className={style.profileMiddle_side}>
                <div className={style.profile_circle}></div>
                <div className={style.nameBox}>
                    <p>{userInfo?.name}</p>
                    <span>{userInfo?.login}</span>
                </div>
                <button onClick={() => {setButtonClick(!buttonClick), setIntilization(buttonClick)}} className={style.profile_changeData_btn}>
                    {buttonClick ? 'Save' : 'Change'}
                </button>
            </div>
            <div className={style.profileBottom_side}>
                <div className={style.name_input_box}>
                    <div className={style.profile_inputBox}>
                        <span>Full name</span>
                        <input
                            onChange={(e) => change({ type: 'fullName', value: e.target.value })}
                            className={!buttonClick ? style.profile_unclickable : ''}
                            type="text"
                            value={state.fullName}
                            readOnly={!buttonClick}
                        />
                    </div>
                    <div className={style.profile_inputBox}>
                        <span>Country</span>
                        <div className={`${style.profile_selectorBox} ${!buttonClick ? style.profile_unclickable : ''}`}>
                            <Selector main={country} options={countries}  onDataChange={countryChange} />
                        </div>
                    </div>
                </div>
                <div className={style.name_input_box}>
                    <div className={style.profile_inputBox}>
                        <span>Email</span>
                        <input
                            onChange={(e) => change({ type: 'email', value: e.target.value })}
                            className={!buttonClick ? style.profile_unclickable : ''}
                            type="text"
                            value={state.email}
                            readOnly={!buttonClick}
                        />
                    </div>
                    <div className={style.profile_inputBox}>
                        <span>Job Title</span>
                        <div className={`${style.profile_selectorBox} ${!buttonClick ? style.profile_unclickable : ''}`}>
                            <Selector main={job} options={cryptoJobs}  onDataChange={jobChange} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
