import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Landing from "./components/login/Landing";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Landing />
      <div className="flex justify-center items-center w-screen">
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

export default App;
