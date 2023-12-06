import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

export default function ProfilePage({ user }) {
    const navigate = useNavigate();
    const [pass, setPass] = useState('');
    const [git, setGit] = useState('');

    const [dispPic, setDispPic] = useState('');
    const [profPic, setProfPic] = useState('');

    const [dispName, setdispName] = useState('');
    
    var user = JSON.parse(localStorage.getItem('author'))

    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Token " + localStorage.getItem("access_token"),
        },
      };

    const handlePassChange = event => {
        setPass(event.target.value);
        console.log('user value is:', event.target.value);
    };

    const handleGitChange = event => {
        setGit(event.target.value);
        console.log('user value is:', event.target.value);
    };

    const handleProfPicChange = event => {
        const file = event.target.files[0];
        if (file) {
            setProfPic(file);
            setDispPic(URL.createObjectURL(event.target.files[0]))
        }
        console.log('user value is:', event.target.files);
    };

    const handleDisplayNameChange = event => {
        setdispName(event.target.value);
        console.log('user value is:', event.target.value);
    };
    
    const info = {
        'password' : pass,
        'github' : git,
        'profile_picture' : profPic,
        'username' : dispName,
    }


    const SaveProfile = async (event) => {
        event.preventDefault()

        const formData = new FormData();
        formData.append('password', info['password'])
        formData.append('github', info['github'])
        console.log(info['profile_picture'])
        formData.append('profile_picture', info['profile_picture'])
        formData.append('username', info['username'])

        console.log("FORM DATA", formData)

        try {
            const res = await axios.post("https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/" + user.user.user_id + "/editprofile", formData, config);
            console.log(res.data);
            window.location.reload(false)
          } catch (error) {
            console.error("Error saving profile:", error);
          }
      };
      
    return (
        <section className="bg-gradient-to-b from-primary-dark to-lm-light-bg dark:bg-gradient-to-b from-dm-dark-bg to-primary-colour">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div
                    className="w-full bg-white rounded-lg shadow-md dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
                    style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)" }}
                >
                    <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-2xl max-w-4xl">
                        <form className="col-span-1 row-span-3">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div className="image-container w-24 h-24 my-6 ml-12 mr-8 rounded-full overflow-hidden bg-black">
                                    <img
                                        src={dispPic || "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com" + user.user.profile_picture}
                                        alt="profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <label htmlFor="select-image" className="block w-min">
                                    <div className='rounded-lg text-white bg-primary-dark w-min mx-4 my-4 px-6 py-2 shadow-md hover:bg-primary-color transition duration-200 ease-in'>
                                        Upload Picture
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

                            <div className="grid grid-cols-2 grid-rows-3 gap-2 items-center">
                                <label
                                    htmlFor="github"
                                    className="block ml-10 row-span-1 col-start-1 col-end-2 text-sm font-medium text-lm-custom-black dark:text-white"
                                >
                                    Enter New GitHub Url:
                                </label>
                                <input
                                    type="github"
                                    name="github"
                                    id="github"
                                    placeholder="Enter a GitHub URL..."
                                    className="bg-gray-50 border border-gray-300 row-span-1 col-start-2 col-end-3 text-lm-custom-black sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    onChange={handleGitChange}
                                />
                            
                                <label
                                    htmlFor="displayname"
                                    className="block ml-10 row-span-1 col-start-1 col-end-2 text-sm font-medium text-lm-custom-black dark:text-white"
                                >
                                    Enter New Display Name:
                                </label>
                                <input
                                    type="displayname"
                                    name="displayname"
                                    id="displayname"
                                    placeholder={user.user.username}
                                    className="bg-gray-50 border border-gray-300 row-span-1 col-start-2 col-end-3 text-lm-custom-black sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    onChange={handleDisplayNameChange}
                                />
                            
                                <button 
                                    onClick={()=>{navigate("/")}}
                                    className='rounded-lg text-lm-custom-black row-span-1 col-start-1 col-end-2 justify-self-start w-min ml-9 my-4 px-4 py-2 shadow-md hover:bg-primary-color transition duration-200 ease-in'>
                                    Cancel
                                </button>

                                <button 
                                    onClick={SaveProfile}
                                    className='rounded-lg text-white bg-primary-dark row-span-1 col-start-2 col-end-3 justify-self-end w-min my-4 px-4 py-2 shadow-md hover:bg-primary-color transition duration-200 ease-in'>
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
