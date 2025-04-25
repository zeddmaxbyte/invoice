import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import InvoiceGenerator from './pages/InvoiceGenerator'
import CountryInvoice from './pages/CountryInvoice'

function App() {
  return (
    <Routes>
      {/* Main invoice generator page */}
      <Route path="/" element={
        <Layout>
          <InvoiceGenerator />
        </Layout>
      } />
      
      {/* Country-specific pages */}
      <Route path="/usa-invoice-generator" element={
        <Layout>
          <CountryInvoice country="usa" />
        </Layout>
      } />
      <Route path="/canada-invoice-generator" element={
        <Layout>
          <CountryInvoice country="canada" />
        </Layout>
      } />
      <Route path="/australia-invoice-generator" element={
        <Layout>
          <CountryInvoice country="australia" />
        </Layout>
      } />
      <Route path="/uk-invoice-generator" element={
        <Layout>
          <CountryInvoice country="uk" />
        </Layout>
      } />
      <Route path="/germany-invoice-generator" element={
        <Layout>
          <CountryInvoice country="germany" />
        </Layout>
      } />
      <Route path="/singapore-invoice-generator" element={
        <Layout>
          <CountryInvoice country="singapore" />
        </Layout>
      } />
      
      {/* Fallback route */}
      <Route path="*" element={
        <Layout>
          <InvoiceGenerator />
        </Layout>
      } />
    </Routes>
  )
}

export default App
