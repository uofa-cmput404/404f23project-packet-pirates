import Post from "../main-feed/Posts";
import Profile from "../main-feed/Profile";
import Notifications from "../main-feed/Notifications";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import SearchBar from "../main-feed/Search";
import RemotePost from "../../remote/RemotePosts";

// make use of this prob https://reactrouter.com/en/main/hooks/use-params
export default function SinglePost({ user }) {
  const { postID } = useParams();
  const [post, setPost] = useState(null);
  const [friends, setFriends] = useState(null);
  const [notifications, setNotifications] = useState(null);

  const config = {
    headers: { Authorization: "Token " + localStorage.getItem("access_token") },
  };

  let location = useLocation();
  console.log("location", location.state.api);
  var api = location.state.api;
  const SC_auth = {
    auth: {
      username: "packet_pirates",
      password: "pass123$",
    },
  };

  const PP_auth = {
    auth: {
      username: "packetpirates",
      password: "cmput404",
    },
  };

  const WW_auth = {
    auth: {
      username: "packet-pirates",
      password: "12345",
    },
  };

  var auth = "";
  useEffect(() => {
    const getConnections = async () => {
      let connectionsUrl =
        "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/" +
        user.user.user_id +
        "/truefriends";
      const connectionsRes = await axios
        .get(connectionsUrl, config)
        .then((connectionsRes) => {
          console.log("CONNECTSRES", connectionsRes.data);
          setFriends(
            <Profile friends={connectionsRes.data.Friends} user={user} />
          );
        })
        .catch((error) => {
          console.error("Error getting friends:", error);
        });
    };

    const getNotifications = async () => {
      let notificationsUrl =
        "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/" +
        user.user.user_id +
        "/authornotifications";

      const notifsRes = await axios
        .get(notificationsUrl, config)
        .then((notifsRes) => {
          console.log("NOTIFSRES", notifsRes.data.Notifications);
          setNotifications(
            <Notifications
              notifications={notifsRes.data.Notifications}
              user={user}
            />
          );
        })
        .catch((error) => {
          console.error("Error getting notifications:", error);
        });
    };

    const fetchPost = async () => {
      // let postsUrl = "http://127.0.0.1:8000/" + postID + "/viewpost";
      let postsUrl = api;

      if (postsUrl.includes("packet-pirates")) {
        console.log("PIRATE!");
        auth = PP_auth;
      } else if (postsUrl.includes("super-coding")) {
        auth = SC_auth;
      } else if (postsUrl.includes("web-weavers")) {
        auth = WW_auth;
        // postsUrl = postsUrl + "/";
      }

      const postRes = await axios
        .get(postsUrl, auth)
        .then((postRes) => {
          console.log("post data", postRes.data.post);
          console.log("postRes", postRes);

          let singlePost = postRes.data;
          console.log(singlePost);
          var img = "";
          axios.get(singlePost.id + "/image", auth).then((imgRes) => {
            console.log("imgRes", imgRes.data.image);
            img = imgRes.data.image;
            setPost(
              <RemotePost
                key={api}
                user={user}
                post_author={singlePost.author}
                title={singlePost.title}
                description={singlePost.content}
                content={singlePost.content}
                img={img}
                likes={singlePost.likes_count}
                post_id={api}
              />
            );
          });
          // console.log("img1111111111111111111111111", img);
          // setPost(
          //   <RemotePost
          //     key={api}
          //     user={user}
          //     post_author={singlePost.author}
          //     title={singlePost.title}
          //     description={singlePost.content}
          //     content={singlePost.content}
          //     img={img}
          //     likes={singlePost.likes_count}
          //     post_id={api}
          //   />
          // );
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
