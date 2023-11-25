import axios from "axios";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

export default function CreatePost({ user }) {
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
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

  const handleContentTypeChange = (value) => {
    setContentType(value['value']);
    console.log("Sent content type is:", value['value']);
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

  const handleTextPosting = (e) => {
    e.preventDefault();
    const data = {
      "title": title,
      "content_type": contentType,
      "url": '',
      "content": text,
      "author": user.user.user_id,
      "source": user.user.user_id,
      "origin": user.user.user_id,
      "unlisted": isUnlisted,
      "is_private" : isPrivate,
      'image_url': "",
      //"visibility": visibility
    }

    console.log("Data", data);

    axios
    .post(
      'https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/api/postViews', 
      data, 
      {
        headers: {
          // "Content-Type": "multipart/form-data",
          "Content-Type": "application/json",
          'Authorization': 'Token ' + localStorage.getItem('access_token'),
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
              src={"https://packet-pirates-backend-d3f5451fdee4.herokuapp.com" + user.user.profile_picture}
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
            <input
              id="content"
              name="content"
              type="text"
              placeholder="Anything you want to discuss?"
              className="border border-black rounded-lg p-2 h- mb-4"
              onChange={handleTextChange}
            ></input>
          </form>
        </div>
        <div className="menu">
          {/* upload photo, public, plaintext, post */}
          <ul className="flex flex-row justify-between">
            <li>
              <button className="mr-4 border-gray-700 border rounded-full p-2 text-white bg-gray-700">
                Upload Photo
              </button>
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
                className="mr-4 border-gray-700 border rounded-full p-2 text-white bg-gray-700"
                onClick={handleTextPosting}
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
