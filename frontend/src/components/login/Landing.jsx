import Login from "./Login";
import Register from "./Register";

export default function Landing() {
  return (
    <>
      <div className="login h-screen w-screen">
        <Login />
        <Register/>
      </div>
    </>
  );
}
