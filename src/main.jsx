import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Navbar from './components/Navbar'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import FaqPage from './pages/FaqPage'
import { INVOICE_CONFIG, QUOTE_CONFIG, PO_CONFIG } from './config/docTypes'
import './index.css'

function PageLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <PageLayout><App docConfig={INVOICE_CONFIG} /></PageLayout>
        } />
        <Route path="/quote-generator" element={
          <PageLayout><App docConfig={QUOTE_CONFIG} /></PageLayout>
        } />
        <Route path="/po-generator" element={
          <PageLayout><App docConfig={PO_CONFIG} /></PageLayout>
        } />
        <Route path="/about" element={
          <PageLayout><AboutPage /></PageLayout>
        } />
        <Route path="/contact" element={
          <PageLayout><ContactPage /></PageLayout>
        } />
        <Route path="/faq" element={
          <PageLayout><FaqPage /></PageLayout>
        } />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
