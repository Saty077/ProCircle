import { BASE_URL } from "@/config";
import { getAllUsers } from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/dashboardLayout";
import UserLayout from "@/layout/userLayout";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Styles from "./index.module.css";
import { useRouter } from "next/router";

export default function Discover() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, []);

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={Styles.mainContainer}>
          <h1>Discover</h1>
          <div className={Styles.allUserProfile}>
            {authState.all_profiles_fetched &&
              authState.all_users.map((user) => {
                return (
                  <div
                    onClick={() => {
                      router.push(`/view_profile/${[user.userId.username]}`);
                    }}
                    key={user._id}
                    className={Styles.userCard}
                  >
                    <img
                      src={`${BASE_URL}/${user.userId.profilePicture}`}
                      alt=""
                    />
                    <div>
                      <h1>{user.userId.name}</h1>
                      <p>@{user.userId.username}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
