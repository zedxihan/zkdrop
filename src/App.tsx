import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import FilePage from './pages/FilePage';

export default function App() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <Header />

      <main className="flex w-full flex-1 flex-col justify-center px-4 pb-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/file/:id" element={<FilePage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
