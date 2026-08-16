import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppState } from '../state/AppState'
import { useLanguage } from '../i18n/LanguageContext'
import IconButton from '../components/IconButton'
import { ArrowLeftIcon } from '../components/Icons'
import './LetterboxdConnectPage.css'

export default function LetterboxdConnectPage() {
  const navigate = useNavigate()
  const { letterboxd, importLetterboxdWatchlist, disconnectLetterboxd } = useAppState()
  const { t, language } = useLanguage()
  const [username, setUsername] = useState('')

  const handleImport = () => {
    if (!username.trim()) return
    importLetterboxdWatchlist(username)
    navigate('/watchlist')
  }

  return (
    <div className="page letterboxd-page">
      <header className="page-header">
        <IconButton aria-label={t('common.back')} onClick={() => navigate(-1)}>
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
            <h1 className="heading letterboxd-title">{t('letterboxd.connectedTitle')}</h1>
            <p className="letterboxd-connected">
              {t('letterboxd.importingAs')} <strong>@{letterboxd.username}</strong>
            </p>
            <ul className="letterboxd-benefits">
              <li>
                {t('letterboxd.refreshedOn', {
                  date: new Date(letterboxd.importedAt).toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US')
                })}
              </li>
              <li>
                {t(
                  letterboxd.catalogOnlyTitles.length === 1 ? 'letterboxd.titlesNotPlaying.one' : 'letterboxd.titlesNotPlaying.other',
                  { n: letterboxd.catalogOnlyTitles.length }
                )}
              </li>
            </ul>
            <button className="letterboxd-submit" onClick={() => importLetterboxdWatchlist(letterboxd.username)}>
              {t('letterboxd.refreshButton')}
            </button>
            <button className="letterboxd-disconnect" onClick={disconnectLetterboxd}>
              {t('letterboxd.disconnect')}
            </button>
          </>
        ) : (
          <>
            <h1 className="heading letterboxd-title">{t('letterboxd.importTitle')}</h1>
            <ul className="letterboxd-benefits">
              <li>👁 {t('letterboxd.benefit1')}</li>
              <li>🔔 {t('letterboxd.benefit2')}</li>
              <li>↻ {t('letterboxd.benefit3')}</li>
            </ul>
            <input
              className="letterboxd-input"
              placeholder={t('letterboxd.usernamePlaceholder')}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
            />
            <button className="letterboxd-submit" onClick={handleImport}>
              {t('letterboxd.importButton')}
            </button>
            <p className="letterboxd-disclaimer eyebrow">{t('letterboxd.disclaimer')}</p>
          </>
        )}
      </div>
    </div>
  )
}
