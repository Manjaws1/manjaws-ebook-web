
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import EbookManagement from "@/components/admin/EbookManagement";

const AdminEbooks = () => {
  return (
    <AdminLayout>
      <div className="p-3 lg:p-4 xl:p-6">
        <EbookManagement />
      </div>
    </AdminLayout>
  );
};

export default AdminEbooks;
