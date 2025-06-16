
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import CategoryManagement from "@/components/admin/CategoryManagement";

const AdminCategories = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <CategoryManagement />
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;
