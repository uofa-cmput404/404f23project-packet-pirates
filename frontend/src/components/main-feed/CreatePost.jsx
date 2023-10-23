export default function CreatePost() {
  return (
    <>
      <div className="create-post flex flex-col bg-white border border-gray-300 shadow-sm p-4 w-full">
        <div className="post-content flex flex-row">
          <div className="image-container">
            <img
              src="https://picsum.photos/200"
              alt="profile"
              className="rounded-full w-16 h-16"
            />
          </div>
          <div className="stuff-to-post flex flex-col">
            {/* Title Input */}
            <input
              type="text"
              placeholder="Add a title..."
              className="border border-gray-300 rounded p-2 mb-4"
            />

            {/* Post Body Input */}
            <textarea
              placeholder="Anything you want to discuss?"
              className="border border-gray-300 rounded p-2 h-32 mb-4"
            ></textarea>
          </div>
        </div>
        <div className="menu flex flex-row">
          {/* upload photo, public, plaintext, post */}
          <ul className="flex flex-row">
            <li className="mr-4">Upload Photo</li>
            <li className="mr-4">Public</li>
            <li className="mr-4">Plaintext</li>
            <li className="mr-4">Post</li>
          </ul>
        </div>
      </div>
    </>
  );
}
