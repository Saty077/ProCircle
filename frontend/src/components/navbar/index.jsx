import React from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";

function NavBarComponent() {
  const router = useRouter();

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
        <div
          onClick={() => {
            router.push("/login");
          }}
          className={styles.loginBtn}
        >
          Login
        </div>
      </nav>
    </div>
  );
}

export default NavBarComponent;
