import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Regions from './pages/Regions';
import Documents from './pages/Documents';
import Payments from './pages/Payments';
import CreatePayment from './pages/CreatePayment';
import CreateMassPayment from './pages/CreateMassPayment';
import Stores from './pages/Stores';
import AlcoholLicenses from './pages/AlcoholLicenses';
import TobaccoLicenses from './pages/TobaccoLicenses';
import EgrnExtract from './pages/EgrnExtract';
import EgrnList from './pages/EgrnList';
import GisAnalysis from './pages/GisAnalysis';
import MainLayout from './components/Layout';
import './App.css';

function App() {
  return (
    <ConfigProvider locale={ruRU}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <MainLayout>
                <Dashboard />
              </MainLayout>
            }
          />
          <Route
            path="/tasks"
            element={
              <MainLayout>
                <Tasks />
              </MainLayout>
            }
          />

          <Route
            path="/documents"
            element={
              <MainLayout>
                <Documents />
              </MainLayout>
            }
          />
          <Route
            path="/documents/egrn-list"
            element={
              <MainLayout>
                <EgrnList />
              </MainLayout>
            }
          />
          <Route
            path="/documents/gis"
            element={
              <MainLayout>
                <GisAnalysis />
              </MainLayout>
            }
          />
          <Route
            path="/documents/egrn/create"
            element={
              <MainLayout>
                <EgrnExtract />
              </MainLayout>
            }
          />
          <Route
            path="/documents/egrn/:id"
            element={
              <MainLayout>
                <EgrnExtract />
              </MainLayout>
            }
          />
          <Route
            path="/payments"
            element={
              <MainLayout>
                <Payments />
              </MainLayout>
            }
          />
          <Route
            path="/payments/create"
            element={
              <MainLayout>
                <CreatePayment />
              </MainLayout>
            }
          />
          <Route
            path="/payments/create-mass"
            element={
              <MainLayout>
                <CreateMassPayment />
              </MainLayout>
            }
          />
          <Route
            path="/regions"
            element={
              <MainLayout>
                <Regions />
              </MainLayout>
            }
          />

          <Route
            path="/stores"
            element={
              <MainLayout>
                <Stores />
              </MainLayout>
            }
          />
          <Route
            path="/references/alcohol"
            element={
              <MainLayout>
                <AlcoholLicenses />
              </MainLayout>
            }
          />
          <Route
            path="/references/tobacco"
            element={
              <MainLayout>
                <TobaccoLicenses />
              </MainLayout>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
