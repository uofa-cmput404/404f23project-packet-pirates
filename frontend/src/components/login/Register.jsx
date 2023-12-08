import axios from "axios";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [git, setGit] = useState("");

  const [profPic, setProfPic] = useState([]);
  const [dispPic, setDispPic] = useState("");

  const [dispName, setdispName] = useState("");

  const handleUserChange = (event) => {
    setUser(event.target.value);
    console.log("user value is:", event.target.value);
  };

  const handlePassChange = (event) => {
    setPass(event.target.value);
    console.log("user value is:", event.target.value);
  };

  const handleGitChange = (event) => {
    setGit(event.target.value);
    console.log("user value is:", event.target.value);
  };

  const handleProfPicChange = (event) => {
    setProfPic(event.target.files[0]);
    setDispPic(URL.createObjectURL(event.target.files[0]));
    console.log("user value is:", event.target.files);
  };

  const handleDisplayNameChange = (event) => {
    setdispName(event.target.value);
    console.log("user value is:", event.target.value);
  };

  const info = {
    username: user,
    password: pass,
    github: git,
    profile_picture: profPic,
    display_name: dispName,
    Authorization: "Token " + localStorage.getItem("access_token"),
  };

  const loginTest = {
    username: user,
    password: pass,
    Authorization: "Token" + localStorage.getItem("access_token"),
  };

  const SignUp = async (event) => {
    event.preventDefault();
    console.log(info);

    const res = await axios.post(
      "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/register",
      info
    );
    console.log(res.data);

    const res2 = await axios.post(
      "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/login",
      loginTest
    );
    console.log(res2.data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", user);
    formData.append("password", pass);
    formData.append("github", git);
    formData.append("display_name", dispName);
    formData.append("profile_picture", profPic);

    console.log("FORM DATA: ", formData);
    axios
      .post(
        "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log("Error Response: ", error.response.data);
        console.log("Error Data: ", error.response.data);
        alert(
          "Error signing up, make sure password is at least 8 characters, and/or username may already be taken"
        );
      })
      .finally(() => {
        navigate("/");
      });
  };

  return (
    <section className="bg-gradient-to-b from-primary-dark to-lm-light-bg dark:bg-gradient-to-b from-dm-dark-bg to-primary-colour">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="bg-white rounded-lg shadow-2xl flex flex-col w-full items-center max-w-4xl">
            <h3 className="text-xl font-semibold text-lm-custom-black mt-6 mb-4">
              Register an Account!
            </h3>

            {/* Inputs */}
            <form className="space-y-4 md:space-y-6" action="#">
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-lm-custom-black dark:text-white"
                >
                  Enter a Username
                </label>
                <input
                  type="username"
                  name="username"
                  id="username"
                  className="bg-gray-50 border border-gray-300 text-lm-custom-black sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Username..."
                  onChange={handleUserChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-lm-custom-black dark:text-white"
                >
                  Enter a Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="************"
                  className="bg-gray-50 border border-gray-300 text-lm-custom-black sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={handlePassChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="github"
                  className="block mb-2 text-sm font-medium text-lm-custom-black dark:text-white"
                >
                  Enter a GitHub Url (Optional)
                </label>
                <input
                  type="github"
                  name="github"
                  id="github"
                  placeholder="Enter a GitHub URL..."
                  className="bg-gray-50 border border-gray-300 text-lm-custom-black sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={handleGitChange}
                />
              </div>

              <div>
                <label
                  htmlFor="displayname"
                  className="block mb-2 text-sm font-medium text-lm-custom-black dark:text-white"
                >
                  Enter a Display Name (Optional)
                </label>
                <input
                  type="displayname"
                  name="displayname"
                  id="displayname"
                  placeholder="Enter a Display Name..."
                  className="bg-gray-50 border border-gray-300 text-lm-custom-black sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={handleDisplayNameChange}
                />
              </div>

              <div>
                <label htmlFor="select-image">
                  <div className="rounded-lg text-white bg-primary-dark w-full mx-0 my-4 py-2 shadow-md hover:bg-primary-color transition duration-200 ease-in">
                    Upload Image
                  </div>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id="select-image"
                  style={{ display: "none" }}
                  onChange={handleProfPicChange}
                />
              </div>

              <img src={dispPic} width="200" height="200" />
              <button
                onClick={handleSubmit}
                className="rounded-lg text-white bg-primary-dark w-full mx-0 my-4 py-2 shadow-md hover:bg-primary-color transition duration-200 ease-in"
              >
                Sign Up
              </button>
            </form>
            <p className="text-white my-4 text-lm-custom-black text-sm font-medium cursor-pointer">
              Sign In to your Account?
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
