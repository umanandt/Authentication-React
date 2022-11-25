import { Switch, Route, Redirect } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import UserProfile from "./components/Profile/UserProfile";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import { useContext } from "react";
import AuthContext from "./store/auth-context";

function App() {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;

  return (
    <Layout>
      <Switch>
        <Route path="/" exact> 
          <HomePage />
        </Route>

        {!isLoggedIn && (
          <Route path="/auth">
            <AuthPage />
          </Route>
        )}

        {isLoggedIn && (
          <Route path="/profile">
           {authCtx.isLoggedIn && <UserProfile />}
           {!authCtx.isLoggedIn && <Redirect to='/auth' />}
          </Route>
        )}
        {/* if the use enter something invalid this route will run we
        
        are protecting our routes here
        
        */}
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
