import React, { useCallback, useEffect, useState} from "react";

let logoutTimer;
const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

// calculate time to know the expiration time

// helper function which gets called in login to check the time

const calculateRemainingTime = (expirationTime) => {
  // get time in miliseconds using getTime() method of date function

  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();
  const remainingDuration = adjExpirationTime - currentTime;
  // console.log(currentTime);
  // console.log(adjExpirationTime);
  // console.log(remainingDuration);
  return remainingDuration;
};

// define the function and all to handle the data

// another helper function to retrieve stored token
// if time has expired then no use of token

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem("token");
  const storedExpirationDate = localStorage.getItem("expirationTime");

  const remaiiningTime = calculateRemainingTime(storedExpirationDate);

  if (remaiiningTime <= 3600) {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    return null;
  }
  return {
    token: storedToken,
    duration: remaiiningTime,
  };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();

  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }

  const [token, setToken] = useState(initialToken);
  const userIsLoggedIn = !!token;
   // it is actually a javascriupt syntax to check true or false

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = (token, expirationTime) => {
    setToken(token);
    // using local storage to store the token and expiration time
    localStorage.setItem("token", token);
    localStorage.setItem("expirationTime", expirationTime);


    // we have called the helper function to logout the sigin
    // guy when the time gets over


    const remaiiningTime = calculateRemainingTime(expirationTime);
    logoutTimer = setTimeout(logoutHandler, remaiiningTime);


    // we have clear the time what if somebody logout before session ends
    // then we have clear the timer
  };

  useEffect(()=>{
    if(tokenData){
      logoutTimer = setTimeout(logoutHandler, tokenData.duration)
    }
  }, [tokenData, logoutHandler])


  // returning the value
  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    // passing the data using value - contextvalue is object name
    // and value containes the infomation about data

    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
