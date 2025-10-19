import { BASE_URL } from "@/config";
import {
  acceptConnectionRequest,
  getMyConnections,
} from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/dashboardLayout";
import UserLayout from "@/layout/userLayout";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Style from "./index.module.css";
import { useRouter } from "next/router";

export default function MyConnections() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    dispatch(getMyConnections({ token: localStorage.getItem("token") }));
  }, []);

  useEffect(() => {
    if (authState.connectionRequest != 0) {
      console.log(authState.connectionRequest);
    }
  }, [authState.connectionRequest]);

  return (
    <UserLayout>
      <DashboardLayout>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.7rem" }}
        >
          <h4>My Connections</h4>
          {authState.connectionRequest.length === 0 && (
            <h2>No Connection Request Pending</h2>
          )}
          {authState.connectionRequest.length != 0 &&
            authState.connectionRequest
              .filter((connection) => connection.status_accepted === null)
              .map((user, index) => {
                return (
                  <div
                    onClick={() => {
                      router.push(`/view_profile/${user.userId.username}`);
                    }}
                    key={index}
                    className={Style.userCard}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1.2rem",
                        justifyContent: "space-between",
                      }}
                    >
                      <div className={Style.profilePicture}>
                        <img
                          src={`${BASE_URL}/${user.userId.profilePicture}`}
                          alt=""
                        />
                      </div>
                      <div className="userDetails">
                        <h2>{user.userId.name}</h2>
                        <p>{user.userId.username}</p>
                      </div>
                      <div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(
                              acceptConnectionRequest({
                                token: localStorage.getItem("token"),
                                connectionId: user._id,
                                action_type: "accept",
                              })
                            );
                          }}
                          className={Style.acceptBtn}
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

          <h4>My Network</h4>
          {authState.connectionRequest.length != 0 &&
            authState.connectionRequest
              .filter((connection) => connection.status_accepted !== null)
              .map((user, index) => {
                return (
                  <div
                    onClick={() => {
                      router.push(`/view_profile/${user.userId.username}`);
                    }}
                    key={index}
                    className={Style.userCard}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1.2rem",
                        justifyContent: "space-between",
                      }}
                    >
                      <div className={Style.profilePicture}>
                        <img
                          src={`${BASE_URL}/${user.userId.profilePicture}`}
                          alt=""
                        />
                      </div>
                      <div className="userDetails">
                        <h2>{user.userId.name}</h2>
                        <p>{user.userId.username}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
