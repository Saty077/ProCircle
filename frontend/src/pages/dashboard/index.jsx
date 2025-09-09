import { aboutUserData } from "@/config/redux/action/authAction";
import { allPosts } from "@/config/redux/action/postAction";
import DashboardLayout from "@/layout/dashboardLayout";
import UserLayout from "@/layout/userLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Dashboard() {
  const dispatch = useDispatch();
  const router = useRouter();

  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    //
    if (authState.isTokenThere) {
      dispatch(allPosts()); //
      dispatch(aboutUserData({ token: localStorage.getItem("token") }));
    }
  }, [authState.isTokenThere]); //

  return (
    <UserLayout>
      <DashboardLayout>
        <div>
          <h1>Dashboard</h1>
        </div>
      </DashboardLayout>
    </UserLayout>
  ); //
}
