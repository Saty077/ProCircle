import NavBarComponent from "@/components/navbar";
import React from "react";

function UserLayout({ children }) {
  return (
    <div>
      <NavBarComponent />
      {children}
    </div>
  );
}

export default UserLayout;
