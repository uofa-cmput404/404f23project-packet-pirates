import { Navigate, useNavigate } from "react-router-dom";

export default function Profile({ friends, username }) {
  const navigate = useNavigate();
  
  return (
    <>
      <div
        className="profile flex flex-col justify-center items-center w-full h-full bg-white border border-gray-300 p-4 rounded-lg divide-y"
        style={{ boxShadow: "8px 8px 0px 0px rgba(0, 0, 0, 0.2)" }}
      >
        <div className="header flex flex-col justify-center items-center">
          <div className="image-container w-24 h-24 rounded-full overflow-hidden bg-black">
            <img
              src="https://picsum.photos/200"
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="username mt-5">
            <span className="text-2xl font-bold">{username}</span>
          </div>
          <button 
            onClick={() => navigate('/profilepage')}
            className="border border-gray-700 rounded-full p-2 text-white bg-gray-700 mt-5 pl-10 pr-10">
            Edit Profile
          </button>
          <div className="flex flex-col items-center">
            <span>5</span>
            <span>Connections</span>
          </div>
        </div>
        <div className="connections">
          <ul>
            {/* max of 6 friends on display? */}
            {friends.slice(0, 6).map((friend, index) => (
              <li
                className="flex flex-row list-image-none justify-center items-center mt-3"
                key={index}
              >
                <div className="image-container w-10 h-10 rounded-full overflow-hidden bg-black">
                  <img
                    src={"http://127.0.0.1:8000" + friend.friend_pfp}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="username ml-5">
                  <span className="border border-[#A5C9CA] bg-[#A5C9CA] w-fit pl-3 pr-3 text-black rounded-full">
                    {friend.friend_username}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
