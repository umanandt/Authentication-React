import classes from "./ProfileForm.module.css";
import { useRef, useContext } from "react";
import AuthContext from "../../store/auth-context";
import { useHistory } from 'react-router-dom';

const ProfileForm = () => {
  const newPasswordInputRef = useRef();
  const authCtx = useContext(AuthContext);

  const history = useHistory();

  const submitHandler = (event) => {
    event.preventDefault();
    const enterNewPassword = newPasswordInputRef.current.value;
    // add validation if you want to
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCh99fb68lWE88xr9v1ButOQH6kNesi3zI",
      {
        method: "POST",
        body: JSON.stringify({
          idToken: authCtx.token,
          password: enterNewPassword,
          returnSecureToken: false,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((data)=>{}).catch((err)=>{
      // assumption : Always Succeeds

      history.replace('/');
    })
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={newPasswordInputRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
