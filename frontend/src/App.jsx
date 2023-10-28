import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Landing from "./components/login/Landing";
import MainPage from "./components/site/MainPage";
import CreatePost from "./components/main-feed/CreatePost";
import Post from "./components/main-feed/Posts";
import Profile from "./components/main-feed/Profile";
import Cookies from 'universal-cookie'


// routing
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";

import axios from "axios";
import Register from "./components/login/Register";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

axios.defaults.baseURL = "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com";

const client = axios.create({
  baseURL: "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com",
});

function App() {
  const [count, setCount] = useState(0);

  const [currentUser, setCurrentUser] = useState();
  const [registrationToggle, setRegistrationToggle] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [authorInfo, setAuthorInfo] = useState({});

  const cookies = new Cookies();

  // const navigate = useNavigate();

  useEffect(() => {

    var token = cookies.get('access_token')
    console.log(token)

    const config = {
      headers: {Authorization: 'token ' + token}
    };
    console.log(config)

    // Use Axios to check if the user has the session ID and is logged in, and if so, set the state to logged in
    axios
      .get("/api/author", config)
      .then((response) => {
        console.log("Response from /api/author:", response);
        setIsLoggedIn(true);
        setAuthorInfo(response.data);
        if (response.data.session_id) {
          // User is logged in
          setIsLoggedIn(true);
          console.log("User is logged in");
        }
      })
      .catch((error) => {
        console.error("Error checking login status:", error);
      });
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <MainPage user={authorInfo} /> : <Landing />}
        />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

<script>const cors = require('cors'); app.use(cors(corsOptions));</script>;

export default App;
