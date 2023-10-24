export default function CreatePost() {
  return (
    <>
      <div
        className="create-post flex flex-col bg-white border border-gray-300 p-4 w-full rounded-lg"
        style={{ boxShadow: "8px 8px 0px 0px rgba(0, 0, 0, 0.2)" }}
      >
        <div className="post-content flex flex-row">
          <div className="image-container w-12 h-12 rounded-full overflow-hidden bg-black">
            <img
              src="https://picsum.photos/200"
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="stuff-to-post flex flex-col w-[80%] ml-5">
            {/* Title Input */}
            <input
              type="text"
              placeholder="Add a title..."
              className="border border-black rounded-lg p-2 mb-4"
            />

            {/* Post Body Input */}
            <textarea
              placeholder="Anything you want to discuss?"
              className="border border-black rounded-lg p-2 h-24 mb-4"
            ></textarea>
          </div>
        </div>
        <div className="menu">
          {/* upload photo, public, plaintext, post */}
          <ul className="flex flex-row justify-between">
            <li className="mr-4 border-gray-700 border rounded-full p-2 text-white bg-gray-700">
              Upload Photo
            </li>
            <li className="mr-4 border-gray-700 border rounded-full p-2">
              Public
            </li>
            <li className="mr-4 border-gray-700 border rounded-full p-2">
              Plaintext
            </li>
            <li className="mr-4 border-gray-700 border rounded-full p-2 text-white bg-gray-700">
              Post
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
