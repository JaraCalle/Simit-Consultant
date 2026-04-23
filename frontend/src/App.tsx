import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import ConsultPage from './modules/consults/pages/ConsultPage'
import HistoryPage from './modules/consults/pages/HistoryPage'

export default function App() {
  return (
    <BrowserRouter>
      <nav className="flex gap-4 p-4 bg-gray-900 text-white">
        <NavLink to="/" className={({ isActive }) => isActive ? 'underline' : ''}>
          Consulta
        </NavLink>
        <NavLink to="/historial" className={({ isActive }) => isActive ? 'underline' : ''}>
          Historial
        </NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<ConsultPage />} />
        <Route path="/historial" element={<HistoryPage />} />
      </Routes>
    </BrowserRouter>
  )
}
