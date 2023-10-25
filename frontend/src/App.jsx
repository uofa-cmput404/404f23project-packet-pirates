import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Landing from "./components/login/Landing";
import MainPage from "./components/site/MainPage";
import CreatePost from "./components/main-feed/CreatePost";
import Post from "./components/main-feed/Posts";
import Profile from "./components/main-feed/Profile";

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
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

axios.defaults.baseURL = "http://127.0.0.1:8000";

const client = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

function App() {
  const [count, setCount] = useState(0);

  const [currentUser, setCurrentUser] = useState();
  const [registrationToggle, setRegistrationToggle] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [authorInfo, setAuthorInfo] = useState({});

  // const navigate = useNavigate();

  useEffect(() => {
    // Use Axios to check if the user has the session ID and is logged in
    axios
      .get("/api/author")
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
        {/* <Route path="/main" element={<MainPage />} /> */}
      </Routes>
    </Router>
  );

  // return (
  //   <>
  //     <Router>
  //       <Routes>
  //         <Route path="/" element={<Landing />} />
  //         <Route path="/main" element={<MainPage />} />
  //       </Routes>
  //     </Router>

  //     {/* <Post /> */}

  //     {/* <div className="w-[500px] m-32">
  //       <CreatePost />
  //     </div>
  //     <div className="m-32 w-[1000px]">
  //       <Post />
  //       <div className="m-32">
  //         <Profile />
  //       </div>
  //     </div> */}
  //   </>
  // );
}

<script>const cors = require('cors'); app.use(cors(corsOptions));</script>;

export default App;
