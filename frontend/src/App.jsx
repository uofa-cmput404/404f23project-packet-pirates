import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
// import Landing from "./components/login/Landing";
import MainPage from "./components/site/MainPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* <Landing /> */}
      <MainPage />
    </>
  );
}

export default App;
