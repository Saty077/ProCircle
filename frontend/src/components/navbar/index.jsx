import React from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "@/config/redux/reducer/authReducer";

function NavBarComponent() {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div>
          <h2
            style={{ cursor: "pointer" }}
            onClick={() => {
              router.push("/");
            }}
          >
            ProCircle
          </h2>
        </div>
        <div className={styles.navbarOption}>
          {authState.profileFetched && (
            <div className={styles.dashboard_rightNav}>
              <p
                onClick={() => {
                  router.push("/profile");
                }}
                className={styles.usernameNav}
              >
                {authState.user.userId.name}
              </p>
              <p
                onClick={() => {
                  router.push("/profile");
                }}
                style={{ fontWeight: "bold", cursor: "pointer" }}
              >
                Profile
              </p>
              <p
                onClick={() => {
                  localStorage.removeItem("token");
                  router.push("/login");
                  dispatch(reset());
                }}
                style={{ fontWeight: "bold", cursor: "pointer" }}
              >
                Logout
              </p>
            </div>
          )}
          {!authState.profileFetched ? (
            <div
              onClick={() => {
                router.push("/login");
              }}
              className={styles.loginBtn}
            >
              Login
            </div>
          ) : (
            <></>
          )}
        </div>
      </nav>
    </div>
  );
}

export default NavBarComponent;
