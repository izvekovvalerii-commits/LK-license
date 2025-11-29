import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import AlcoholLicenses from './pages/AlcoholLicenses';
import TobaccoLicenses from './pages/TobaccoLicenses';
import Stores from './pages/Stores';
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
            path="/documents"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <div>
                    <h1>Документы</h1>
                    <p>Модуль в разработке</p>
                  </div>
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <div>
                    <h1>Платежи</h1>
                    <p>Модуль в разработке</p>
                  </div>
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
