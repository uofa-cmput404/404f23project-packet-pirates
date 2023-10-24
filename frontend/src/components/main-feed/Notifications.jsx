export default function Notifications() {
  const notifications = [
    {
      username: "USERNAME1",
      imageSrc: "https://source.unsplash.com/200x200",
      type: "Requested to follow",
    },
    {
      username: "USERNAME2",
      imageSrc: "https://source.unsplash.com/200x201",
      type: "Liked your post",
    },
    {
      username: "USERNAME3",
      imageSrc: "https://source.unsplash.com/200x202",
      type: "Commented on your post",
    },
  ];

  return (
    <button
      className="notifications-container flex flex-col justify-start items-start w-fit h-full bg-white border border-gray-300 p-4 rounded-lg divide-y"
      style={{ boxShadow: "8px 8px 0px 0px rgba(0, 0, 0, 0.2)" }}
    >
      <div className="header flex flex-col justify-center items-center">
        <h2 className="text-xl font-semibold">Notifications</h2>
      </div>
      <div className="notifications">
        <ul>
          {notifications.map((notification, index) => (
            <li
              key={index}
              className="notification flex flex-row list-image-none justify-start items-center py-4 w-full"
            >
              <div className="image-container w-10 h-10 rounded-full overflow-hidden bg-black">
                <img
                  src={notification.imageSrc}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="notification-content flex flex-col ml-5">
                <span className="border border-[#A5C9CA] bg-[#A5C9CA] w-fit pl-3 pr-3 text-black rounded-full">
                  {notification.username}
                </span>
                <span className="mt-1 text-sm text-gray-500">
                  {notification.type}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </button>
  );
}
