import { useState, useRef , useContext} from "react";
import AuthContext from "../../store/auth-context";
import classes from "./AuthForm.module.css";
import { useHistory } from 'react-router-dom';


const AuthForm = () => {

  const history = useHistory();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsloading] = useState(false);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

 const authCtx  =  useContext(AuthContext);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    setIsloading(true);
    let url;
    if (isLogin) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCh99fb68lWE88xr9v1ButOQH6kNesi3zI";
    } else {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCh99fb68lWE88xr9v1ButOQH6kNesi3zI";
    }
    fetch(
url,
      {
        method: "POST",
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        setIsloading(false);
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            // show an error modal
            // show some error message to users
            let errorMessage = "Authentication failed";
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
          //  alert(errorMessage);
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        // providing the expiration time
        const expirationTime = new Date(new Date().getTime() + (+data.expiresIn * 1000));
        //console.log(data.expiresIn);
        authCtx.login(data.idToken, expirationTime.toISOString());
        // authCtx is the contextAPI which we created in store
        // login is the function that we have defined 
        // data is the whole value and idToken is the value that we got from the
        // srver or the firebase to use here
        // if idToken is availble means login happend otherwise not
        //using history from react router dom to redirect user after login
        // with replace cannot use back button
        history.replace('/');
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}
          {isLoading && <p>Sending request...</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
