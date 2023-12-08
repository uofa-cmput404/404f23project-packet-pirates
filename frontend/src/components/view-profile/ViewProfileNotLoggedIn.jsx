import CreatePost from "../main-feed/CreatePost";
import Post from "../main-feed/Posts";
import Profile from "../main-feed/Profile";
import Notifications from "../main-feed/Notifications";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

// make use of this prob https://reactrouter.com/en/main/hooks/use-params
export default function ViewProfileNotLogged() {
  // check if author exists
  // if not, return 404
  // if yes, return profile
  const { author } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [postauthor, setPostauthor] = useState(null);

  const fake_user = {
    profile_picture: "https://i.imgur.com/7bIhcuD.png",
    username: "fake_user",
    user_id: "fake_id",
  };

  useEffect(() => {
    const getUrl = "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com";
    setIsLoading(true);

    const getProfile = async () => {
      try {
        const profileUrl = `${getUrl}/user/${author}`;
        const profileRes = await axios.get(profileUrl);
        setProfile(profileRes.data);
      } catch (error) {
        console.error("Error getting profile:", error);
      }
    };

    const fetchPosts = async () => {
      let postsUrl =
        "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/" +
        author +
        "/feedposts_byusername";

      const postsRes = await axios
        .get(postsUrl)
        .then((postsRes) => {
          //Result of post query
          setPosts(
            postsRes.data.Posts.filter(
              (post) => !post.unlisted && !post.is_private
            ).map((post, index) => {
              const image_conditions =
                post.image_url === "" && post.image_file != "";
              const image = image_conditions
                ? "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com" +
                  post.image_file
                : post.image_url;
              return (
                <Post
                  key={index}
                  user={fake_user}
                  post_author={post.author}
                  title={post.title}
                  description={post.content}
                  img={image}
                  img_url={post.image_url}
                  likes={post.likes_count}
                  id={post.post_id}
                />
              );
            })
          );
        })
        .catch((error) => {
          console.error("Error getting posts:", error);
          setPosts(
            <div className="flex justify-center items-center">
              This user does not exists, did you enter the correct username?
            </div>
          );
        });
    };

    fetchPosts(); // Call the fetchPosts function
  }, [author]);

  return (
    <>
      <div className="flex justify-center items-center w-screen">
        <div className="main w-full max-w-[70rem] flex flex-row justify-center m-7">
          <div className="feed flex flex-col ml-5 w-full mx-auto">
            <div className="feed_content mt-5">
              <ul>{posts}</ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
