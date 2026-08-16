import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'
import { useAppState } from '../state/AppState'
import { useLanguage } from '../i18n/LanguageContext'
import type { TranslationKey } from '../i18n/en'
import IconButton from '../components/IconButton'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { ArrowLeftIcon } from '../components/Icons'
import './AccountPage.css'

type Mode = 'sign-in' | 'sign-up'

function authErrorMessage(err: unknown, t: (key: TranslationKey) => string): string {
  const code = (err as { code?: string } | null)?.code ?? ''
  switch (code) {
    case 'auth/invalid-email':
      return t('account.error.invalidEmail')
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return t('account.error.wrongCredentials')
    case 'auth/email-already-in-use':
      return t('account.error.emailInUse')
    case 'auth/weak-password':
      return t('account.error.weakPassword')
    case 'auth/popup-closed-by-user':
      return ''
    case 'auth/requires-recent-login':
      return t('account.error.requiresRecentLogin')
    default:
      return t('account.error.generic')
  }
}

export default function AccountPage() {
  const navigate = useNavigate()
  const { user, initializing, isConfigured, signInWithEmail, signUpWithEmail, signInWithGoogle, signOutUser, deleteAccount } = useAuth()
  const { letterboxd } = useAppState()
  const { t } = useLanguage()
  const [mode, setMode] = useState<Mode>('sign-up')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      if (mode === 'sign-in') await signInWithEmail(email, password)
      else await signUpWithEmail(email, password)
      navigate('/movies')
    } catch (err) {
      setError(authErrorMessage(err, t))
    } finally {
      setBusy(false)
    }
  }

  const handleGoogle = async () => {
    setError(null)
    setBusy(true)
    try {
      await signInWithGoogle()
      navigate('/movies')
    } catch (err) {
      const msg = authErrorMessage(err, t)
      if (msg) setError(msg)
    } finally {
      setBusy(false)
    }
  }

  const handleSignOut = async () => {
    setBusy(true)
    await signOutUser()
    setBusy(false)
  }

  const handleDeleteAccount = async () => {
    setBusy(true)
    setDeleteError(null)
    try {
      await deleteAccount()
    } catch (err) {
      setDeleteError(authErrorMessage(err, t) || t('account.deleteGenericError'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page account-page">
      <header className="page-header">
        <IconButton aria-label={t('common.back')} onClick={() => navigate(-1)}>
          <ArrowLeftIcon />
        </IconButton>
      </header>

      <div className="page-body account-body">
        {!isConfigured ? (
          <>
            <h1 className="heading account-title">{t('account.title')}</h1>
            <p className="account-subtitle">{t('account.notConfiguredMessage')}</p>
          </>
        ) : initializing ? (
          <p className="eyebrow">{t('account.loading')}</p>
        ) : user ? (
          <>
            <div className="account-avatar">{(user.email ?? user.displayName ?? '?').charAt(0).toUpperCase()}</div>
            <h1 className="heading account-title">{user.displayName ?? t('account.signedInFallback')}</h1>
            <p className="account-subtitle">{user.email}</p>
            <button className="account-submit account-signout" disabled={busy} onClick={handleSignOut}>
              {t('account.signOut')}
            </button>

            <div className="account-section">
              <div className="account-section__row">
                <div>
                  <div className="account-section__label">{t('account.letterboxdLabel')}</div>
                  <div className="account-section__value">
                    {letterboxd ? t('account.letterboxdConnectedAs', { username: letterboxd.username }) : t('account.letterboxdNotConnected')}
                  </div>
                </div>
                <button className="account-link-button" onClick={() => navigate('/letterboxd')}>
                  {t('account.manage')}
                </button>
              </div>
            </div>

            <div className="account-section">
              <LanguageSwitcher />
            </div>

            <div className="account-danger-zone">
              {!confirmingDelete ? (
                <button className="account-danger-link" onClick={() => setConfirmingDelete(true)}>
                  {t('account.deleteAccount')}
                </button>
              ) : (
                <div className="account-confirm-delete">
                  <p>{t('account.deleteConfirmMessage')}</p>
                  {deleteError && <p className="account-error">{deleteError}</p>}
                  <div className="account-confirm-delete__actions">
                    <button
                      className="account-cancel"
                      disabled={busy}
                      onClick={() => {
                        setConfirmingDelete(false)
                        setDeleteError(null)
                      }}
                    >
                      {t('account.cancel')}
                    </button>
                    <button className="account-danger-button" disabled={busy} onClick={handleDeleteAccount}>
                      {busy ? t('account.deleting') : t('account.yesDelete')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <h1 className="heading account-title">{mode === 'sign-in' ? t('account.welcomeBack') : t('account.createYourAccount')}</h1>

            <div className="account-mode-toggle">
              <button type="button" className={mode === 'sign-up' ? 'active' : ''} onClick={() => setMode('sign-up')}>
                {t('account.signUp')}
              </button>
              <button type="button" className={mode === 'sign-in' ? 'active' : ''} onClick={() => setMode('sign-in')}>
                {t('account.signIn')}
              </button>
            </div>

            <form className="account-form" onSubmit={handleSubmit}>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder={t('account.emailPlaceholder')}
                className="account-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                required
                minLength={6}
                autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
                placeholder={t('account.passwordPlaceholder')}
                className="account-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p className="account-error">{error}</p>}
              <button className="account-submit" type="submit" disabled={busy}>
                {busy ? t('account.pleaseWait') : mode === 'sign-in' ? t('account.signIn') : t('account.createAccountButton')}
              </button>
            </form>

            <div className="account-divider">
              <span>{t('account.or')}</span>
            </div>

            <button className="account-google" type="button" onClick={handleGoogle} disabled={busy}>
              <GoogleGlyph /> {t('account.continueWithGoogle')}
            </button>

            {mode === 'sign-up' && (
              <p className="account-consent eyebrow">
                {t('account.consentPrefix')}
                <Link to="/terms">{t('account.consentTermsLink')}</Link>
                {t('account.consentMiddle')}
                <Link to="/privacy">{t('account.consentPrivacyLink')}</Link>
                {t('account.consentSuffix')}
              </p>
            )}

            <div className="account-language-row">
              <LanguageSwitcher />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.09-1.79 2.73v2.27h2.9c1.7-1.56 2.69-3.87 2.69-6.64z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.27c-.81.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.34C2.44 15.98 5.48 18 9 18z" />
      <path fill="#FBBC05" d="M3.95 10.69A5.4 5.4 0 0 1 3.68 9c0-.59.1-1.16.27-1.69V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l2.99-2.34z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.97l2.99 2.34C4.66 5.17 6.65 3.58 9 3.58z" />
    </svg>
  )
}
