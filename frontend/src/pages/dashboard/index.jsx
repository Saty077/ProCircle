import { aboutUserData, getAllUsers } from "@/config/redux/action/authAction";
import { allPosts } from "@/config/redux/action/postAction";
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

  if (authState.user) {
    return (
      <UserLayout>
        <DashboardLayout>
          <div className={styles.scrollComponent}>
            <div className={styles.postContainer}>
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
                type="file"
                hidden
                id="fileUpload"
              />
              {postContent.length > 0 && (
                <div className={styles.buttonContent}>Upload Post</div>
              )}
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
