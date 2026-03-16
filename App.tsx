
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Player from './pages/Player';
import Details from './pages/Details';
import Profile from './pages/Profile';
import ProfileSelection from './pages/ProfileSelection';
import AdminDashboard from './pages/AdminDashboard';
import ComingSoon from './pages/ComingSoon';
import BusinessAds from './pages/BusinessAds';
import Login from './pages/Login';
import Signup from './pages/Signup';
import LiveTV from './pages/LiveTV';
import ScrollToTop from './components/ScrollToTop';

const App: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/app" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/live" element={<LiveTV />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/business" element={<BusinessAds />} />
          <Route path="/profiles" element={<ProfileSelection />} />
          <Route path="/title/:id" element={<Details />} />
          <Route path="/watch/:id" element={<Player />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
