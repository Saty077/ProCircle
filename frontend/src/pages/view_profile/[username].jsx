import { BASE_URL, createServer } from "@/config";
import DashboardLayout from "@/layout/dashboardLayout";
import UserLayout from "@/layout/userLayout";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Styles from "./index.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { allPosts } from "@/config/redux/action/postAction";
import {
  getConnectionRequest,
  getMyConnections,
  sendConnectionRequest,
} from "@/config/redux/action/authAction";

export default function ViewProfilePage({ targetUser }) {
  const searchParams = useSearchParams();

  const router = useRouter();
  const dispatch = useDispatch();
  const postState = useSelector((state) => state.postReducer);
  const authState = useSelector((state) => state.auth);
  const [userPost, setUserPost] = useState([]);
  const [isCurrentUserInConnection, setIsCurrentUserInConnection] =
    useState(false);
  const [isConnectionNull, setIsConnectionNull] = useState(true);

  const getUserPost = async () => {
    await dispatch(allPosts());
    await dispatch(
      getConnectionRequest({ token: localStorage.getItem("token") })
    ); //todo
    await dispatch(getMyConnections({ token: localStorage.getItem("token") }));
  };

  useEffect(() => {
    let post = postState.posts.filter((post) => {
      return post.userId.username === router.query.username;
    });
    setUserPost(post);
  }, [postState.posts]);

  useEffect(() => {
    console.log("test1", authState.connections, targetUser.userId._id);
    if (
      authState.connections.some(
        (user) => user.connectionId._id === targetUser.userId._id
      )
    ) {
      setIsCurrentUserInConnection(true);
      if (
        authState.connections.find(
          (user) => user.connectionId._id === targetUser.userId._id
        ).status_accepted === true
      ) {
        setIsConnectionNull(false);
      }
    }
    if (
      authState.connectionRequest.some(
        (user) => user.userId._id === targetUser.userId._id
      )
    ) {
      setIsCurrentUserInConnection(true);
      if (
        authState.connectionRequest.find(
          (user) => user.userId._id === targetUser.userId._id
        ).status_accepted === true
      ) {
        setIsConnectionNull(false);
      }
    }
  }, [authState.connections, authState.connectionRequest]);

  useEffect(() => {
    getUserPost();
  }, []);
  return (
    <UserLayout>
      <DashboardLayout>
        <div className={Styles.container}>
          <div className={Styles.backdropContainer}>
            <img
              className={Styles.backdrop}
              src={`${BASE_URL}/${targetUser.userId.profilePicture}`}
              alt=""
            />
          </div>
          <div className={Styles.profileContainer_details}>
            <div className={Styles.profileContainer_details_second}>
              <div className={Styles.details_left}>
                <div className={Styles.childOfDetails_left}>
                  <h2 style={{ fontWeight: "bold" }}>
                    {targetUser.userId.name}
                  </h2>
                  <p style={{ color: "gray" }}>@{targetUser.userId.username}</p>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "1.2rem",
                    alignItems: "center",
                  }}
                >
                  {isCurrentUserInConnection ? (
                    <button className={Styles.connectedBtn}>
                      {isConnectionNull ? <p>Pending</p> : <p>Connected</p>}
                    </button>
                  ) : (
                    <button
                      onClick={async () => {
                        dispatch(
                          sendConnectionRequest({
                            token: localStorage.getItem("token"),
                            username: targetUser.userId.username,
                          })
                        ); //todo
                      }}
                      className={Styles.connectBtn}
                    >
                      Connect
                    </button>
                  )}
                  <div
                    onClick={async () => {
                      const response = await createServer.get(
                        `/user/download_resume?id=${targetUser.userId._id}`
                      );
                      window.open(
                        `${BASE_URL}/${response.data.message}`,
                        "_blank"
                      );
                    }}
                    className={Styles.downloadProfile}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                  </div>
                </div>

                <div className={Styles.profileBio}>{targetUser.bio}</div>
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
              {targetUser.pastWork.map((work) => {
                return (
                  <div className={Styles.workHistory_card}>
                    <p
                      style={{
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.8rem",
                      }}
                    >
                      {work.company} - {work.position}
                    </p>
                    <p>{work.years}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export async function getServerSideProps(context) {
  console.log("view server: on terminal");
  const request = await createServer.get("/user/view_profile", {
    params: {
      username: context.query.username,
    },
  });
  const data = await request.data;
  console.log(data);
  return {
    props: { targetUser: data.targetProfile },
  };
}

// export async function getServerSideProps(context) {
//   console.log("view server");
//   console.log(context.query.username);
//   const response = await fetch("/user/view_profile", {
//     param: {
//       username: context.query.username,
//     },
//   });
//   const data = await response.json();
//   return {
//     props: { data },
//   };
// }
// Two problems here:
//1. fech can't use req.params.
//2. in fetch absolute url should be provided as it is running on server.
//Note: .json() can only be used with fetch not createServer(which i build using axios) because axios returns
// axios returns parsed JSON. no need to parse it further
