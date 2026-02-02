
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DashboardLayout from '@/components/dashboards/DashboardLayout';
import SuperAdminDashboard from '@/pages/superadmin/SuperAdminDashboard';
import SuperAdminCalendar from '@/pages/superadmin/SuperAdminCalendar';
import CreateAdmins from '@/pages/superadmin/CreateAdmins';
import ManageUsers from '@/pages/superadmin/ManageUsers';
import PaymentPlans from '@/pages/superadmin/PaymentPlans';
import SuperAdminAnalytics from '@/pages/superadmin/SuperAdminAnalytics';
import ProtectedRoute from '@/components/ProtectedRoute';
import NotFound from '@/pages/NotFound';

const SuperAdminRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={['super-admin']} />}>
        <Route element={<DashboardLayout role="super-admin" basePath="/super-admin" />}>
          <Route path="/dashboard" element={<SuperAdminDashboard />} />
          <Route path="/calendar" element={<SuperAdminCalendar />} />
          <Route path="/create-admins" element={<CreateAdmins />} />
          <Route path="/manage-users" element={<ManageUsers />} />
          <Route path="/payment-plans" element={<PaymentPlans />} />
          <Route path="/analytics" element={<SuperAdminAnalytics />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default SuperAdminRoutes;
