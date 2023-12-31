import axios from "axios";
import { useState } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

export default function EditPost({
  user,
  titl,
  description,
  img,
  img_url,
  id,
  visibility,
  unlisted,
}) {
  const [text, setText] = useState(description);
  const [title, setTitle] = useState(titl);

  // Image variables
  const [imageFile, setImageFile] = useState("");
  const [imageBase64, setImageBase64] = useState(null);
  const [imageUID, setImageUID] = useState(null);

  const visibilityOptions = [
    { value: "Public", label: "Public" },
    { value: "Friends", label: "Friends" },
    { value: "Private", label: "Private" },
    { value: "Unlisted", label: "Unlisted" },
  ];
  const [postVisibility, setPostVisibility] = useState(
    visibilityOptions[0].value
  );

  const [isUnlisted, setIsUnlisted] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isFriends, setIsFriends] = useState(false);

  const contentOptions = [
    { value: "text/plain", label: "Plaintext" },
    { value: "text/markdown", label: "Markdown" },
  ];
  const [contentType, setContentType] = useState(contentOptions[0].value);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const [imageUrl, setImageUrl] = useState(img || img_url || "");
  const handleImageUrlTextChange = (event) => {
    setImageUrl(event.target.value);
  };

  const handleImageUploadEdit = (event) => {
    setImageFile(event.target.files[0]);

    const file = new FileReader();
    file.onloadend = () => {
      setImageBase64(file.result);
    };
    file.readAsDataURL(event.target.files[0]);
  };

  const handleContentTypeChange = (option) => {
    setContentType(option.value);
  };

  const handleVisibilityChange = (value) => {
    setPostVisibility(value);

    if (value["value"] === "Private") {
      setIsPrivate(true);
      setIsFriends(false);
      setIsUnlisted(false);
    } else if (value["value"] === "Unlisted") {
      setIsUnlisted(true);
      setIsPrivate(false);
      setIsFriends(false);
    } else if (value["value"] === "Friends") {
      setIsFriends(true);
      setIsPrivate(false);
      setIsUnlisted(false);
    } else if (value["value"] === "Public") {
      setIsFriends(false);
      setIsPrivate(false);
      setIsUnlisted(false);
    }
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + localStorage.getItem("access_token"),
    },
  };

  const handlePostDelete = (event) => {
    event.preventDefault();

    axios
      .delete(
        "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/" +
          id +
          "/postViews",
        config
      )
      .then((response) => {
        window.location.reload(false);
      })
      .catch((error) => {
        console.log("Error Response: ", error.response);
        console.log("Error Data: ", error.response.data);
      });
  };

  const handleEditing = (e) => {
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

    axios
      .post(
        "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/" +
          id +
          "/editpost",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Token " + localStorage.getItem("access_token"),
          },
        }
      )
      .then((response) => {
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
        className="edit-post flex flex-col bg-white border border-gray-300 p-4 w-full rounded-lg"
        style={{ boxShadow: "8px 8px 0px 0px rgba(0, 0, 0, 0.2)" }}
      >
        <div className="edit-post-content flex flex-row">
          <form
            className="edit-stuff-to-post flex flex-col w-[80%] ml-5 "
            action="#"
          >
            {/* Title Input */}
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Edit title..."
              className="border border-black rounded-lg p-2 mb-4"
              onChange={handleTitleChange}
            />

            {/* Post Body Input */}
            <textarea
              id="content"
              name="content"
              type="text"
              placeholder="Edit description..."
              className="border border-black rounded-lg p-2 h- mb-4"
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
              placeholder="Edit image URL"
              className="border border-black rounded-lg p-2 h- mb-4"
              onChange={handleImageUrlTextChange}
            ></input>
          </form>
        </div>
        <div className="edit-imgPreviewBox flex flex-row justify-between items-center max-w-[300px]">
          {/* show the image in a preview box */}
          <div className="edit-imgPreview">
            {imageBase64 && (
              <div className="edit-imgContainer">
                <img src={imageBase64} alt="Image Preview" />
              </div>
            )}
          </div>
        </div>
        <div className="edit-menu">
          {/* upload photo, public, plaintext, post */}
          <ul className="flex flex-row justify-between items-center">
            <li>
              <label htmlFor="select-image-edit">
                <div className="rounded-lg text-white bg-primary-dark w-full mx-0 my-4 py-2 shadow-md hover:bg-primary-color transition duration-200 ease-in">
                  Upload Image
                </div>
              </label>
              <input
                type="file"
                accept="image/*"
                id="select-image-edit"
                style={{ display: "none" }}
                onChange={handleImageUploadEdit}
              />
            </li>
            <li>
              <div className="chooseVisibility">
                <Dropdown
                  options={visibilityOptions}
                  value={postVisibility}
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
                onClick={handleEditing}
              >
                Update
              </button>
            </li>
          </ul>
          <button
            className="mr-4 border-gray-700 border rounded-full p-2 text-white bg-red-700"
            onClick={handlePostDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
