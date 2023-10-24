export default function Register() {

  return (
    <section className="bg-gradient-to-b from-primary-dark to-lm-light-bg dark:bg-gradient-to-b from-dm-dark-bg to-primary-colour">
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="bg-white rounded-lg shadow-2xl flex flex-col w-full items-center max-w-4xl">
                <h3 className='text-xl font-semibold text-lm-custom-black mt-6 mb-4'>Register an Account!</h3>

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
                    />
                    </div>
                    <div>
                    <label
                        htmlFor="picture"
                        className="block mb-2 text-sm font-medium text-lm-custom-black dark:text-white"
                    >
                        Enter a Profile Picture Url (Optional)
                    </label>
                    <input
                        type="picture"
                        name="picture"
                        id="picture"
                        placeholder="Enter a Picture URL..."
                        className="bg-gray-50 border border-gray-300 text-lm-custom-black sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                    />
                    </div>

                    <button className='rounded-lg text-white bg-primary-dark w-full mx-0 my-4 py-2 shadow-md hover:bg-primary-color transition duration-200 ease-in'>
                    Sign Up
                    </button>
                    
                </form>
                <p className='text-white my-4 text-lm-custom-black text-sm font-medium cursor-pointer'>Sign In to your Account?</p>
            </div>
        </div>
    </div>
    </section>
  );
}