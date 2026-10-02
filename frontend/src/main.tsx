import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from 'react-router'
import { Home } from './pages/Home.tsx'
import { CodeEditor } from './pages/CodeEditor.tsx'
import { ErrorPage } from './pages/ErrorPage.tsx'
import { ProtectedRoute } from './components/ProtectedRoute.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/error' element={<ErrorPage />} />
        <Route path='/' element={<App />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/home' element={<Home />} />
          <Route path='/:username/:userId/:lang' element={<CodeEditor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
