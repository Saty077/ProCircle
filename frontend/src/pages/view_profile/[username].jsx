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
      return setIsCurrentUserInConnection(true);
    }
  }, [authState.connections]);

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
