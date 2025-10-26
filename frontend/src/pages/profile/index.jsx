import React, { useEffect, useState } from "react";
import Styles from "./index.module.css";
import UserLayout from "@/layout/userLayout";
import DashboardLayout from "@/layout/dashboardLayout";
import { BASE_URL, createServer } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import { aboutUserData } from "@/config/redux/action/authAction";
import { allPosts } from "@/config/redux/action/postAction";
import { useRouter } from "next/router";

export default function ProfilePage() {
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.postReducer);
  const [userPost, setUserPost] = useState([]);
  const [userProfile, setUserProfile] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState({
    company: "",
    position: "",
    years: "",
  });
  const router = useRouter();

  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  useEffect(() => {
    dispatch(aboutUserData({ token: localStorage.getItem("token") }));
    dispatch(allPosts());
  }, []);

  useEffect(() => {
    if (authState.user) {
      setUserProfile(authState.user);
      console.log("hello user");
      let post = postState.posts.filter((post) => {
        return post.userId.username === authState.user.userId.username;
      });
      setUserPost(post);
    }
  }, [authState.user, postState.posts]);

  const uploadPrfofilePicture = async (file) => {
    const formData = new FormData();
    formData.append("profile_picture", file);
    formData.append("token", localStorage.getItem("token"));
    const response = await createServer.post(
      "/update_profile_picture",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    dispatch(aboutUserData({ token: localStorage.getItem("token") }));
  };

  const updateProfileData = async () => {
    const response = await createServer.post("/user_update", {
      token: localStorage.getItem("token"),
      name: userProfile.userId.name,
    });

    const request = await createServer.post("/update_profile_data", {
      token: localStorage.getItem("token"),
      username: userProfile.username,
      bio: userProfile.bio,
      currentPost: userProfile.currentPost,
      pastWork: userProfile.pastWork,
      education: userProfile.education,
    });

    dispatch(aboutUserData({ token: localStorage.getItem("token") }));
  };

  return (
    <UserLayout>
      <DashboardLayout>
        {userProfile != undefined && userProfile.userId && (
          <div className={Styles.container}>
            <div className={Styles.backdropContainer}>
              <label
                htmlFor="profilePictureUpload"
                className={Styles.backdrop__overlay}
              >
                <p>Edit</p>
              </label>
              <input
                on
                onChange={(e) => {
                  uploadPrfofilePicture(e.target.files[0]);
                }}
                hidden
                type="file"
                id="profilePictureUpload"
              />

              <img
                src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
                alt=""
              />
            </div>
            <div className={Styles.profileContainer_details}>
              <div className={Styles.profileContainer_details_second}>
                <div className={Styles.details_left}>
                  <div className={Styles.childOfDetails_left}>
                    <input
                      className={Styles.nameEdit}
                      type="text"
                      value={userProfile.userId.name}
                      onChange={(e) => {
                        setUserProfile({
                          ...userProfile,
                          userId: {
                            ...userProfile.userId,
                            name: e.target.value,
                          },
                        });
                      }}
                    />
                    <p contentEditable style={{ color: "gray" }}>
                      @{userProfile.userId.username}
                    </p>
                  </div>
                  <div>
                    <textarea
                      value={userProfile.bio}
                      onChange={(e) => {
                        setUserProfile({ ...userProfile, bio: e.target.value });
                      }}
                      rows={Math.max(3, Math.ceil(userProfile.bio.length / 80))}
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
                <div className={Styles.details_right}>
                  <h2>Recent Activity</h2>
                  {userPost.map((post) => {
                    return (
                      <div className={Styles.postCard}>
                        <div className={Styles.card}>
                          <div className={Styles.card_postContainer}>
                            {post.media !== "" ? (
                              <img src={`${BASE_URL}/${post.media}`} alt="" />
                            ) : (
                              <div
                                style={{ width: "3.5rem", height: "auto" }}
                              ></div>
                            )}
                          </div>
                          <p>{post.body}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className={Styles.workHistory}>
              <h4>Work History</h4>
              <div className={Styles.workHistory_container}>
                {userProfile.pastWork.map((work) => {
                  return (
                    <div className={Styles.workHistory_card}>
                      <p
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.8rem",
                        }}
                      >
                        <span style={{ fontWeight: "bold" }}>Company:</span>{" "}
                        <span>{work.company}</span>
                      </p>
                      <p
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.8rem",
                        }}
                      >
                        <span
                          style={{ fontWeight: "bold", marginRight: "10px" }}
                        >
                          Position:{" "}
                        </span>{" "}
                        <span>{work.position}</span>
                      </p>
                      <p
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.8rem",
                        }}
                      >
                        <span
                          style={{ fontWeight: "bold", marginRight: "30px" }}
                        >
                          Years:{" "}
                        </span>{" "}
                        <span>{work.years}</span>
                      </p>
                    </div>
                  );
                })}

                <button
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                  className={Styles.addWorkBtn}
                >
                  Add Work
                </button>
              </div>
            </div>

            {authState.user != userProfile && (
              <div
                className={Styles.updateProfileBtn}
                onClick={() => {
                  updateProfileData();
                }}
              >
                Update Profile
              </div>
            )}
          </div>
        )}

        {isModalOpen && (
          <div
            onClick={() => {
              setIsModalOpen(false);
            }}
            className={Styles.commentContainer}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={Styles.allCommentsContainer}
            >
              <input
                className={Styles.inputFields}
                name="company"
                onChange={handleInputChange}
                type="text"
                placeholder="Enter your Company Name"
              />
              <input
                className={Styles.inputFields}
                onChange={handleInputChange}
                name="position"
                type="text"
                placeholder="Enter your Position"
              />
              <input
                className={Styles.inputFields}
                onChange={handleInputChange}
                name="years"
                type="number"
                placeholder="Enter how many years"
              />

              <button
                onClick={() => {
                  setUserProfile({
                    ...userProfile,
                    pastWork: [...userProfile.pastWork, inputValue],
                  });
                  setIsModalOpen(false);
                }}
                className={Styles.updateProfileBtn}
              >
                Add Work
              </button>
            </div>
          </div>
        )}
      </DashboardLayout>
    </UserLayout>
  );
}
