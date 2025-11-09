

export const setAuthCredentials=(username,password)=>{
    const credentials=btoa(`${username}:${password}`);
    localStorage.setItem('authToken',credentials);
    localStorage.setItem('username',username);
};


//remove credentials on  logout
export const clearAuthCredentials=()=>{
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
};

//get stored credentials
export const getAuthToken=()=>{
    return localStorage.getItem('authToken');
};

//get username
export const getUsername=()=>{
    return localStorage.getItem('username');
};

// Check if user is logged in
export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

// Check if user has ADMIN role
export const isAdmin = (user) => {
  return user?.roles?.includes('ADMIN') || false;
};

