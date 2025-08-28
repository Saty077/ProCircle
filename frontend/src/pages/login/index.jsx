import UserLayout from "@/layout/userLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./style.module.css";

function LoginComponent() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState(false);
  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn, router]);

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer_left}>
            <p className={styles.cardLeft_heading}>
              {loginMethod ? "Sign In" : "Sign Up"}
            </p>

            <div className={styles.cardInputs}>
              <div className={styles.inputRows}>
                <input
                  className={styles.inputFields}
                  type="text"
                  placeholder="Username"
                />
                <input
                  className={styles.inputFields}
                  type="text"
                  placeholder="Name"
                />
              </div>
              <input
                className={styles.inputFields}
                type="text"
                placeholder="email"
              />
              <input
                className={styles.inputFields}
                type="text"
                placeholder="password"
              />
              <div
                onClick={() => {
                  console.log("Registered!!!!!!!!!!!!");
                }}
                className={styles.submitBtn}
              >
                Sign Up
              </div>
            </div>
          </div>
          <div className={styles.cardContainer_right}></div>
        </div>
      </div>
    </UserLayout>
  );
}

export default LoginComponent;
