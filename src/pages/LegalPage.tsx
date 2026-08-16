import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { legalContent } from '../content/legalContent'
import IconButton from '../components/IconButton'
import { ArrowLeftIcon } from '../components/Icons'
import './LegalPage.css'

const LAST_UPDATED = new Date('2026-08-16')

export default function LegalPage({ doc }: { doc: 'terms' | 'privacy' }) {
  const navigate = useNavigate()
  const { language, t } = useLanguage()
  const content = legalContent[doc][language]

  return (
    <div className="page legal-page">
      <header className="page-header">
        <IconButton aria-label={t('common.back')} onClick={() => navigate(-1)}>
          <ArrowLeftIcon />
        </IconButton>
      </header>
      <div className="page-body legal-body">
        <h1 className="heading legal-title">{content.title}</h1>
        <p className="legal-updated eyebrow">
          {t('legal.lastUpdated', { date: LAST_UPDATED.toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) })}
        </p>
        <p className="legal-intro">{content.intro}</p>
        {content.sections.map((section) => (
          <section key={section.heading} className="legal-section">
            <h2 className="legal-section__heading">{section.heading}</h2>
            {section.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            {section.bullets && (
              <ul>
                {section.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  )
}
