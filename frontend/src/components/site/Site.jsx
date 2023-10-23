import axios from "axios";
export default function Site() {
  const getAuthor = async () => {
    const res = await axios.get("http://localhost:8000/api/authors/");
    console.log(res.data);
  };

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                My Feed
              </h1>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <div className="make-post">
                <textarea
                  placeholder="What's on your mind?"
                  className="w-full bg-gray-100 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                ></textarea>
                <button className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover-bg-primary-700 dark:focus:ring-primary-800">
                  Post
                </button>
              </div>
              <div className="post">
                <div className="post-user-info">
                  <img src="user-profiles/user1.jpg" alt="User 1" />
                  <span>User 1</span>
                </div>
                <p>This is a sample post. #SocialMedia</p>
              </div>
              <div className="post">
                <div className="post-user-info">
                  <img src="user-profiles/user2.jpg" alt="User 2" />
                  <span>User 2</span>
                </div>
                <p>Hello World!</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}