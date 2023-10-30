import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

export default function ProfilePage({ user }) {
    const navigate = useNavigate();
    const [pass, setPass] = useState('');
    const [git, setGit] = useState('');
    const [profPic, setProfPic] = useState('');
    const [dispName, setdispName] = useState('');
    
    const handlePassChange = event => {
        setPass(event.target.value);
        console.log('user value is:', event.target.value);
    };

    const handleGitChange = event => {
        setGit(event.target.value);
        console.log('user value is:', event.target.value);
    };

    const handleProfPicChange = event => {
        setProfPic(URL.createObjectURL(event.target.files[0]))
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
        'display_name' : dispName,
        'Authorization': 'Token ' + localStorage.getItem('access_token')
    }

    const SaveProfile = async (event) => {
        event.preventDefault()
        console.log(info)

        const res = await axios.post("https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/api/something", info)
        console.log(res.data)
      };
      
    return (
        <section className="bg-gradient-to-b from-primary-dark to-lm-light-bg dark:bg-gradient-to-b from-dm-dark-bg to-primary-colour">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="bg-white rounded-lg shadow-2xl flex flex-col w-full items-center max-w-4xl"></div>
                <div className="image-container w-24 h-24 m-6 rounded-full overflow-hidden bg-black">
                    <img
                    src={profPic}
                    alt={user.user.profPic}
                    className="w-full h-full object-cover"
                    />
                </div>
                <form action="#">
                    
                    <label htmlFor="select-image" className="block w-min">
                        <div 
                            className='rounded-lg text-white bg-primary-dark w-min mx-4 my-4 px-6 py-2 shadow-md hover:bg-primary-color transition duration-200 ease-in'>
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

                    <div className="grid grid-cols-2 grid-rows-3 gap-2 items-center">
                        <label
                            htmlFor="github"
                            className="block m-2 row-span-1 col-start-1 col-end-2 text-sm font-medium text-lm-custom-black dark:text-white"
                        >
                            Edit your GitHub Url
                        </label>
                        <input
                            type="github"
                            name="github"
                            id="github"
                            placeholder="Enter a GitHub URL..."
                            className="bg-gray-50 w-11/12 border border-gray-300 row-span-1 col-start-2 col-end-3 text-lm-custom-black sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            onChange={handleGitChange}
                        />
                    
                        <label
                            htmlFor="displayname"
                            className="block m-2 row-span-1 col-start-1 col-end-2 text-sm font-medium text-lm-custom-black dark:text-white"
                        >
                            Edit your Display Name
                        </label>
                        <input
                            type="displayname"
                            name="displayname"
                            id="displayname"
                            placeholder={user.user.display_name}
                            className="bg-gray-50 w-11/12 border border-gray-300 row-span-1 col-start-2 col-end-3 text-lm-custom-black sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            onChange={handleDisplayNameChange}
                        />
                    
                        <button 
                        onClick={()=>{navigate("/")}}
                        className='rounded-lg text-lm-custom-black row-span-1 col-start-1 col-end-2 justify-self-start w-min ml-6 my-4 px-4 py-2 shadow-md hover:bg-primary-color transition duration-200 ease-in'>
                        Cancel
                        </button>

                        <button 
                        onClick={SaveProfile}
                        className='rounded-lg text-white bg-primary-dark row-span-1 col-start-2 col-end-3 justify-self-end w-min mr-6 my-4 px-4 py-2 shadow-md hover:bg-primary-color transition duration-200 ease-in'>
                        Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </section>
    )
}
