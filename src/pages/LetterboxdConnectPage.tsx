import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppState } from '../state/AppState'
import IconButton from '../components/IconButton'
import { ArrowLeftIcon } from '../components/Icons'
import './LetterboxdConnectPage.css'

export default function LetterboxdConnectPage() {
  const navigate = useNavigate()
  const { letterboxd, importLetterboxdWatchlist, disconnectLetterboxd } = useAppState()
  const [username, setUsername] = useState('')

  const handleImport = () => {
    if (!username.trim()) return
    importLetterboxdWatchlist(username)
    navigate('/watchlist')
  }

  return (
    <div className="page letterboxd-page">
      <header className="page-header">
        <IconButton aria-label="Back" onClick={() => navigate(-1)}>
          <ArrowLeftIcon />
        </IconButton>
      </header>
      <div className="page-body letterboxd-body">
        <div className="letterboxd-logo">
          <span className="letterboxd-logo__dot" style={{ background: '#ff8000' }} />
          <span className="letterboxd-logo__dot" style={{ background: '#00e054' }} />
          <span className="letterboxd-logo__dot" style={{ background: '#40bcf4' }} />
        </div>

        {letterboxd ? (
          <>
            <h1 className="heading letterboxd-title">Connected to Letterboxd</h1>
            <p className="letterboxd-connected">
              Importing as <strong>@{letterboxd.username}</strong>
            </p>
            <ul className="letterboxd-benefits">
              <li>Watchlist refreshed {new Date(letterboxd.importedAt).toLocaleDateString()}</li>
              <li>{letterboxd.catalogOnlyTitles.length} titles not currently playing nearby</li>
            </ul>
            <button className="letterboxd-submit" onClick={() => importLetterboxdWatchlist(letterboxd.username)}>
              Refresh Watchlist
            </button>
            <button className="letterboxd-disconnect" onClick={disconnectLetterboxd}>
              Disconnect
            </button>
          </>
        ) : (
          <>
            <h1 className="heading letterboxd-title">Import Your Letterboxd Watchlist</h1>
            <ul className="letterboxd-benefits">
              <li>👁 See which movies are playing</li>
              <li>🔔 Get notified when others start playing</li>
              <li>↻ Refreshes daily</li>
            </ul>
            <input
              className="letterboxd-input"
              placeholder="@username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
            />
            <button className="letterboxd-submit" onClick={handleImport}>
              Import Watchlist
            </button>
            <p className="letterboxd-disclaimer eyebrow">
              Demo integration — this simulates a Letterboxd import locally, no account or network access required.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
