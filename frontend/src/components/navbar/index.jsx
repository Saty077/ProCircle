import React from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

function NavBarComponent() {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <h2
          style={{ cursor: "pointer" }}
          onClick={() => {
            router.push("/");
          }}
        >
          Pro Hive
        </h2>
        <div className={styles.navbarOption}></div>
        {authState.profileFetched && (
          <div className={styles.dashboard_rightNav}>
            <p>{authState.user.userId.name}</p>
            <p style={{ fontWeight: "bold" }}>Profile</p>
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
      </nav>
    </div>
  );
}

export default NavBarComponent;
