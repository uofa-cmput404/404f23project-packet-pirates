export default function Notifications({ notifications }) {
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
            <FollowNotification
              key={index}
              index={index}
              notification={notification}
            />
          ))}
        </ul>
      </div>
    </button>
  );
}

export function FollowNotification({ index, notification }) {
  const isFollowRequest = notification.is_follow_notification;

  return (
    <li
      key={index}
      className="notification flex flex-row list-image-none justify-start items-center py-4 w-full"
    >
      <div className="image-container w-10 h-10 rounded-full overflow-hidden bg-black">
        <img
          src={notification.notif_author_pfp}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="notification-content flex flex-col ml-5">
        <div className="top flex flex-row justify-between items-center">
          <span className="border border-[#A5C9CA] bg-[#A5C9CA] w-fit pl-3 pr-3 text-black rounded-full whitespace-nowrap">
            {notification.notif_author_username}
          </span>
          {isFollowRequest && (
            <div className="buttons flex flex-row">
              <button className="bg-primary-color text-white rounded-lg px-1 py-1 mx-1">
                ✔️
              </button>
              <button className="bg-primary-color text-white rounded-lg px-1 py-1 mx-1">
                ❌
              </button>
            </div>
          )}
        </div>
        <span className="mt-1 text-sm text-gray-500 whitespace-nowrap">
          {notification.message}
        </span>
      </div>
    </li>
  );
}