import axios from "axios";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

export default function CreatePost({ user }) {
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [title, setTitle] = useState("");

  // Image variables
  const [imageFile, setImageFile] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [imageUID, setImageUID] = useState(null);

  const visibilityOptions = [
    { value: "Public", label: "Public" },
    { value: "Private", label: "Private" },
    { value: "Unlisted", label: "Unlisted" },
  ];
  const [visibility, setVisibility] = useState(visibilityOptions[0].value);

  const [isUnlisted, setIsUnlisted] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  const contentOptions = [
    { value: "text/plain", label: "Plaintext" },
    { value: "text/markdown", label: "Markdown" },
  ];
  const [contentType, setContentType] = useState(contentOptions[0].value);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
    console.log("Sent title is:", event.target.value);
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
    console.log("Sent text is:", event.target.value);
  };

  const [imageUrl, setImageUrl] = useState("");
  const handleImageUrlTextChange = (event) => {
    setImageUrl(event.target.value);
    console.log("Sent Image URL is:", event.target.value);
  };

  const handleImageUpload = (event) => {
    setImageFile(event.target.files[0]);

    const file = new FileReader();
    file.onloadend = () => {
      setImageBase64(file.result);
    };
    file.readAsDataURL(event.target.files[0]);
  };

  const handleContentTypeChange = (option) => {
    setContentType(option.value);
    console.log("Sent content type is:", option.value);
  };

  const handleVisibilityChange = (value) => {
    setVisibility(value);

    if (value["value"] === "Private") {
      setIsPrivate(true);
    } else if (value["value"] === "Unlisted") {
      setIsUnlisted(true);
    }

    console.log("Sent visibility is:", value);
  };

  const handlePosting = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("author", user.user.user_id);
    formData.append("title", title);
    formData.append("content_type", contentType);
    formData.append("content", text);
    formData.append("source", user.user.user_id);
    formData.append("origin", user.user.user_id);
    formData.append("unlisted", isUnlisted);
    formData.append("is_private", isPrivate);
    formData.append("image_file", imageFile);
    formData.append("image_url", imageUrl);
    formData.append("visibility", visibility);
    formData.append("url", "");

    console.log("Data", formData);

    axios
      .post("http://127.0.0.1:8000/postViews", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          //"Content-Type": "application/json",
          Authorization: "Token " + localStorage.getItem("access_token"),
        },
      })
      .then((response) => {
        console.log(response.data);
        window.location.reload(false);
      })
      .catch((error) => {
        console.log("Error Response: ", error.response);
        console.log("Error Data: ", error.response.data);
      });
  };

  return (
    <div>
      <div
        className="create-post flex flex-col bg-white border border-gray-300 p-4 w-full rounded-lg"
        style={{ boxShadow: "8px 8px 0px 0px rgba(0, 0, 0, 0.2)" }}
      >
        <div className="post-content flex flex-row">
          <div className="image-container w-12 h-12 rounded-full overflow-hidden bg-black">
            <img
              src={"http://127.0.0.1:8000" + user.user.profile_picture}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
          <form
            className="stuff-to-post flex flex-col w-[80%] ml-5 "
            action="#"
          >
            {/* Title Input */}
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Add a title..."
              className="border border-black rounded-lg p-2 mb-4"
              onChange={handleTitleChange}
            />

            {/* Post Body Input */}
            <textarea
              id="content"
              name="content"
              type="text"
              placeholder="Anything you want to discuss?"
              className="border border-black rounded-lg p-2 h- mb-4 overflow-hidden"
              onChange={handleTextChange}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
            ></textarea>

            {/* Post Body Input */}
            <input
              id="content"
              name="content"
              type="text"
              placeholder="Place an image URL in such as https://picsum.photos/200"
              className="border border-black rounded-lg p-2 h- mb-4"
              onChange={handleImageUrlTextChange}
            ></input>
          </form>
        </div>
        <div className="imgPreviewBox">
          {/* show the image in a preview box */}
          <div className="imgPreview">
            {imageBase64 && (
              <div className="imgContainer">
                <img src={imageBase64} alt="Image Preview" />
              </div>
            )}
          </div>
        </div>
        <div className="menu">
          {/* upload photo, public, plaintext, post */}
          <ul className="flex flex-row gap-2 justify-between items-center">
            <li>
              <label htmlFor="select-image">
                <div className="rounded-lg text-white bg-primary-dark w-full my-4 p-2 shadow-md hover:bg-primary-color transition duration-200 ease-in">
                  Upload Image
                </div>
              </label>
              <input
                type="file"
                accept="image/*"
                id="select-image"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
            </li>
            <li>
              <div className="chooseVisibility">
                <Dropdown
                  options={visibilityOptions}
                  value={visibility}
                  onChange={handleVisibilityChange}
                />
              </div>
            </li>
            <li>
              <div className="chooseContentType">
                <Dropdown
                  options={contentOptions}
                  value={contentType}
                  onChange={handleContentTypeChange}
                />
              </div>
            </li>
            <li>
              <button
                className="rounded-lg text-white bg-primary-dark w-full my-4 p-2 shadow-md hover:bg-primary-color transition duration-200 ease-in"
                onClick={handlePosting}
              >
                Post
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
