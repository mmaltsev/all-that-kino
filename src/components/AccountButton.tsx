import { useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'
import { PersonIcon } from './Icons'
import IconButton from './IconButton'
import './AccountButton.css'

export default function AccountButton() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <IconButton className="account-button" aria-label="Account" onClick={() => navigate('/account')}>
      {user ? (user.email ?? user.displayName ?? '?').charAt(0).toUpperCase() : <PersonIcon size={18} />}
    </IconButton>
  )
}
