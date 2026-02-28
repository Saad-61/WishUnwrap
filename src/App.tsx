import { useState } from 'react'
import './index.css'
import { CreateWish } from './components/CreateWish'
import { ShareScreen } from './components/ShareScreen'
import { ExperiencePreview } from './components/ExperiencePreview'
import type { WishData } from './types'

type ViewState = 'create' | 'share' | 'preview'

function App() {
  const [view, setView] = useState<ViewState>('create')
  const [wishData, setWishData] = useState<WishData | null>(null)

  const handleWishCreated = (data: WishData) => {
    setWishData(data)
    setView('share')
  }

  if (view === 'preview' && wishData) {
    return <ExperiencePreview wishData={wishData} onBack={() => setView('share')} />
  }

  if (view === 'share' && wishData) {
    return (
      <ShareScreen
        wishData={wishData}
        onBack={() => setView('create')}
        onPreview={() => setView('preview')}
      />
    )
  }

  return <CreateWish onWishCreated={handleWishCreated} />
}

export default App
