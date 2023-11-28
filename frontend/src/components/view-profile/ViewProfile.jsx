import CreatePost from "../main-feed/CreatePost";
import Post from "../main-feed/Posts";
import Profile from "../main-feed/Profile";
import Notifications from "../main-feed/Notifications";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import SearchBar from "../main-feed/Search";

// make use of this prob https://reactrouter.com/en/main/hooks/use-params
export default function ViewProfile({ user }) {
  useEffect(() => {
    console.log("user", user);
    console.log("user.user", user.user);
  }, []);
  // check if author exists
  // if not, return 404
  // if yes, return profile
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

  let location = useLocation();
  console.log("location", location);
  console.log("location host", location.state['api']);
  console.log("HOSTNAME:", new URL(location.state['api']).hostname)

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
      username: 'packet_pirates',
      password: 'pass123$'
    }
  }

  const PP_auth = {
    auth: {
      username: 'packetpirates',
      password: 'cmput404'
    }
  }

  useEffect(() => {
    const getUrl = "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com";
    setIsLoading(true);
    console.log("author", author);
    console.log("user", user);

    // const getConnections = async () => {
    //   let connectionsUrl =
    //     "http://127.0.0.1:8000/author/" + user.user.user_id + "/truefriends";
    //   const connectionsRes = await axios
    //     .get(connectionsUrl, config)
    //     .then((connectionsRes) => {
    //       console.log("CONNECTSRES", connectionsRes.data);
    //       setFriends(
    //         <Profile
    //           friends={connectionsRes.data.Friends}
    //           // username={user.user.username}
    //           user={user}
    //         />
    //       );
    //     })
    //     .catch((error) => {
    //       console.error("Error getting friends:", error);
    //     });
    // };

    // const getProfile = async () => {
    //   try {
    //     const profileUrl = `${getUrl}/user/${author}`;
    //     const profileRes = await axios.get(profileUrl, config);
    //     setProfile(profileRes.data);
    //   } catch (error) {
    //     console.error("Error getting profile:", error);
    //   }
    // };

    // const getNotifications = async () => {
    //   let notificationsUrl =
    //     "http://127.0.0.1:8000/author/" +
    //     user.user.user_id +
    //     "/authornotifications";

    //   const notifsRes = await axios
    //     .get(notificationsUrl, config)
    //     .then((notifsRes) => {
    //       console.log("NOTIFSRES", notifsRes.data.Notifications);
    //       setNotifications(
    //         <Notifications
    //           notifications={notifsRes.data.Notifications}
    //           user={user}
    //         />
    //       );
    //     })
    //     .catch((error) => {
    //       console.error("Error getting notifications:", error);
    //     });
    // };
    let auth = ''
    const fetchPosts = async () => {
      let postsUrl =
        // "http://127.0.0.1:8000/author/" + author + "/feedposts_byusername";
        location.state['api'] + '/posts'
      let host = new URL(location.state['api']).hostname

      if (host.includes('packet-pirates')) {
        console.log("PIRATE!")
        auth = PP_auth
      } else if (host.includes("super-coding")) {
        auth = SC_auth
      }
    
      const postsRes = await axios
        .get(postsUrl, auth)
        .then((postsRes) => {
          console.log("POSTSRES", postsRes.status);
          console.log("posts", postsRes.data);
          const urls = []

          for (let i = 0; i < postsRes.data.length; i++) {
            console.log(postsRes.data[i]['id'] + '/image')
            urls.push(postsRes.data[i]['id'] + '/image')
          }

          console.log("URLS", urls)

          const requests = urls.map(url =>
            axios.get(url)
            .then(response => response)
            .catch (error => console.error('Error', error))
          );

          Promise.all(requests)
          .then(responses => {
            console.log("RESPONSES", responses);
            console.log(responses[0]['data'])
            if ((author === user.user.username)) {
              setPosts(
                postsRes.data.map((post, index) => {
                  // As the user, want to be able to see your all your posts.
                  const image = responses[index]['data']
                  return (
                    <Post
                      key={index}
                      user={user}
                      post_author={post.author}
                      title={post.title}
                      description={post.content}
                      img={image}
                      img_url={post.image_url}
                      likes={post.likes_count}
                      id={post.post_id}
                      is_private={post.is_private}
                      unlisted={post.unlisted}
                    />
                  );
                })
              );
            } else {
              setPosts(
                postsRes.data.Posts.filter(
                  (post) => !post.unlisted && !post.is_private
                ).map((post, index) => {
                  const image = responses[index]['data']

                  return (
                    <Post
                      key={index}
                      user={user}
                      post_author={post.author}
                      title={post.title}
                      description={post.content}
                      img={image}
                      img_url={post.image_url}
                      likes={post.likes_count}
                      id={post.post_id}
                      is_private={post.is_private}
                      unlisted={post.unlisted}
                    />
                  ); // end return
                }) // end map
              ); // end setPosts
            } // end else
          })
          })


    .catch((error) => {
      console.error("Error getting posts:", error);
      setPosts(
        <div className="flex justify-center items-center">
          This user does not exists, did you enter the correct username?
        </div>
      );// end catch error
    }); // 
  }; // end fetchPosts 

    const checkFriendship = async () => {
        let authorUrl = "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/" + author + "/username";
        const authReso = await axios
        .get(authorUrl, config)
        .then(async (authReso) => {
        
          const followersUrl = "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/authors/" + authReso.data.Author.user_id  + "/followers/" + user.user.user_id + "/local";
          
          const followReqUrl = "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/" + user.user.user_id + "/followrequest/" + authReso.data.Author.user_id + "/ispending"

          try {
            const response = await axios
              .get(followersUrl, config)
              .then(async (data) => {
                setAreFriends(data["data"]);
                console.log("FFF", data["data"]);
                console.log("FRIENDS?", areFriends);
                // console.log(response.data)
              });

            const followReqResponse = await axios
              .get(followReqUrl, config)
              .then(async (data) => {
                set_is_pending(data["data"]);
                console.log("PENDING?", is_pending);
              });
          } catch (error) {
            console.error("Error checking friendship:", error);
          }
        });
    };

    // getProfile(); // Call the getProfile function
    fetchPosts(); // Call the fetchPosts function
    // getConnections();
    // getNotifications();
    // getAuthorInfo();
    // checkFriendship();
    //location.reload()
    console.log("posts", posts);
  }, [author, is_pending, areFriends]);

  const getAuthorInfo = async () => {

    let authUrl = "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/" + author + "/username";

    const authRes = await axios
      .get(authUrl, config)
      .then((authRes) => {
        setAuthorInfo((authorInfo) => authRes.data.Author);

        setProfileHeader(
          <div className="top-box bg-white p-4 mb-4 text-center rounded-md flex flex-col items-center top-0 border border-gray-300 shadow-md">
            {/* User's Profile Picture */}
            <img
              src={
                "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com" + authRes.data.Author.profile_picture
              }
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
      await axios.get("https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/logout", config);
      window.location.reload(false);
      console.log("logged out");
    } catch (err) {
      console.log(err);
    }
  };

  // console.log("AUTHOR INFO", authorInfo)

  const handleFollow = async (event) => {
    event.preventDefault();

    let authorUrl = 
    "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/" + author + "/username";

    let notificationUrl =
    "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/" + user.user.user_id + "/createnotif";

    let followrequestUrl =
    "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/" + user.user.user_id + "/followrequest";

    const authReso = await axios
      .get(authorUrl, config)
      .then(async (authReso) => {
        const notifdata = {
          author: author,
          notification_author: user.user.user_id,
          notif_author_pfp: "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com" + user.user.profile_picture,
          notif_author_username: user.user.username,
          message: "Requested to follow you",
          is_follow_notification: true,
          url: "",
        };

        const requestdata = {
          sender: user.user.user_id,
          recipient: authReso.data.Author.user_id,
          is_pending: true,
        };

        try {
          const res1 = await axios
            .post(notificationUrl, notifdata, config)
            .then((res1) => {
              console.log(res1.data);
            });

          const res2 = await axios
            .post(followrequestUrl, requestdata, config)
            .then((res2) => {
              console.log(res2.data);
              // set_is_pending(true); // Set is_pending to true since a follow request is pending
              // setAreFriends(false); // Set areFriends to false since a follow request is pending
            });
        } catch (err) {
          console.log(err);
          // set_is_pending(false); // If there's an error, set isPending back to false
        }
        window.location.reload(false);
      });
  };

  const handleUnfollow = async (event) => {
    event.preventDefault();
  
    let authorUrl = "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/" + author + "/username";
  
    const authReso = await axios
      .get(authorUrl, config)
      .then(async (authReso) => {

      let unfollowUrl = "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/" + authReso.data.Author.user_id + "/unfriend/" + user.user.user_id;

        try {
          const res = await axios.delete(unfollowUrl, config).then((res) => {
            console.log(res.data);
            setAreFriends(false);
          });
        } catch (err) {
          console.log(err);
        }
      });
  };

  return (
    <>
      <div className="flex justify-center items-center w-screen">
        <div className="main w-full max-w-[70rem] flex flex-col justify-center items-center m-7">
          {/* Spacer to push down content
          <div className="invisible h-16"></div> */}

          {/* Visible Box at the Top */}
          {/* {profileHeader} */}

          <div>
            {/* Profile Header Section */}
            {/* {profile && (
              <div className="profile-header mt-4 p-4 border border-gray-300 rounded-md text-center">
                <img
                  src={profile.profile_picture}
                  alt={`${profile.username}'s Profile`}
                  className="w-16 h-16 rounded-full object-cover mb-2"
                />
                <h2 className="text-xl font-semibold">{profile.username}</h2>
                {areFriends && !is_pending && (
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                    
                  >
                    Unfollow
                  </button>
                )}

                {!areFriends && !is_pending && (
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    
                  >
                    Follow
                  </button>
                )}

                {is_pending && !areFriends && (
                  <button className="bg-gray-500 text-white px-4 py-2 rounded-md" disabled>
                    Pending
                  </button>
                )}
              </div>
            )} */}
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
                  <ul>{posts}</ul>
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
