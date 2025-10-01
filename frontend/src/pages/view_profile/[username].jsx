import { createServer } from "@/config";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

export default function ViewProfilePage({ targetUser }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    console.log("view test client : on dev console");
  });
  return (
    <div>
      <h1>{targetUser.userId.name}</h1>
    </div>
  );
}

export async function getServerSideProps(context) {
  console.log("view server: on terminal");
  const request = await createServer.get("/user/view_profile", {
    params: {
      username: context.query.username,
    },
  });
  const data = await request.data;
  console.log(data);
  return {
    props: { targetUser: data.targetProfile },
  };
}

// export async function getServerSideProps(context) {
//   console.log("view server");
//   console.log(context.query.username);
//   const response = await fetch("/user/view_profile", {
//     param: {
//       username: context.query.username,
//     },
//   });
//   const data = await response.json();
//   return {
//     props: { data },
//   };
// }
// two problems here:
//1. fech can't use req.params.
//2. in fetch absolute url should be provided as it is running on server.
//Note: .json() can only be used with fetch not createServer(which i build using axios) because axios returns
// axios returns parsed JSON. no need to parse it further
