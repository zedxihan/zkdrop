import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import FilePage from './pages/FilePage';

export default function App() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <Header />

      <main className="flex w-full flex-1 flex-col justify-start sm:justify-center">
        <div className="mx-auto w-full max-w-[940px] px-4 pb-6 sm:px-6 md:px-0">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/file/:id" element={<FilePage />} />
          </Routes>
        </div>
      </main>

      <Footer />
    </div>
  );
}
