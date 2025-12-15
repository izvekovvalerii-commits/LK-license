import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import TaskList from './pages/TaskList';
import AlcoholLicenses from './pages/AlcoholLicenses';
import TobaccoLicenses from './pages/TobaccoLicenses';
import Stores from './pages/Stores';
import Documents from './pages/Documents';
import Payments from './pages/Payments';
import CreatePaymentTask from './pages/CreatePaymentTask';
import CreateMassPaymentTask from './pages/CreateMassPaymentTask';
import CreateAlcoholLicenseTask from './pages/CreateAlcoholLicenseTask';
import CreateTobaccoLicenseTask from './pages/CreateTobaccoLicenseTask';
import SendLicenseEmail from './pages/SendLicenseEmail';
import TaskWorkflow from './pages/TaskWorkflow';
import CreateProcessTask from './pages/CreateProcessTask';
import EditProcessTask from './pages/EditProcessTask';
import MainLayout from './components/Layout';
import { authService } from './services/authService';
import './App.css';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <ConfigProvider locale={ruRU}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Tasks />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks/list"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <TaskList />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks/:id"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <EditProcessTask />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks/create-alcohol"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <CreateAlcoholLicenseTask />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks/create-tobacco"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <CreateTobaccoLicenseTask />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks/create-process"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <CreateProcessTask />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks/send-email"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <SendLicenseEmail />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/documents"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Documents />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Payments />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments/create"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <CreatePaymentTask />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments/create-mass"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <CreateMassPaymentTask />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/stores"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Stores />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/references/alcohol"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <AlcoholLicenses />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/references/tobacco"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <TobaccoLicenses />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
