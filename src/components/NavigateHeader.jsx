import { NavLink } from 'react-router-dom'

//Import firebase functions
import { getEmail, logout } from '../firebase/firebase';

//Import assets
import centralIcon from '../assets/iconWeather.png'

const NavigateHeader = () => {
    return (
        <div className="fixed top-0 headerNavigate">
            <div className="central-container"><img src={centralIcon} alt="" className='central-image'/>AnyWheather</div>
            {/*Links to navigate between pages*/}
            <div className="navigationLinks"><NavLink to='/'>Home</NavLink>{" "}<span> | </span>{" "}
                <NavLink to='/locations'>My Locations</NavLink>
            </div>
            {/*User info and logout button*/}
            <div className="user-logout">Welcome <a>{getEmail()}</a> <button className='btn btn-primary' onClick={() => logout()}>Logout</button></div>
        </div>
    );
};

export default NavigateHeader;