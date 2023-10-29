import { useEffect } from "react";
import FollowNotification from "./FollowNotification";
import NormalNotification from "./NormalNotification";

export default function Notifications({ notifications }) {
  useEffect(() => {
    console.log("notifications", notifications[0]);
  });
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
            // notification.isFollow ? (
            //   <FollowNotification key={index} notification={notification} />
            // ) : (
            //   <NormalNotification key={index} notification={notification} />
            // )
            <FollowNotification index={index} notification={notification} />
          ))}
        </ul>
      </div>
    </button>
  );
}
