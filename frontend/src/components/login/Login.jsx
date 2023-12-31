import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";

export default function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const [sessionid, setSessionid] = useState("");

  const handleUserChange = (event) => {
    setUser(event.target.value);
  };

  const handlePassChange = (event) => {
    setPass(event.target.value);
  };

  const content = {
    username: user,
    password: pass,
    Authorization: "Token " + localStorage.getItem("access_token"),
  };

  const cookies = new Cookies();

  const getAuthor = async (event) => {
    event.preventDefault();

    // check if login was sucessful, then reloads the window
    const res = await axios
      .post(
        "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/login",
        content,
        {}
      )
      .then((res) => res.data)
      .then(function (data) {
        cookies.set("access_token", data.token, { path: "/" });
        localStorage.setItem("access_token", data.token);
        window.location.reload(false);
      })
      .catch(function (error) {
        alert("Incorrect username or password");
      });
  };

  return (
    <>
      {/* <section className="flex flex-col md:flex-row h-screen items-center justify-center">
        <div className="">test</div>
      </section> */}
      <section className="bg-gradient-to-b from-primary-dark to-lm-light-bg dark:bg-gradient-to-b from-dm-dark-bg to-primary-colour">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" action="#">
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your username
                  </label>
                  <input
                    type="username"
                    name="username"
                    id="username"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={handleUserChange}
                    placeholder=""
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder=""
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={handlePassChange}
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start"></div>
                </div>
                <button
                  onClick={getAuthor}
                  type="submit"
                  className="w-1/2 text-white bg-primary-dark ml-[25%] hover:bg-primary-color transition duration-200 ease-in focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover-bg-primary-700 dark:focus:ring-primary-800"
                >
                  Sign in
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don't have an account yet?{" "}
                  <a
                    href="/register"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Sign up
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
