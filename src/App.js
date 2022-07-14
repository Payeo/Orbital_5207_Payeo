import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import AuthProvider from "./context/auth";
import PrivateRoute from "./components/PrivateRoute";
import { useState } from "react";
import { ThemeContext } from "./components/Navbar";

function App() {

  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((curr) => (curr === "dark" ? "light" : "dark"));
  }

  return (
    <>
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="app_container" id={theme}>
        <AuthProvider>
          <BrowserRouter>
          <Route exact path="/login" component={Login} />
            <Navbar toggleTheme={toggleTheme} theme={theme}/>
            <Switch>
              <PrivateRoute exact path="/profile" component={Profile} />
              <PrivateRoute exact path="/" component={Home} />
              <PrivateRoute exact path="/:convoId" component={Chat} />
            </Switch>
          </BrowserRouter>
        </AuthProvider>
      </div>
    </ThemeContext.Provider>
    </>
  );
}

export default App;
