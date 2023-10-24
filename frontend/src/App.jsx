import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Landing from "./components/login/Landing";

import axios from 'axios';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

axios.defaults.baseURL = "http://127.0.0.1:8000"

const client = axios.create({
  baseURL: "http://127.0.0.1:8000"
})


function App() {
  const [count, setCount] = useState(0);

  const [currentUser, setCurrentUser] = useState()
  const [registrationToggle, setRegistrationToggle] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')


  return (
    <>
      <Landing />
      <div className="flex justify-center items-center">
        {/* <MainPage /> */}
      </div>

      {/* <Post /> */}

      {/* <div className="w-[500px] m-32">
        <CreatePost />
      </div>
      <div className="m-32 w-[1000px]">
        <Post />
        <div className="m-32">
          <Profile />
        </div>
      </div> */}
    </>
  );
}

<script>
  const cors = require('cors');
  app.use(cors(corsOptions));
</script>



export default App;
