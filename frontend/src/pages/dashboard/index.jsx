import { aboutUserData, allPosts } from "@/config/redux/action/postAction";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function Dashboard() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isTokenThere, setIsTokenThere] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      router.push("/login");
    }
    setIsTokenThere(true);
  });

  useEffect(() => {
    //
    if (isTokenThere) {
      dispatch(allPosts()); //
      dispatch(aboutUserData({ token: localStorage.getItem("token") }));
    }
  }, [isTokenThere]); //

  return <div>Dashboard</div>; //
}
