import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const router = useRouter();

  return (
    <>
      <div className={styles.container}>
        <div className="mainContainer">
          <div className="mainContainer_left">
            <p>connect without any exaggeration</p>
            <p>connect without any exaggeration</p>
            <div
              onClick={() => {
                router.push("/login");
              }}
              className="buttonJoin"
            >
              <p>Join Now</p>
            </div>
          </div>
          <div className="mainContainer_right">
            <img src="/images/community.png" alt=""></img>
          </div>
        </div>
      </div>
    </>
  );
}
