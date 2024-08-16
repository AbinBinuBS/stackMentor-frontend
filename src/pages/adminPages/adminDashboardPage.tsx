import React from 'react';
import AdminHeader from "../../components/commonComponents/adminHeader";
import AdminDashboardSidebar from "../../components/adminComponents/Dashboard/adminDashboardSidebar";
import AdminHeaderSideHeader from "../../components/adminComponents/Dashboard/adminDashboardSideHeader";
import AdminDashboardMiddileComp from "../../components/adminComponents/Dashboard/adminDashboardMiddilecomp";

const AdminDashboardPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminDashboardSidebar />
        <main className="flex-1 ml-64 mt-16 overflow-y-auto"> 
          <AdminHeaderSideHeader />
          <AdminDashboardMiddileComp />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
