import {clearAuthCredentials} from './utils/auth.js';
import {useNavigate} from 'react-router-dom';
import './Header.css';

export default function Header()
{
    const navigate=useNavigate();

    const logout=()=>{
        clearAuthCredentials();
        // Force full page reload to reset all state
        window.location.href = '/login';
    }
    
    return(
        <div className="header-container">
            <button
            className="header-button profile-button" 
            type="button"
            onClick={()=>navigate('/profile')}
            >
                Profile
            </button>
            <button className="header-button logout-button" type="button" onClick={logout}>
                Logout
            </button>
        </div>
    );

}