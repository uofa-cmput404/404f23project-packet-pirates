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
  useEffect(() => {
    console.log("user", user);
    console.log("user.user", user.user);
  }, []);
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

  const [followButtons, setFollowButtons] = useState(null);
  const navigate = useNavigate();

  // const [imgUrl, setImgUrl] = useState(null);

  var imgUrl = "";

  let location = useLocation();
  console.log("location", location);
  console.log("location host", location.state["api"]);
  console.log("HOSTNAME:", new URL(location.state["api"]).hostname);

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


  useEffect(() => {
    const getUrl = "http://127.0.0.1:8000";
    setIsLoading(true);
    console.log("author", author);
    console.log("user", user);

    const getConnections = async () => {
    // let connectionsUrl =
    //   "http://127.0.0.1:8000/author/" + user.user.user_id + "/truefriends";

    // const connectionsRes = await axios
    //   .get(connectionsUrl, config)
    //   .then((connectionsRes) => {
    //     console.log("CONNECTSRES", connectionsRes.data.Friends);
    //     setFriends(
    //       <Profile friends={connectionsRes.data.Friends} user={user} />
    //     );
    //   })
    //   .catch((error) => {
    //     console.error("Error getting friends:", error);
    //   });

    var url  = "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/authors/" + user.user.user_id + "/followers";
    const connectionTest = await axios
    .get(url, PP_auth)
    .then((connectionRes) => {
      console.log('connectionTestRes', connectionRes.data);
      const followers = [];
      
      for (let i = 0; i < connectionRes.data.items.length; i++) { // Make foreign id the user thats logged in (packet pirates)
        // console.log("FOLOWER TESTTTT",  connectionTestRes.data.items[i]['url'] + "/followers/" + user.user.user_id)
        followers.push(connectionRes.data.items[i]['url'] + "/followers/" + user.user.user_id)
      }

      console.log(followers)
      var auth = ''
      const requests = followers.map((url) => {
        
        if (url.includes("packet-pirates")) {
          console.log("PIRATE!");
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
          .catch((error) => console.error("Error", error))
      }
    );

      Promise.all(requests).then((responses) => {
        console.log("RESPONSES", responses)
        console.log(responses.length)
        const Friends = []
        
        if (responses.length == 0) {
          setFriends(
            <Profile friends={Friends} user={user} />
          );
        } else {
        
          for (let i = 0; i < responses.length; i++) {

            if (responses[i].data['is_follower']) { // For Web Weavers
              if (responses[i].data['is_follower'] == true) {
                let userProfile = {
                  friend_username: connectionRes.data.items[i].displayName,
                  friend_pfp: connectionRes.data.items[i].profileImage
                }
                  console.log("friend_username", connectionRes.data.items[i].displayName)
                  console.log("friend_pfp", connectionRes.data.items[i].profileImage)
                Friends.push(userProfile)
              }
            }

            if (responses[i].data == true) {
              let userProfile = {
                friend_username: connectionRes.data.items[i].displayName,
                friend_pfp: connectionRes.data.items[i].profileImage
              }
                console.log("friend_username", connectionRes.data.items[i].displayName)
                console.log("friend_pfp", connectionRes.data.items[i].profileImage)
              Friends.push(userProfile)
            }  

            console.log("FRIENDS", Friends)
            setFriends(
              <Profile friends={Friends} user={user} />
            );
          }
        } // end for
      }); // end Promise

    }); // end Then
}; // end async

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

    let auth = "";
    const fetchPosts = async () => {
      let postsUrl =
        // "http://127.0.0.1:8000/author/" + author + "/feedposts_byusername";
        location.state["api"] + "/posts";
      let host = new URL(location.state["api"]).hostname;

      if (host.includes("packet-pirates")) {
        console.log("PIRATE!");
        auth = PP_auth;
      } else if (host.includes("super-coding")) {
        auth = SC_auth;
      } else if (host.includes("web-weavers")) {
        auth = WW_auth;
        postsUrl = postsUrl + "/";
      } else if (host.includes("node-net")) {
        auth = NN_auth;
      }

      const postsRes = await axios
        .get(postsUrl, auth)
        .then((postsRes) => {
          console.log("POSTSRES", postsRes.status);
          console.log("posts", postsRes.data);
          const urls = [];

          var postData = "";
          if (postsRes.data.items) {
            postData = postsRes.data.items;
          } else {
            postData = postsRes.data;
          }

          for (let i = 0; i < postData.length; i++) {
            console.log(postData[i]["id"] + "/image");
            urls.push(postData[i]["id"] + "/image");
          }

          console.log("URLS", urls);

          const requests = urls.map((url) =>
            axios
              .get(url, auth)
              .then((response) => response)
              .catch((error) => console.error("Error", error))
          );

          Promise.all(requests).then((responses) => {
            // console.log("RESPONSES", responses);
            // console.log("RESPONSE", responses[0]['data']['image'])

            if (author === user.user.username) {
              setPosts(
                postData.map((post, index) => {
                  // As the user, want to be able to see your all your posts.
                  const image = responses[index]["data"];
                  return (
                    <RemotePost
                      key={index}
                      user={user}
                      post_author={post.author}
                      title={post.title}
                      description={post.description}
                      content={post.content}
                      img={image}
                      likes={post.likes_count}
                      post_id={post.id}
                    />
                  );
                })
              );
            } else {
              setPosts(
                postData
                  .filter((post) => !post.unlisted && (post.visibility.toUpperCase() == "PUBLIC"))
                  .map((post, index) => {
                    var image = "";
                    if (host.includes("super-coding")) {
                      image = responses[index]["data"]["image"];
                    } else if (host.includes("web-weavers")) {
                      image = "https://picsum.photos/200/300";
                    } else if (host.includes("node-net")) {
                      image = "https://picsum.photos/200/300";
                    } else {
                      image = responses[index]["data"];
                    }
                    return (
                      <RemotePost
                        key={index}
                        user={user}
                        post_author={post.author}
                        title={post.title}
                        description={post.description}
                        content={post.content}
                        img={image}
                        likes={post.likes_count}
                        post_id={post.id}
                      />
                    ); // end return
                  }) // end map
              ); // end setPosts
            } // end else
          });
        })

        .catch((error) => {
          console.error("Error getting posts:", error);
          setPosts(
            <div className="flex justify-center items-center">
              This user does not exists, did you enter the correct username?
            </div>
          ); // end catch error
        }); //
    }; // end fetchPosts

    fetchPosts(); // Call the fetchPosts function
    getConnections();
    getNotifications();
    getAuthorInfo();
    console.log("posts", posts);
  }, [author, is_pending, areFriends]);

  const getAuthorInfo = async () => {
    let authUrl = location.state["api"];

    if (host.includes("packet-pirates")) {
      console.log("PIRATE!");
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
        console.log("DATA", authRes.data);
        console.log(authRes.data.profileImage);
        // setImgUrl(authRes.data.profileImage);
        imgUrl = authRes.data.profileImage;
        console.log("IMGURL", imgUrl);
        setAuthorInfo((authorInfo) => authRes.data);
        // console.log("AUTHORINFO", authorInfo);
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

            {areFriends && !is_pending && (
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={handleUnfollow}
              >
                Unfollow
              </button>
            )}

            {!areFriends && !is_pending && (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={handleFollow}
              >
                Follow
              </button>
            )}

            {is_pending && !areFriends && (
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                disabled
              >
                Pending
              </button>
            )}
          </div>
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleLogout = async (event) => {
    event.preventDefault();

    try {
      await axios.get("http://127.0.0.1:8000/logout", config);
      window.location.reload(false);
      console.log("logged out");
    } catch (err) {
      console.log(err);
    }
  };

  const handleFollow = async (event) => {
    // console.log("FOLLOWING");
    // console.log(author);
    // console.log("this is the user" + user.user);
    // console.log(user.user.username);
    // console.log(imgUrl);
    event.preventDefault();
    // var apiString = location.state['api'];
    var profile_author_id = location.state['api'].split('/')[4]
    console.log("POSTING", location.state['api'], profile_author_id);

    var auth_github = ''

    if (user.user.github) {
      auth_github = user.user.github
    } else {
      auth_github = ''
    }

    var responseData = ''
    if (host.includes("web-weavers")) {
        responseData = {
          type: "Follow",
          summary: user.user.username + " wants to follow " + author,
          actor: "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/authors/" + user.user.user_id,
          object: location.state["api"]
          }

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

   

    var url = location.state["api"] + "/inbox"
    if (host.includes("packet-pirates")) {
      console.log("PIRATE!");
      auth = PP_auth;
    } else if (host.includes("super-coding")) {
      auth = SC_auth;
    } else if (host.includes("web-weavers")) {
      auth = WW_auth;
      url = url + '/';
    } else if (host.includes("node-net")) {
      auth = NN_auth;
    }
    
    console.log("RESPONSE DATA", responseData);
    axios.post(url, responseData, auth);
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
              <div className="feed flex flex-col ml-5 w-full mx-auto">
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
        </div>
      </div>
    </>
  );
}
