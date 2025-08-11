import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import TarotPage from './pages/TarotPage';
import FengshuiPage from './pages/FengshuiPage';
import ZodiacPage from './pages/ZodiacPage';
import NamingPage from './pages/NamingPage';
import GuziPage from './pages/GuziPage';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tarot" element={<TarotPage />} />
        <Route path="/fengshui" element={<FengshuiPage />} />
        <Route path="/zodiac" element={<ZodiacPage />} />
        <Route path="/naming" element={<NamingPage />} />
        <Route path="/guzi" element={<GuziPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Layout>
  );
}

export default App;