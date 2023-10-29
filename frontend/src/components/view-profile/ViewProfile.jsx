import CreatePost from "../main-feed/CreatePost";
import Post from "../main-feed/Posts";
import Profile from "../main-feed/Profile";
import Notifications from "../main-feed/Notifications";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

// make use of this prob https://reactrouter.com/en/main/hooks/use-params
export default function ViewProfile({ user }) {
  useEffect(() => {
    console.log("user", user);
  }, []);
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
  };

  useEffect(() => {
    const getUrl = "http://127.0.0.1:8000";
    setIsLoading(true);
    console.log("author", author);

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
        "http://127.0.0.1:8000/api/author/" + author + "/feedposts_byusername";

      const postsRes = await axios.get(postsUrl).then((postsRes) => {
        //Result of post query
        console.log("POSTSRES", postsRes.data.Posts[0]);
        console.log("POSTSRES_FULL", postsRes.data.Posts);

        // for (let i = 0; i < postsRes.data.Posts.length; i++) {
        //   let postauthorUrl =
        //     "http://127.0.0.1:8000/api/author/" + postsRes.data.Posts[i].author + "/feedposts_byusername";
        //   axios.get(postauthorUrl).then((postauthorRes) => {
        //     console.log("POSTAUTHORRES", postauthorRes.data.Posts[0]);
        //     setPostauthor(postauthorRes.data.Posts[0]);
        //   });
        // }

        setPosts(
          postsRes.data.Posts.map((post, index) => (
            <Post
              key={index}
              user={fake_user}
              title={post.title}
              description={post.content}
              img={post.image_url}
              likes={post.likes_count}
              id={post.post_id}
            />
          ))
        );
      });
    };

    // getProfile(); // Call the getProfile function
    fetchPosts(); // Call the fetchPosts function
    console.log("posts", posts);
  }, [author]);

  return (
    <>
      <div className="feed_content mt-5">
        <ul>{posts}</ul>
      </div>
    </>
  );
}
