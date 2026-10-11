import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { DemoProvider } from './context/DemoContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LoginModal } from './components/auth/LoginModal';
import { LandingPage } from './pages/LandingPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { CreateListingPage } from './pages/CreateListingPage';
import { MyClaimsPage } from './pages/MyClaimsPage';
import { CoordinatorPage } from './pages/CoordinatorPage';
import { ImpactPage } from './pages/ImpactPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { ProviderVerifyPage } from './pages/ProviderVerifyPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DemoProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-[#F8F6EF] dark:bg-[#09150F] text-[#26332B] dark:text-[#E8F0EB] font-sans antialiased transition-colors duration-300">
              <Navbar />
              <LoginModal />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/discover" element={<DiscoverPage />} />
                  <Route path="/list-surplus" element={<CreateListingPage />} />
                  <Route path="/verify-handover" element={<ProviderVerifyPage />} />
                  <Route path="/my-claims" element={<MyClaimsPage />} />
                  <Route path="/coordinator" element={<CoordinatorPage />} />
                  <Route path="/impact" element={<ImpactPage />} />
                  <Route path="/how-it-works" element={<HowItWorksPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </DemoProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
