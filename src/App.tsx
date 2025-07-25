import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import LandingPage from './components/LandingPage'
import Dashboard from './components/Dashboard'
import SampleDataGenerator from './components/SampleDataGenerator'
import { AnalysisResult } from './types/loan-tape'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'samples'>('landing')
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([])

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Please Sign In</h1>
          <p className="text-slate-600 mb-6">You need to be authenticated to access the Loan Tape Analytics Platform</p>
          <button
            onClick={() => blink.auth.login()}
            className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {currentView === 'landing' ? (
        <LandingPage 
          onNavigateToDashboard={() => setCurrentView('dashboard')}
          onNavigateToSamples={() => setCurrentView('samples')}
          analyses={analyses}
          setAnalyses={setAnalyses}
        />
      ) : currentView === 'dashboard' ? (
        <Dashboard 
          onNavigateToLanding={() => setCurrentView('landing')}
          analyses={analyses}
          setAnalyses={setAnalyses}
        />
      ) : (
        <SampleDataGenerator />
      )}
      
      {/* Navigation */}
      {currentView !== 'landing' && (
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={() => setCurrentView('landing')}
            className="bg-white shadow-lg rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      )}
    </div>
  )
}

export default App