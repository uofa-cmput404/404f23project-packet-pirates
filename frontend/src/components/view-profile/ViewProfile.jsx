import CreatePost from "../main-feed/CreatePost";
import Post from "../main-feed/Posts";
import Profile from "../main-feed/Profile";
import Notifications from "../main-feed/Notifications";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import SearchBar from "../main-feed/Search";
import RemotePost from "../../remote/RemotePosts";

// make use of this prob https://reactrouter.com/en/main/hooks/use-params
export default function ViewProfile({ user }) {

  const { author } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [postauthor, setPostauthor] = useState(null);
  const [friends, setFriends] = useState(null);
  const [notifications, setNotifications] = useState(null);
  const [authorInfo, setAuthorInfo] = useState(null);
  const [profileHeader, setProfileHeader] = useState(null);

  const [is_pending, set_is_pending] = useState(null);
  const [areFriends, setAreFriends] = useState(null);
  const [isFollowing, setIsFollowing] = useState(null);
  const [showFollowPopup, setShowFollowPopup] = useState(false);

  const [followButtons, setFollowButtons] = useState(null);
  const navigate = useNavigate();

  // const [imgUrl, setImgUrl] = useState(null);

  var imgUrl = "";

  let location = useLocation();

  const fake_user = {
    profile_picture: "https://i.imgur.com/7bIhcuD.png",
    username: "fake_user",
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + localStorage.getItem("access_token"),
    },
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

  var auth = "";
  var host = new URL(location.state["api"]).hostname;
  var ownProfile = user.user.user_id === location.state["api"].split("/")[4];

  useEffect(() => {
    const getUrl = "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com";
    setIsLoading(true);

    fetchPostData(); // Call the fetchPosts function
    // }, []);
  }, []);

  useEffect(() => {
    getNotifications();
    getConnections();
  }, [notifications]);
  // }, [])

  useEffect(() => {
    getAuthorInfo();
    checkFriendship();
  }, [author, is_pending, areFriends, isFollowing, showFollowPopup]);

  async function getNotifications() {
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
  }

  async function getConnections() {
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
  } // end async

  async function fetchPostData() {
    let url = location.state["api"] + "/posts";
    let host = new URL(location.state["api"]).hostname;

    const postUrls = [];

    //Corresponding authorization
    let auth = "";
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

    try {
      await axios.get(url, auth).then((posts) => {
        //Get profile images and likes
        const imageUrls = [];
        const likeUrls = [];

        let allPosts = [];
        if (url.includes("web-weavers")) {
          allPosts = posts["data"]["items"];
        } else {
          allPosts = posts["data"];
        }

        //Create array of url-auth pairs again :(
        for (let res in allPosts) {
          //Post url
          let imUrl = allPosts[res]["id"] + "/image";

          //Likes url
          let likUrl = allPosts[res]["id"] + "/likes";

          //Corresponding authorization
          let auth = "";
          if (imUrl.includes("packet-pirates")) {
            auth = PP_auth;
          } else if (imUrl.includes("super-coding")) {
            auth = SC_auth;
          } else if (imUrl.includes("web-weavers")) {
            auth = WW_auth;
            imUrl = imUrl + "/";
            likUrl = likUrl + "/";
          } else if (imUrl.includes("node-net")) {
            auth = NN_auth;
          }

          imageUrls.push([imUrl, auth]);
          likeUrls.push([likUrl, auth]);
        }

        //Send request for each url-auth
        const imgRequests = imageUrls.map(([url, auth]) =>
          axios
            .get(url, auth)
            .then((response) => response)
            .catch((error) => console.error("Error", error))
        );

        const likRequests = likeUrls.map(([url, auth]) =>
          axios
            .get(url, auth)
            .then((response) => response)
            .catch((error) => console.error("Error", error))
        );

        Promise.all(imgRequests).then((images) => {
          Promise.all(likRequests).then((likes) => {
            if (author === user.user.username) {
              setPosts(() => [
                allPosts.map((res, index) => {
                  let image = "";
                  let num_likes = 0;

                  if (res.id.includes("packet-pirates")) {
                    image = images[index]["data"];
                    num_likes = likes[index]["data"]["length"];
                  } else if (res.id.includes("super-coding")) {
                    image = images[index]["data"]["image"];
                    num_likes = likes[index]["data"]["length"];
                  } else if (res.id.includes("web-weavers")) {
                    // Change this to the post data here
                    if (allPosts[index]) {
                      image =
                        "data:" +
                        posts[index]["data"].contentType +
                        "," +
                        posts[index]["data"].content;
                    } else {
                      image = "";
                    }

                    num_likes = likes[index]["data"]["items"]["length"];
                  } else if (res.data.id.includes("node-net")) {
                    image = "https://picsum.photos/200/300";
                    num_likes = likes[index]["data"]["length"];
                  }

                  return (
                    <RemotePost
                      key={index}
                      user={user}
                      post_author={res.author}
                      title={res.title}
                      description={res.description}
                      content={res.content}
                      img={image}
                      likes={num_likes}
                      post_id={res.id}
                      categories={res.categories}
                      contentType={res.contentType}
                      count={res.count}
                      origin={res.origin}
                      published={res.published}
                      source={res.source}
                      unlisted={res.unlisted}
                      visibility={res.visibility}
                    />
                  );
                }),
              ]);
            } else {
              setPosts(() => [
                allPosts
                  .filter(
                    (post) =>
                      !post.unlisted &&
                      post.visibility.toUpperCase() == "PUBLIC"
                  )
                  .map((res, index) => {
                    let image = "";
                    let num_likes = 0;
                    index = allPosts.indexOf(res);

                    if (res.id.includes("packet-pirates")) {
                      image = images[index]["data"];
                      num_likes = likes[index]["data"]["length"];
                    } else if (res.id.includes("super-coding")) {
                      image = images[index]["data"]["image"];
                      num_likes = likes[index]["data"]["length"];
                    } else if (res.id.includes("web-weavers")) {
                      // Change this to the post data here
                      if (allPosts[index]) {
                        image =
                          "data:" +
                          posts["data"]["items"][index].contentType +
                          "," +
                          posts["data"]["items"][index].content;
                      } else {
                        image = "";
                      }

                      num_likes = likes[index]["data"]["items"]["length"];
                    } else if (res.data.id.includes("node-net")) {
                      image = "https://picsum.photos/200/300";
                      num_likes = likes[index]["data"]["length"];
                    }

                    return (
                      <RemotePost
                        key={index}
                        user={user}
                        post_author={res.author}
                        title={res.title}
                        description={res.description}
                        content={res.content}
                        img={image}
                        likes={num_likes}
                        post_id={res.id}
                        categories={res.categories}
                        contentType={res.contentType}
                        count={res.count}
                        origin={res.origin}
                        published={res.published}
                        source={res.source}
                        unlisted={res.unlisted}
                        visibility={res.visibility}
                      />
                    );
                  }),
              ]);
            }
          });
        });
      });
    } catch (error) {
      console.error("Error getting posts:", error);
      setPosts(
        <div className="flex justify-center items-center">
          This user has no posts
        </div>
      ); // end catch error
    }
  }

  async function checkFriendship() {
    // Check if Sasuke is a friend of Packet, if so, we want to let packet be able to remove them as a follower
    const followersUrl =
      "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/authors/" +
      user.user.user_id +
      "/followers/" +
      location.state["api"].split("/")[4];

    // Check if Sasuke follow request to Packet still exists, if it does, disable the remove follower button.
    const followReqUrl =
      "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/" +
      user.user.user_id +
      "/followrequest/" +
      location.state["api"].split("/")[4] +
      "/ispending";

    // We can check if packet pirates is a friend of Sasuke
    var followingUrl =
      location.state["api"] + "/followers/" + user.user.user_id;

    const urls = [];

    try {
      const response = await axios
        .get(followersUrl, PP_auth)
        .then(async (data) => {
          setAreFriends(data["data"]);
        });


      if (host.includes("packet-pirates")) {
        auth = PP_auth;
      } else if (host.includes("super-coding")) {
        auth = SC_auth;
      } else if (host.includes("web-weavers")) {
        auth = WW_auth;
        followingUrl = followingUrl + "/";
      } else if (host.includes("node-net")) {
        auth = NN_auth;
      }

      const followingResponse = await axios
        .get(followingUrl, auth)
        .then(async (data) => {
          if (host.includes("packet-pirates")) {
            setIsFollowing(data["data"]);
          } else {
            setIsFollowing(data["data"]["is_follower"]);
          }
        });

    } catch (error) {
      console.error("Error checking friendship:", error);
    }
  }
  const getAuthorInfo = async () => {
    let authUrl = location.state["api"];

    if (host.includes("packet-pirates")) {
      auth = PP_auth;
    } else if (host.includes("super-coding")) {
      auth = SC_auth;
    } else if (host.includes("web-weavers")) {
      auth = WW_auth;
      authUrl = authUrl + "/";
    } else if (host.includes("node-net")) {
      auth = NN_auth;
    }

    const authRes = await axios
      .get(authUrl, auth)
      .then((authRes) => {
        imgUrl = authRes.data.profileImage;
        setAuthorInfo((authorInfo) => authRes.data);
        setProfileHeader(
          <div className="top-box bg-white p-4 mb-4 text-center rounded-md flex flex-col items-center top-0 border border-gray-300 shadow-md">
            {/* User's Profile Picture */}
            <img
              src={authRes.data.profileImage}
              alt={`${user.user.username}'s Profile`}
              className="w-12 h-12 rounded-full object-cover mb-4"
            />

            {/* User's Name */}
            <h2 className="text-xl font-semibold mb-2">
              {author + "'s profile"}
            </h2>

            <div className="flex space-x-4">
              {!ownProfile && isFollowing !== null && (
                <>
                  {!isFollowing && (
                    <button
                      className="bg-blue-500 text-white px-2 py-2 rounded-md w-24"
                      onClick={handleFollow}
                    >
                      Follow
                    </button>
                  )}

                  {showFollowPopup && (
                    <div className="follow-popup">Follow request sent!</div>
                  )}

                  {isFollowing && (
                    <button
                      className="bg-gray-500 text-white px-2 py-2 rounded-md cursor-not-allowed w-24"
                      onClick={handleFollow}
                      disabled
                    >
                      Following
                    </button>
                  )}

                  {areFriends && (
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-md w-24"
                      onClick={handleRemove}
                    >
                      Remove
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFollow = async (event) => {
    event.preventDefault();
    // var apiString = location.state['api'];
    var profile_author_id = location.state["api"].split("/")[4];

    var auth_github = "";

    if (user.user.github) {
      auth_github = user.user.github;
    } else {
      auth_github = "";
    }

    var responseData = "";
    if (host.includes("web-weavers")) {
      responseData = {
        type: "Follow",
        summary: user.user.username + " wants to follow " + author,
        actor:
          "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/authors/" +
          user.user.user_id,
        object: location.state["api"],
      };
    } else {
      responseData = {
        type: "Follow",
        summary: user.user.username + " wants to follow " + author,
        actor: {
          type: "author",
          uuid: user.user.user_id,
          id:
            "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/authors/" +
            user.user.user_id,
          url:
            "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/authors/" +
            user.user.user_id,
          host: "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/",
          displayName: user.user.username,
          github: auth_github,
          profileImage:
            "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com" +
            user.user.profile_picture,
        },
        object: {
          type: "author",
          uuid: profile_author_id,
          id: location.state["api"],
          url: location.state["api"],
          host: "https://" + new URL(location.state["api"]).hostname + "/",
          displayName: author,
          github: "",
          profileImage: imgUrl,
        },
      };
    }

    // Show follow request popup
    setShowFollowPopup(true);

    // Set a timer to hide the popup after 3 seconds
    const timer = setTimeout(() => {
      setShowFollowPopup(false);
    }, 3000);

    var url = location.state["api"] + "/inbox";
    if (host.includes("packet-pirates")) {
      auth = PP_auth;
    } else if (host.includes("super-coding")) {
      auth = SC_auth;
    } else if (host.includes("web-weavers")) {
      auth = WW_auth;
      url = url + "/";
    } else if (host.includes("node-net")) {
      auth = NN_auth;
    }

    axios.post(url, responseData, auth);
  };

  const handleRemove = async (event) => {
    event.preventDefault();

    let removeUrl =
      "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/" +
      user.user.user_id +
      "/unfriend/" +
      location.state["api"].split("/")[4];

    try {
      const res = await axios.delete(removeUrl).then((res) => {
        setAreFriends(false);
      });
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
              <div className="feed flex flex-col ml-5 w-full mx-auto min-w-[620px]">
                <div className="feed_content mt-[-20px]">
                  {profileHeader}
                  {/* this is where the follow shit is */}
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
                    onClick={() => {
                      navigate("/");
                    }}
                    className="block rounded-lg text-black bg-white w-1/2 ml-1 py-2 shadow-md hover:bg-primary-color transition duration-200 ease-in flex items-center justify-center"
                  >
                    <span>Home</span>
                    <img
                      src="/home-button.png"
                      alt="Home"
                      className="Home-button-img ml-3 h-7.5 w-10"
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
        </div>
      </div>
    </>
  );
}
