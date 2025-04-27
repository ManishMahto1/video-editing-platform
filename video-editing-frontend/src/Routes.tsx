import { Routes as RouterRoutes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import EditorPage from './pages/EditorPage'

export default function Routes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/editor/:videoId" element={<EditorPage />} />
    </RouterRoutes>
  )
}