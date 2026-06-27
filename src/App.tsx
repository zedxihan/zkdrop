import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import HomePage from './pages/HomePage';

const FilePage = lazy(() => import('./pages/FilePage'));

export default function App() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <Header />

      <main className="flex w-full flex-1 flex-col justify-start sm:justify-center">
        <div className="mx-auto w-full max-w-235 px-4 pb-6 sm:px-6 md:px-0">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/file/:id"
              element={
                <Suspense fallback={null}>
                  <FilePage />
                </Suspense>
              }
            />
          </Routes>
        </div>
      </main>

      <Footer />
    </div>
  );
}
