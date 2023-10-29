export default function NormalNotification({ index, notification }) {
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
          <span className="border border-[#A5C9CA] bg-[#A5C9CA] w-fit pl-3 pr-3 text-black rounded-full whitespace-nowrap">
            {notification.notif_author_username}
          </span>
          <span className="mt-1 text-sm text-gray-500 whitespace-nowrap">
            {notification.message}
          </span>
        </div>
      </li>
    </>
  );
}
