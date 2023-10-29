export default function FollowNotification({ index, notification }) {
  return (
    <>
      <li
        key={index}
        className="notification flex flex-row list-image-none justify-start items-center py-4 w-full"
      >
        <div className="image-container w-10 h-10 rounded-full overflow-hidden bg-black">
          <img
            src={"http://127.0.0.1:8000" + notification.notif_author_pfp}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="notification-content flex flex-col ml-5">
          <div className="top flex flex-row justify-between">
            <span className="border border-[#A5C9CA] bg-[#A5C9CA] w-fit pl-3 pr-3 text-black rounded-full whitespace-nowrap">
              {notification.notif_author_username}
            </span>
            <div className="buttons flex flex-row">
              <button className="bg-primary-color text-white rounded-lg px-1 py-1 mx-1">
                ✔️
              </button>
              <button className="bg-primary-color text-white rounded-lg px-1 py-1 mx-1">
                ❌
              </button>
            </div>
          </div>
          <span className="mt-1 text-sm text-gray-500 whitespace-nowrap">
            {notification.message}
          </span>
        </div>
      </li>
    </>
  );
}
