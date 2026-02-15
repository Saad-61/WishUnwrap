import { useState, useEffect } from 'react';
import './index.css';
import { CreateWish } from './components/CreateWish';
import { ShareScreen } from './components/ShareScreen';
import { ExperiencePreview } from './components/ExperiencePreview';
import { getWishFromUrl } from './utils/urlUtils';
import type { WishData } from './types';

type AppView = 'create' | 'share' | 'experience';

function App() {
  const [view, setView] = useState<AppView>('create');
  const [wishData, setWishData] = useState<WishData | null>(null);

  // Check URL hash on load — if someone opened a shared link, go straight to experience
  useEffect(() => {
    const urlWish = getWishFromUrl();
    if (urlWish) {
      setWishData(urlWish);
      setView('experience');
    }
  }, []);

  const handleWishCreated = (data: WishData) => {
    setWishData(data);
    setView('share');
  };

  if (view === 'share' && wishData) {
    return (
      <ShareScreen
        wishData={wishData}
        onBack={() => setView('create')}
        onPreview={() => setView('experience')}
      />
    );
  }

  if (view === 'experience' && wishData) {
    return (
      <ExperiencePreview
        wishData={wishData}
        onBack={() => setView('share')}
      />
    );
  }

  return <CreateWish onWishCreated={handleWishCreated} />;
}

export default App;
