import axios from "axios";

export default function Notifications({ notifications , user}) {
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
            <Notification
              key={index}
              user = {user}
              index={index}
              notification={notification}
            />
          ))}
        </ul>
      </div>
    </button>
  );
}

const config = {
  headers: {'Authorization': 'Token ' + localStorage.getItem('access_token')}
};

export function Notification({ user, index, notification }) {
  const isFollowRequest = notification.is_follow_notification;

  const requestDeclined = async (event) => {

    console.log("USERERERERE", user)

    //Delete notif and request
    let notificationUrl =
    "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/api/" + user.user.user_id + "/createnotif";

    let followrequestUrl =
    "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/api/" + user.user.user_id + "/followrequest";

    const notifData = {
      notif_id : notification.notif_id
    }

    const requestData = {
      sender :  notification.notification_author,
      recipient : user.user.user_id
    }

    const notifRes = await axios.delete(notificationUrl, config, {data: notifData, headers: {'Authorization': 'Token ' + localStorage.getItem('access_token')}})
    .then((notifRes) => {
      window.location.reload(false);
    })
    .catch((err) => { 
      console.error("Error deleting notification:", err);
    })

    const requestRes = await axios.delete(followrequestUrl, config, {data: requestData, headers: {'Authorization': 'Token ' + localStorage.getItem('access_token')}})
    .then((requestRes) => {
      
    })
    .catch((err) => {
      console.error("Error deleting follow request:", err);
    })

  }

  const requestAccepted = async (event) => {
    
    //Remove notif and request, create friend
    console.log("USERERERERE", user)

    //Delete notif and request
    let notificationUrl =
    "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/api/" + user.user.user_id + "/createnotif";

    let followrequestUrl =
    "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/api/" + user.user.user_id + "/followrequest";

    const notifData = {
      notif_id : notification.notif_id
    }

    const requestData = {
      sender :  notification.notification_author,
      recipient : user.user.user_id
    }

    const notifRes = await axios.delete(notificationUrl, {data: notifData}, config)
    .then((notifRes) => {
      // window.location.reload(false);
    })
    .catch((err) => {
      console.error("Error deleting notification:", err);
    })

    const requestRes = await axios.delete(followrequestUrl, {data: requestData}, config)
    .then((requestRes) => {
      
    })
    .catch((err) => {
      console.error("Error deleting follow request:", err);
    })


    let friendUrl =
    "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/api/" + user.user.user_id + "/friends";

    const friendData = {
      author : user.user.user_id,
      friend : notification.notification_author,
      friend_pfp : notification.notif_author_pfp,
      friend_username : notification.notif_author_username
    }

    const friendRes = await axios.post(friendUrl, friendData, config)
    .then((friendRes) => {
      window.location.reload(false);
    })
    .catch((err) => {
      console.error("Error creating friend:", err);
    })

  }


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
              <button 
              className="bg-primary-color text-white rounded-lg px-1 py-1 mx-1"
              onClick = {requestAccepted}
              >
                ✔️
              </button>
              <button className="bg-primary-color text-white rounded-lg px-1 py-1 mx-1"
              onClick = {requestDeclined}
              >
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