/* eslint-disable no-unused-vars */
import React from "react";
import { NavLink } from 'react-router-dom'
import { getEmail, logout } from '../firebase/firebase';
import centralIcon from '../assets/iconWeather.png'

const NavigateHeader = () => {
    return (
        <div className="fixed top-0 headerNavigate">
            <div className="central-container"><img src={centralIcon} alt="" className='central-image' />AnyWheather</div>
            <div className="navigationLinks"><NavLink to='/'>Home</NavLink>{" "}<span> | </span>{" "}
                <NavLink to='/locations'>My Locations</NavLink>
            </div>
            <div className="user-logout">Welcome <a>{getEmail()}</a> <button className='btn btn-primary' onClick={() => logout()}>Logout</button></div>
        </div>
    );
};

export default NavigateHeader;