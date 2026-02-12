import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AboutUs from './pages/AboutUs';
import Home from './pages/Home';
import Research from './pages/Research';
import Dashboard from './pages/Dashboard';
import RiskProfile from './pages/profile/RiskProfile';
import Portfolio from './pages/profile/Portfolio';
import Settings from './pages/profile/Settings';
import UserDetails from './pages/profile/UserDetails';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Layout from './Layout';
import { AuthProvider } from './context/AuthContext';
import Assessment from './pages/Assessment';
import Energy from './pages/sectorss/Energy';
import FMCG from './pages/sectorss/FMCG';
import Healthcare from './pages/sectorss/Healthcare';



function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Wrapping all routes with Layout */}
          <Route path="login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="research" element={<Research />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="dashboard/energy" element={<Energy />} />
            <Route path="dashboard/fmcg" element={<FMCG />} />
            <Route path="dashboard/healthcare" element={<Healthcare />} />
            <Route path="risk-profile" element={<RiskProfile />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="settings" element={<Settings />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            <Route path="details" element={<UserDetails />} />
            <Route path="assessment" element={<Assessment />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;