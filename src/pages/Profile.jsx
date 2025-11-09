import { useState, useEffect } from 'react';
import { getCurrentUser } from '../userApi';
import { changePassword } from '../userApi';
import {clearAuthCredentials} from '../utils/auth';
import './Profile.css';


export default function Profile() {
  const[user,setUser]=useState(null);
  const[loading,setLoading]=useState(true);
  const [oldPassword, setOldPassword] = useState("");
  const[newPassword,setNewPassword]=useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");


  useEffect(()=>{
    loadUser();
  },[]);

    const loadUser=async()=>{
      try{
        const res=await getCurrentUser();
        setUser(res.data);

      }catch(err){
        console.log("Error loading user",err);
      }finally{
        setLoading(false);
      }
    };

    const handleChangePassword=async(e)=>{
      e.preventDefault();
      setMessage("");

      if(newPassword!==confirmPassword){
        setMessage("New Passwords don't match!")
        return;
      }
      try{
        await changePassword(oldPassword,newPassword);
        setMessage("Password changed successfully! Redirecting to login...");
        // Store success message in localStorage
        localStorage.setItem('passwordChangeSuccess', 'Password changed successfully! Please log in with your new password.');
        // Wait 1.5 seconds then logout and redirect
        setTimeout(()=>{
          clearAuthCredentials();
          window.location.href = '/login';
        },1500);
      }catch(err){
        setMessage("Error changing password: " + (err.response?.data?.message || err.message));
      }
    }

    return (
      <div className="profile-container">
        <div className="profile-card">
          <h1 className="profile-title">Profile</h1>
          
          {loading ? (
            <p className="loading-text">Loading...</p>
          ) : user ? (
            <div className="user-info">
              <h2 className="username-display">Welcome, {user.userName}!</h2>
              {user.roles && (
                <p className="user-roles">Role: {user.roles.join(', ')}</p>
              )}
            </div>
          ) : (
            <p className="error-text">Error loading user</p>
          )}

          <div className="section-divider"></div>

          <form onSubmit={handleChangePassword} className="password-form">
            <h2 className="section-title">Change Password</h2>
            
            <div className="input-group">
              <label className="input-label">Old Password</label>
              <input
                type="password"
                value={oldPassword}
                placeholder="Enter your old password"
                onChange={(e)=>setOldPassword(e.target.value)}
                className="profile-input"
                required
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">New Password</label>
              <input
                type="password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="profile-input"
                required
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">Confirm New Password</label>
              <input
                type="password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="profile-input"
                required
              />
            </div>
            
            {message && (
              <div className={`message ${message.includes('Error') || message.includes("don't match") ? 'error-message' : 'success-message'}`}>
                {message}
              </div>
            )}
            
            <button type="submit" className="profile-button">
              Change Password
            </button>
          </form>
        </div>
      </div>
    );
  }