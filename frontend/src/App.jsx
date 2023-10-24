import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Landing from "./components/login/Landing";
import MainPage from "./components/site/MainPage";
import CreatePost from "./components/main-feed/CreatePost";
import Post from "./components/main-feed/Posts";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* <Landing /> */}
      {/* <MainPage /> */}
      <div className="w-[500px] m-32">
        <CreatePost />
      </div>
      <div className="m-32 w-[1000px]">
        <Post />
      </div>
    </>
  );
}

export default App;
