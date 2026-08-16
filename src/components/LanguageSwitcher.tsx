import { useLanguage, type Language } from '../i18n/LanguageContext'
import './LanguageSwitcher.css'

const OPTIONS: { value: Language; label: string }[] = [
  { value: 'en', label: 'EN' },
  { value: 'de', label: 'DE' }
]

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className="language-switcher">
      <span className="language-switcher__label">{t('account.languageLabel')}</span>
      <div className="language-switcher__pills">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={opt.value === language ? 'active' : ''}
            onClick={() => setLanguage(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
