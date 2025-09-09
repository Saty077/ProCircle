import DashboardLayout from "@/layout/dashboardLayout";
import UserLayout from "@/layout/userLayout";
import React from "react";

export default function Discover() {
  return (
    <UserLayout>
      <DashboardLayout>
        <div>
          <h1>Discover</h1>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
