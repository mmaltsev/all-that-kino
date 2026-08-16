import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'
import { useAppState } from '../state/AppState'
import IconButton from '../components/IconButton'
import { ArrowLeftIcon } from '../components/Icons'
import './AccountPage.css'

type Mode = 'sign-in' | 'sign-up'

function authErrorMessage(err: unknown): string {
  const code = (err as { code?: string } | null)?.code ?? ''
  switch (code) {
    case 'auth/invalid-email':
      return 'That email address looks invalid.'
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.'
    case 'auth/email-already-in-use':
      return 'An account with this email already exists — try signing in instead.'
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.'
    case 'auth/popup-closed-by-user':
      return ''
    case 'auth/requires-recent-login':
      return 'For security, please sign out and sign back in, then try deleting your account again.'
    default:
      return 'Something went wrong. Please try again.'
  }
}

export default function AccountPage() {
  const navigate = useNavigate()
  const { user, initializing, isConfigured, signInWithEmail, signUpWithEmail, signInWithGoogle, signOutUser, deleteAccount } = useAuth()
  const { letterboxd } = useAppState()
  const [mode, setMode] = useState<Mode>('sign-in')
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
      setError(authErrorMessage(err))
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
      const msg = authErrorMessage(err)
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
      setDeleteError(authErrorMessage(err) || 'Could not delete account. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page account-page">
      <header className="page-header">
        <IconButton aria-label="Back" onClick={() => navigate(-1)}>
          <ArrowLeftIcon />
        </IconButton>
      </header>

      <div className="page-body account-body">
        {!isConfigured ? (
          <>
            <h1 className="heading account-title">Account</h1>
            <p className="account-subtitle">
              Firebase isn't configured yet. Add your project credentials to a <code>.env</code> file to enable sign-in.
            </p>
          </>
        ) : initializing ? (
          <p className="eyebrow">Loading…</p>
        ) : user ? (
          <>
            <div className="account-avatar">{(user.email ?? user.displayName ?? '?').charAt(0).toUpperCase()}</div>
            <h1 className="heading account-title">{user.displayName ?? 'Signed in'}</h1>
            <p className="account-subtitle">{user.email}</p>
            <button className="account-submit account-signout" disabled={busy} onClick={handleSignOut}>
              Sign Out
            </button>

            <div className="account-section">
              <div className="account-section__row">
                <div>
                  <div className="account-section__label">Letterboxd</div>
                  <div className="account-section__value">
                    {letterboxd ? `Connected as @${letterboxd.username}` : 'Not connected'}
                  </div>
                </div>
                <button className="account-link-button" onClick={() => navigate('/letterboxd')}>
                  Manage
                </button>
              </div>
            </div>

            <div className="account-danger-zone">
              {!confirmingDelete ? (
                <button className="account-danger-link" onClick={() => setConfirmingDelete(true)}>
                  Delete Account
                </button>
              ) : (
                <div className="account-confirm-delete">
                  <p>This permanently deletes your account. This can't be undone.</p>
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
                      Cancel
                    </button>
                    <button className="account-danger-button" disabled={busy} onClick={handleDeleteAccount}>
                      {busy ? 'Deleting…' : 'Yes, Delete'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <h1 className="heading account-title">{mode === 'sign-in' ? 'Welcome Back' : 'Create Your Account'}</h1>

            <div className="account-mode-toggle">
              <button type="button" className={mode === 'sign-in' ? 'active' : ''} onClick={() => setMode('sign-in')}>
                Sign In
              </button>
              <button type="button" className={mode === 'sign-up' ? 'active' : ''} onClick={() => setMode('sign-up')}>
                Sign Up
              </button>
            </div>

            <form className="account-form" onSubmit={handleSubmit}>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="Email"
                className="account-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                required
                minLength={6}
                autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
                placeholder="Password"
                className="account-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p className="account-error">{error}</p>}
              <button className="account-submit" type="submit" disabled={busy}>
                {busy ? 'Please wait…' : mode === 'sign-in' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="account-divider">
              <span>or</span>
            </div>

            <button className="account-google" type="button" onClick={handleGoogle} disabled={busy}>
              <GoogleGlyph /> Continue with Google
            </button>

            <p className="account-disclaimer eyebrow">Your account powers sign-in only — watchlist data still lives on this device.</p>
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
