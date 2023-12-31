import CreatePost from "../main-feed/CreatePost";
import GitHubTracking from "../main-feed/GitHubTracking";
import Post from "../main-feed/Posts";
import Profile from "../main-feed/Profile";
import Notifications from "../main-feed/Notifications";
import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import SearchBar from "../main-feed/Search";

export default function MainPage({ user }) {
  const [posts, setPosts] = useState(null);
  const cookies = new Cookies();
  const [friends, setFriends] = useState();
  const [notifications, setNotifications] = useState();
  const navigate = useNavigate();

  const config = {
    headers: { Authorization: "Token " + localStorage.getItem("access_token") },
  };

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

  const NN_auth = {
    auth: {
      username: "Pirate",
      password: "Pirate",
    },
  };

  const getPosts = async () => {
    let postsUrl =
      "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/" +
      user.user.user_id +
      "/feedposts";

    const postsRes = await axios
      .get(postsUrl, config)
      .then((postsRes) => {
        setPosts(
          postsRes.data.Posts.filter((post) => !post.is_private).map(
            (post, index) => {
              const image_conditions =
                post.image_url === "" && post.image_file != "";
              const image = image_conditions
                ? "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com" +
                  post.image_file
                : post.image_url;
              return (
                <Post
                  key={index}
                  user={user}
                  post_author={post.author}
                  title={post.title}
                  content_type={post.content_type}
                  description={post.content}
                  img={image}
                  img_url={post.image_url}
                  likes={post.likes_count}
                  id={post.post_id}
                  is_private={post.is_private}
                  is_friends={post.is_friends}
                  unlisted={post.unlisted}
                />
              );
            }
          )
        );
      })
      .then(() => {})
      .catch((error) => {
        console.error("Error getting posts:", error);
      });
  };

  const getConnections = async () => {
    var url =
      "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/authors/" +
      user.user.user_id +
      "/followers";
    const connectionTest = await axios
      .get(url, PP_auth)
      .then((connectionRes) => {
        const followers = [];

        for (let i = 0; i < connectionRes.data.items.length; i++) {
          // Make foreign id the user thats logged in (packet pirates)
          followers.push(
            connectionRes.data.items[i]["url"] +
              "/followers/" +
              user.user.user_id
          );
        }

        var auth = "";
        const requests = followers.map((url) => {
          if (url.includes("packet-pirates")) {
            auth = PP_auth;
          } else if (url.includes("super-coding")) {
            auth = SC_auth;
          } else if (url.includes("web-weavers")) {
            auth = WW_auth;
            url = url + "/";
          } else if (url.includes("node-net")) {
            auth = NN_auth;
          }

          return axios
            .get(url, auth)
            .then((response) => response)
            .catch((error) => console.error("Error", error));
        });

        Promise.all(requests).then((responses) => {
          const Friends = [];

          if (responses.length == 0) {
            setFriends(<Profile friends={Friends} user={user} />);
          } else {
            for (let i = 0; i < responses.length; i++) {
              if (responses[i].data["is_follower"]) {
                // For Web Weavers
                if (responses[i].data["is_follower"] == true) {
                  let userProfile = {
                    friend_username: connectionRes.data.items[i].displayName,
                    friend_pfp: connectionRes.data.items[i].profileImage,
                  };

                  Friends.push(userProfile);
                }
              }

              if (responses[i].data == true) {
                let userProfile = {
                  friend_username: connectionRes.data.items[i].displayName,
                  friend_pfp: connectionRes.data.items[i].profileImage,
                };

                Friends.push(userProfile);
              }

              setFriends(<Profile friends={Friends} user={user} />);
            }
          } // end for
        }); // end Promise
      }); // end Then
  }; // end async

  const getNotifications = async () => {
    let notificationsUrl =
      "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/" +
      user.user.user_id +
      "/authornotifications";

    const notifsRes = await axios
      .get(notificationsUrl, config)
      .then((notifsRes) => {
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

  useEffect(() => {
    var token = cookies.get("access_token");

    const config = {
      headers: {
        Authorization: "Token " + localStorage.getItem("access_token"),
      },
    };

    //Get data on homepage load

    getPosts();
    getConnections();
    getNotifications();
    // }, [notifications, friends]);
  }, [posts]);
  // }, []);

  const handleLogout = async (event) => {
    event.preventDefault();

    try {
      await axios.get(
        "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/logout",
        config
      );
      window.location.href = "/";
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center w-screen">
        <div className="main w-full max-w-[70rem] flex flex-row justify-center m-7">
          <div className="left-feed-container w-[250px] block top-[20px] h-min sticky">
            <div className="profile h-fit mx-auto sticky top-[20px]">
              {friends}
            </div>
            <GitHubTracking user={user} />
          </div>
          <div className="feed flex flex-col ml-5 w-full mx-auto">
            <div className="">
              <CreatePost user={user} />
            </div>
            <div className="feed_content mt-5">
              <ul>{posts}</ul>
            </div>
          </div>

          <div className="flex-col justify-center mx-4">
            <div className="search-bar sticky top-[20px] z-10">
              <SearchBar />
            </div>
            <div className="flex sticky top-[83px] mb-5">
              <button
                onClick={() => navigate("/inbox")}
                className="block rounded-lg text-black bg-white w-1/2 mr-1 py-2 shadow-md hover:bg-primary-color transition duration-200 ease-in flex items-center justify-center"
              >
                <span>Inbox</span>
                <img
                  src="/inbox-button.png"
                  alt="Inbox"
                  className="inbox-button-img ml-3 h-7.5 w-10"
                />
              </button>

              <button
                onClick={handleLogout}
                className="block rounded-lg text-black bg-white w-1/2 ml-1 py-2 shadow-md hover:bg-primary-color transition duration-200 ease-in flex items-center justify-center"
              >
                <span>Logout</span>
                <img
                  src="/logout-button.png"
                  alt="Logout"
                  className="Logout-button-img ml-3 h-7.5 w-10"
                />
              </button>
            </div>
            <div
              className="notifications h-fit mx-auto"
              style={{ position: "sticky", top: "155px" }}
            >
              {notifications}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
