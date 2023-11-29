import Post from "../main-feed/Posts";
import Profile from "../main-feed/Profile";
import Notifications from "../main-feed/Notifications";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import SearchBar from "../main-feed/Search";

// make use of this prob https://reactrouter.com/en/main/hooks/use-params
export default function SinglePost({ user }) {
  const { postID } = useParams();
  const [post, setPost] = useState(null);
  const [friends, setFriends] = useState(null);
  const [notifications, setNotifications] = useState(null);

  const config = {
    headers: {Authorization: 'Token ' + localStorage.getItem('access_token')}
  };

  useEffect(() => {

    const getConnections = async () => {
      let connectionsUrl =
        "http://127.0.0.1:8000/author/" +
        user.user.user_id +
        "/truefriends";
      const connectionsRes = await axios
        .get(connectionsUrl, config)
        .then((connectionsRes) => {
          console.log("CONNECTSRES", connectionsRes.data);
          setFriends(
            <Profile
              friends={connectionsRes.data.Friends}
              user={user}
            />
          );
        })
        .catch((error) => {
          console.error("Error getting friends:", error);
        });
    };

    const getNotifications = async () => {
      let notificationsUrl =
        "http://127.0.0.1:8000/author/" +
        user.user.user_id +
        "/authornotifications";

      const notifsRes = await axios
        .get(notificationsUrl, config)
        .then((notifsRes) => {
          console.log("NOTIFSRES", notifsRes.data.Notifications);
          setNotifications(
            <Notifications notifications={notifsRes.data.Notifications} user = {user} />
          );
        })
        .catch((error) => {
          console.error("Error getting notifications:", error);
        });
    };

    const fetchPost = async () => {
      let postUrl =
        "http://127.0.0.1:8000/" + postID + "/viewpost";

      const postRes = await axios
        .get(postUrl, config)
        .then((postRes) => {
            console.log("post data", postRes.data.post);
            console.log("postRes", postRes);

            let singlePost = postRes.data.post;
            const image_conditions = singlePost.image_url === '' && singlePost.image_file != ''
            const image = image_conditions ? 'http://127.0.0.1:8000' + singlePost.image_file : singlePost.image_url

            setPost(
                <Post
                user={user}
                post_author={singlePost.author}
                title={singlePost.title}
                description={singlePost.content}
                img={image}
                img_url={singlePost.image_url}
                likes={singlePost.likes_count}
                id={singlePost.post_id}
                is_private={singlePost.is_private}
                unlisted={singlePost.unlisted}/>
            );
        })
        .catch((error) => {
          console.error("Error getting posts:", error);
          setPost(
            <div className="flex justify-center items-center">
              Wasn't able to find the correct post. Is the postID correct?
            </div>
          );
        });
    };

    fetchPost(); // Call the fetchPost function
    getConnections();
    getNotifications();
  }, [postID]);

  const handleLogout = async (event) => {
    event.preventDefault();

    try {
      await axios.get("/logout", config);
      window.location.reload(false);
      console.log("logged out");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center w-screen">
        <div className="main w-full max-w-[70rem] flex flex-col justify-center items-center m-7">

          <div>
            <div className="flex flex-row w-full mx-auto">
              <div
                className="profile h-fit mx-auto"
                style={{ position: "sticky", top: "20px" }}
              >
                {friends}
              </div>
              <div className="feed flex flex-col ml-5 w-full min-w-[325px] mx-auto">
                <div className="feed_content">
                  <div>{post}</div>
                </div>
              </div>
              <div className="flex-col justify-center mx-4">
                <div className="search-bar">
                  <SearchBar />
                </div>
                <div
                  className="notifications h-fit mx-auto"
                  style={{ position: "sticky", top: "20px" }}
                >
                  {notifications}
                </div>
                <button
                  onClick={handleLogout}
                  className="sticky top-[270px] block rounded-lg text-white bg-primary-dark w-3/5 mx-auto my-4 py-2 shadow-md hover:bg-primary-color transition duration-200 ease-in"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
