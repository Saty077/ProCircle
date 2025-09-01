import UserLayout from "@/layout/userLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.css";

import { loginUser, registerUser } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";

function LoginComponent() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  const [loginMethod, setLoginMethod] = useState(false);

  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [name, setName] = useState();
  const [password, setPassword] = useState();

  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/dashboard");
    }
  }, []);

  useEffect(() => {
    dispatch(emptyMessage());
  }, [loginMethod]);

  const handleRegister = () => {
    dispatch(registerUser({ name, username, email, password }));
  };

  const handleLogin = () => {
    dispatch(loginUser({ email, password }));
  };

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer_left}>
            <div className={styles.cardLeft_heading}>
              <p>{loginMethod ? "Sign In" : "Sign Up"}</p>
              <p style={{ color: authState.isError ? "red" : "green" }}>
                {" "}
                {authState.message}{" "}
              </p>
            </div>

            <div className={styles.cardInputs}>
              {loginMethod ? (
                <></>
              ) : (
                <>
                  <div className={styles.inputRows}>
                    <input
                      className={styles.inputFields}
                      onChange={(e) => setUsername(e.target.value)}
                      type="text"
                      placeholder="Username"
                    />
                    <input
                      className={styles.inputFields}
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      placeholder="Name"
                    />
                  </div>
                </>
              )}

              <input
                className={styles.inputFields}
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                placeholder="email"
              />
              <input
                className={styles.inputFields}
                onChange={(e) => setPassword(e.target.value)}
                type="text"
                placeholder="password"
              />
              <div
                onClick={() => {
                  if (loginMethod) {
                    handleLogin();
                  } else {
                    handleRegister();
                  }
                }}
                className={styles.submitBtn}
              >
                Sign Up
              </div>
            </div>
          </div>
          <div className={styles.cardContainer_right}>
            {loginMethod ? (
              <p>Don't have an Account?</p>
            ) : (
              <p>Already have an Account?</p>
            )}
            <button
              onClick={() => {
                setLoginMethod(!loginMethod);
              }}
              className={styles.rightButton}
            >
              {loginMethod ? "Register" : "Login"}
            </button>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default LoginComponent;
