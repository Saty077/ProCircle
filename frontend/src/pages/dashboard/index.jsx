import { aboutUserData, getAllUsers } from "@/config/redux/action/authAction";
import {
  allPosts,
  createPost,
  deletePost,
} from "@/config/redux/action/postAction";
import DashboardLayout from "@/layout/dashboardLayout";
import UserLayout from "@/layout/userLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.css";
import { BASE_URL } from "@/config";

export default function Dashboard() {
  const dispatch = useDispatch();
  const router = useRouter();

  const authState = useSelector((state) => state.auth);
  const [postContent, setPostContent] = useState("");
  const [fileContent, setFileContent] = useState();

  const postState = useSelector((state) => state.postReducer);
  useEffect(() => {
    //
    if (authState.isTokenThere) {
      dispatch(allPosts()); //
      dispatch(aboutUserData({ token: localStorage.getItem("token") }));
    }

    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.isTokenThere]); //

  const handelPostUpload = async () => {
    await dispatch(createPost({ file: fileContent, body: postContent }));
    setPostContent(""), setFileContent(null);
    dispatch(allPosts());
  };

  if (authState.user) {
    return (
      <UserLayout>
        <DashboardLayout>
          <div className={styles.scrollComponent}>
            <div className={styles.wrapper}>
              <div className={styles.createPostContainer}>
                <img
                  className={styles.userProfile}
                  src={`${BASE_URL}/${authState.user.userId.profilePicture}`}
                />
                <textarea
                  onChange={(e) => setPostContent(e.target.value)}
                  value={postContent}
                  className={styles.textareaContent}
                  name=""
                  id=""
                ></textarea>
                <label htmlFor="fileUpload">
                  <div className={styles.fab}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                  </div>
                </label>
                <input
                  onChange={(e) => setFileContent(e.target.files[0])}
                  name="file"
                  type="file"
                  hidden
                  id="fileUpload"
                />
                {postContent.length > 0 && (
                  <div
                    onClick={handelPostUpload}
                    className={styles.buttonContent}
                  >
                    Upload Post
                  </div>
                )}
              </div>
              <div className={styles.postsContainer}>
                {postState.postFetched &&
                  postState.posts.map((post) => {
                    return (
                      <div className={styles.singleCard} key={post.id}>
                        <div className={styles.singleCard_profileContainer}>
                          <img
                            className={styles.userProfile}
                            src={`${BASE_URL}/${post.userId.profilePicture}`}
                            alt=""
                          />

                          <div>
                            <div
                              style={{
                                display: "flex",
                                marginRight: "21rem",
                                gap: "1.2rem",
                                width: "100%",
                                justifyContent: "space-between",
                              }}
                            >
                              <p style={{ fontWeight: "bold" }}>
                                {post.userId.name}
                              </p>
                              <div>
                                {post.userId._id ===
                                  authState.user.userId._id && (
                                  <svg
                                    onClick={async () => {
                                      dispatch(
                                        await dispatch(
                                          deletePost({ post_id: post._id })
                                        ),
                                        await dispatch(allPosts())
                                      );
                                    }}
                                    style={{
                                      height: "1.3rem",
                                      color: "red",
                                      cursor: "pointer",
                                    }}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    class="size-6"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                    />
                                  </svg>
                                )}
                              </div>
                            </div>

                            <p style={{ color: "grey" }}>
                              {post.userId.username}
                            </p>
                            <p style={{ marginTop: "1.3rem" }}>{post.body}</p>
                            <div className={styles.singleCard_image}>
                              <img src={`${BASE_URL}/${post.media}`} alt="" />
                            </div>
                          </div>

                          {/* <div
                            style={{
                              display: "flex",
                              gap: "1.3em",
                            }}
                          >
                            <div>
                              <p style={{ fontWeight: "bold" }}>
                                {post.userId.name}
                              </p>
                              
                            </div>
                            <p style={{ color: "grey" }}>
                              {post.userId.username}
                            </p>
                           
                          </div> */}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </DashboardLayout>
      </UserLayout>
    );
  } else {
    return (
      <UserLayout>
        <DashboardLayout>
          <div className={styles.scrollComponent}>
            <p>Loading...</p>
          </div>
        </DashboardLayout>
      </UserLayout>
    ); //
  }
}
