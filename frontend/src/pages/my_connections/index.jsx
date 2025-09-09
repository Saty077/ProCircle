import DashboardLayout from "@/layout/dashboardLayout";
import UserLayout from "@/layout/userLayout";
import React from "react";

export default function MyConnections() {
  return (
    <UserLayout>
      <DashboardLayout>
        <div>
          <h1>My Connections</h1>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
