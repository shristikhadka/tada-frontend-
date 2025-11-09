import { useState, useEffect } from 'react';
import { getCurrentUser, changePassword, updateProfile , deleteAccount} from '../userApi';
import {clearAuthCredentials} from '../utils/auth';
import './Profile.css';


export default function Profile() {
  const[user,setUser]=useState(null);
  const[loading,setLoading]=useState(true);
  const [oldPassword, setOldPassword] = useState("");
  const[newPassword,setNewPassword]=useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [deleteMessage,setDeleteMessage]=useState("");
  const[username,setUsername]=useState("");
  const[currentPassword,setCurrentPassword]=useState("");
 
  useEffect(()=>{
    loadUser();
  },[]);

    const loadUser=async()=>{
      try{
        const res=await getCurrentUser();
        setUser(res.data);
        // Initialize username field with current username
        setUsername(res.data.userName);
      }catch(err){
        console.log("Error loading user",err);
      }finally{
        setLoading(false);
      }
    };

    const handleChangePassword=async(e)=>{
      e.preventDefault();
      setPasswordMessage("");

      if(newPassword!==confirmPassword){
        setPasswordMessage("New Passwords don't match!")
        return;
      }
      try{
        await changePassword(oldPassword,newPassword);
        setPasswordMessage("Password changed successfully! Redirecting to login...");
        // Store success message in localStorage
        localStorage.setItem('passwordChangeSuccess', 'Password changed successfully! Please log in with your new password.');
        // Wait 1.5 seconds then logout and redirect
        setTimeout(()=>{
          clearAuthCredentials();
          window.location.href = '/login';
        },1500);
      }catch(err){
        setPasswordMessage("Error changing password: " + (err.response?.data?.message || err.message));
      }
    }
    const handleUpdateUsername=async(e)=>{
      e.preventDefault();
      setUsernameMessage("");
      
      // Validate username is not empty
      if(!username || username.trim() === ""){
        setUsernameMessage("Username cannot be empty!");
        return;
      }
      
      // Check if user exists and if username actually changed
      if(user && username === user.userName){
        setUsernameMessage("Username is the same as current username!");
        return;
      }
      
      try{
        const res=await updateProfile({ userName: username });
        // Update user state with new data
        setUser(res.data);
        setUsernameMessage("Username updated successfully! Redirecting to login...");
        // After username change, user must login again (Basic Auth uses username)
        setTimeout(() => {
          clearAuthCredentials();
          window.location.href = '/login';
        }, 2000);
      }catch(err){
        setUsernameMessage("Error updating username: " + (err.response?.data?.message || err.message));
      }
    }

    const handleDeleteAccount=async(e)=>{
      e.preventDefault();
      setDeleteMessage("");
      
      // Validate confirmation text
      if(currentPassword !== 'DELETE'){
        setDeleteMessage("Please type 'DELETE' to confirm account deletion.");
        return;
      }
      
      try{
        await deleteAccount();
        setDeleteMessage("Account deleted successfully! Redirecting to login...");
        setTimeout(() => {
          clearAuthCredentials();
          window.location.href = '/login';
        }, 2000);
      }catch(err){
        setDeleteMessage("Error deleting account: " + (err.response?.data?.message || err.message));
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
            
            {passwordMessage && (
              <div className={`message ${passwordMessage.includes('Error') || passwordMessage.includes("don't match") ? 'error-message' : 'success-message'}`}>
                {passwordMessage}
              </div>
            )}
            
            <button type="submit" className="profile-button">
              Change Password
            </button>
          </form>

          <div className="section-divider"></div>

          <form onSubmit={handleUpdateUsername} className="password-form">
            <h2 className="section-title">Update Username</h2>
            
            <div className="input-group">
              <label className="input-label">New Username</label>
              <input 
                type="text" 
                placeholder="Enter new username" 
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
                className="profile-input"
                required
              />
            </div>
            
            {usernameMessage && (
              <div className={`message ${usernameMessage.includes('Error') || usernameMessage.includes('same') || usernameMessage.includes('empty') ? 'error-message' : 'success-message'}`}>
                {usernameMessage}
              </div>
            )}
            
            <button type="submit" className="profile-button">
              Update Username
            </button>
          </form>

          <div className="section-divider"></div>

          <form onSubmit={handleDeleteAccount} className="password-form">
            <h2 className="section-title">Delete Account</h2>
            <p style={{ color: '#dc2626', fontSize: '14px', marginBottom: '20px' }}>
              Warning: This action cannot be undone. All your data will be permanently deleted.
            </p>
            
            <div className="input-group">
              <label className="input-label">Type "DELETE" to confirm</label>
              <input 
                type="text" 
                placeholder="Type DELETE to confirm" 
                value={currentPassword}
                onChange={(e)=>setCurrentPassword(e.target.value)}
                className="profile-input"
                required
              />
            </div>
            
            {deleteMessage && (
              <div className={`message ${deleteMessage.includes('Error') ? 'error-message' : 'success-message'}`}>
                {deleteMessage}
              </div>
            )}
            
            <button 
              type="submit" 
              className="profile-button" 
              style={{ background: '#dc2626' }}
              disabled={currentPassword !== 'DELETE'}
            >
              Delete Account
            </button>
          </form>
        </div>
      </div>
    );
  }