import type { Language } from '../i18n/LanguageContext'

export interface LegalSection {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

export interface LegalDoc {
  title: string
  intro: string
  sections: LegalSection[]
}

// Placeholder operator details — replace with your real name/company and contact
// email before relying on this in production. This is a simplified template, not
// legal advice; have it reviewed by a lawyer for full compliance.
const OPERATOR_PLACEHOLDER = { en: '[operator name]', de: '[Betreiber:in]' }
const CONTACT_PLACEHOLDER = { en: '[contact email]', de: '[Kontakt-E-Mail]' }

const termsEn: LegalDoc = {
  title: 'Terms & Conditions',
  intro:
    'These terms cover your use of All that Kino, a demo app for browsing Berlin cinema listings. By using the app, you agree to these terms.',
  sections: [
    {
      heading: '1. About this app',
      paragraphs: [
        'All that Kino is a demonstration app. The movies, cinemas, and showtimes shown are sample data for demonstration purposes and do not reflect real, currently playing screenings. Do not rely on this app to plan an actual cinema visit.'
      ]
    },
    {
      heading: '2. Accounts',
      paragraphs: [
        'Creating an account is optional and is used only to sign you in. Your watchlist, favorite cinemas, and planned screenings are stored locally in your browser and are not tied to your account or synced across devices.',
        'You are responsible for keeping your password confidential. You can delete your account at any time from the Account page.'
      ]
    },
    {
      heading: '3. Acceptable use',
      paragraphs: ['You agree not to misuse the app, attempt unauthorized access to it, or use it in any way that could disable, overburden, or impair it.']
    },
    {
      heading: '4. Third-party services',
      paragraphs: [
        'Sign-in is handled by Firebase Authentication (a Google service), including optional "Continue with Google". The Letterboxd import feature is fully simulated locally and does not connect to the real Letterboxd service or transmit your data anywhere.'
      ]
    },
    {
      heading: '5. No warranty',
      paragraphs: ['This app is provided "as is", for demonstration purposes, without any warranty of accuracy, availability, or fitness for a particular purpose.']
    },
    {
      heading: '6. Limitation of liability',
      paragraphs: [`To the maximum extent permitted by law, ${OPERATOR_PLACEHOLDER.en} is not liable for damages arising from your use of this demo app.`]
    },
    {
      heading: '7. Changes to these terms',
      paragraphs: ['These terms may be updated from time to time. Continued use of the app after changes take effect means you accept the updated terms.']
    },
    {
      heading: '8. Contact',
      paragraphs: [`Questions about these terms can be sent to ${CONTACT_PLACEHOLDER.en}.`]
    }
  ]
}

const termsDe: LegalDoc = {
  title: 'Nutzungsbedingungen',
  intro:
    'Diese Bedingungen gelten für die Nutzung von All that Kino, einer Demo-App zum Durchsuchen von Berliner Kinoprogrammen. Mit der Nutzung der App stimmst du diesen Bedingungen zu.',
  sections: [
    {
      heading: '1. Über diese App',
      paragraphs: [
        'All that Kino ist eine Demonstrations-App. Die angezeigten Filme, Kinos und Vorstellungszeiten sind Beispieldaten zu Demonstrationszwecken und entsprechen keinen echten, aktuell laufenden Vorstellungen. Verlasse dich nicht auf diese App, um einen tatsächlichen Kinobesuch zu planen.'
      ]
    },
    {
      heading: '2. Konten',
      paragraphs: [
        'Die Erstellung eines Kontos ist optional und dient ausschließlich der Anmeldung. Deine Watchlist, favorisierten Kinos und geplanten Vorstellungen werden lokal in deinem Browser gespeichert und sind nicht mit deinem Konto verknüpft oder geräteübergreifend synchronisiert.',
        'Du bist dafür verantwortlich, dein Passwort geheim zu halten. Du kannst dein Konto jederzeit über die Kontoseite löschen.'
      ]
    },
    {
      heading: '3. Zulässige Nutzung',
      paragraphs: ['Du verpflichtest dich, die App nicht zu missbrauchen, keinen unbefugten Zugriff zu versuchen und sie nicht in einer Weise zu nutzen, die sie stört, überlastet oder beeinträchtigt.']
    },
    {
      heading: '4. Dienste Dritter',
      paragraphs: [
        'Die Anmeldung erfolgt über Firebase Authentication (ein Dienst von Google), einschließlich der optionalen Funktion „Mit Google fortfahren". Die Letterboxd-Import-Funktion wird vollständig lokal simuliert und verbindet sich nicht mit dem echten Letterboxd-Dienst oder überträgt deine Daten irgendwohin.'
      ]
    },
    {
      heading: '5. Keine Gewährleistung',
      paragraphs: ['Diese App wird „wie besehen", zu Demonstrationszwecken, ohne Gewähr für Richtigkeit, Verfügbarkeit oder Eignung für einen bestimmten Zweck bereitgestellt.']
    },
    {
      heading: '6. Haftungsbeschränkung',
      paragraphs: [`Soweit gesetzlich zulässig, haftet ${OPERATOR_PLACEHOLDER.de} nicht für Schäden, die durch die Nutzung dieser Demo-App entstehen.`]
    },
    {
      heading: '7. Änderungen dieser Bedingungen',
      paragraphs: ['Diese Bedingungen können von Zeit zu Zeit aktualisiert werden. Die fortgesetzte Nutzung der App nach Inkrafttreten von Änderungen bedeutet, dass du die aktualisierten Bedingungen akzeptierst.']
    },
    {
      heading: '8. Kontakt',
      paragraphs: [`Fragen zu diesen Bedingungen kannst du an ${CONTACT_PLACEHOLDER.de} richten.`]
    }
  ]
}

const privacyEn: LegalDoc = {
  title: 'Privacy Policy',
  intro:
    'This policy explains what data All that Kino processes and why, in line with the EU General Data Protection Regulation (GDPR).',
  sections: [
    {
      heading: '1. Controller',
      paragraphs: [`The controller responsible for data processing is ${OPERATOR_PLACEHOLDER.en}, reachable at ${CONTACT_PLACEHOLDER.en}.`]
    },
    {
      heading: '2. What data we process',
      paragraphs: ['Account data: if you create an account, we process the email address you provide. Your password is never stored in readable form — it is hashed and managed by Firebase Authentication. If you use "Continue with Google", we receive your name, email address, and profile picture from Google.'],
      bullets: [
        'Locally stored data: your watchlist, favorite cinemas, planned screenings, and Letterboxd demo connection are stored only in your browser\'s local storage, on your device. This data is never transmitted to or stored on our servers.'
      ]
    },
    {
      heading: '3. Purpose and legal basis',
      paragraphs: [],
      bullets: [
        'Account creation and sign-in: performance of a contract with you (Art. 6(1)(b) GDPR).',
        'Optional Google Sign-In: your consent, given by choosing to use it (Art. 6(1)(a) GDPR).'
      ]
    },
    {
      heading: '4. Recipients & third-party processors',
      paragraphs: [
        'Firebase Authentication (Google Ireland Limited / Google LLC) processes your account data on our behalf to provide sign-in. Firebase may transfer data to servers in the United States; Google provides safeguards such as EU Standard Contractual Clauses for such transfers. See Google\'s Privacy Policy for details.'
      ]
    },
    {
      heading: '5. Storage duration',
      paragraphs: [],
      bullets: [
        'Account data is stored until you delete your account (available anytime from the Account page) or contact us to request deletion.',
        'Data in your browser\'s local storage stays on your device until you clear it or delete it via your browser settings.'
      ]
    },
    {
      heading: '6. Your rights',
      paragraphs: [
        'Under the GDPR, you have the right to access (Art. 15), rectify (Art. 16), erase (Art. 17), restrict (Art. 18), and port (Art. 20) your data, and to object to its processing (Art. 21). You can delete your account and its data yourself at any time from the Account page. You also have the right to lodge a complaint with a data protection supervisory authority.'
      ]
    },
    {
      heading: '7. Cookies & local storage',
      paragraphs: ['This app does not use tracking or advertising cookies. We use your browser\'s local storage only to remember your preferences (such as language) and your saved movies, cinemas, and planned screenings on this device.']
    },
    {
      heading: '8. Children',
      paragraphs: ['This demo app is not directed at children under 16, and we do not knowingly collect data from children.']
    },
    {
      heading: '9. Changes to this policy',
      paragraphs: ['We may update this policy from time to time. Material changes will be reflected by an updated date at the top of this page.']
    },
    {
      heading: '10. Contact',
      paragraphs: [`For any privacy questions or requests, contact ${CONTACT_PLACEHOLDER.en}.`]
    }
  ]
}

const privacyDe: LegalDoc = {
  title: 'Datenschutzerklärung',
  intro:
    'Diese Erklärung beschreibt, welche Daten All that Kino verarbeitet und warum, gemäß der EU-Datenschutz-Grundverordnung (DSGVO).',
  sections: [
    {
      heading: '1. Verantwortlicher',
      paragraphs: [`Verantwortlich für die Datenverarbeitung ist ${OPERATOR_PLACEHOLDER.de}, erreichbar unter ${CONTACT_PLACEHOLDER.de}.`]
    },
    {
      heading: '2. Welche Daten wir verarbeiten',
      paragraphs: ['Kontodaten: Wenn du ein Konto erstellst, verarbeiten wir die von dir angegebene E-Mail-Adresse. Dein Passwort wird niemals im Klartext gespeichert — es wird von Firebase Authentication gehasht verwaltet. Wenn du „Mit Google fortfahren" nutzt, erhalten wir deinen Namen, deine E-Mail-Adresse und dein Profilbild von Google.'],
      bullets: [
        'Lokal gespeicherte Daten: Deine Watchlist, favorisierten Kinos, geplanten Vorstellungen und die Letterboxd-Demo-Verbindung werden ausschließlich im lokalen Speicher deines Browsers, auf deinem Gerät, gespeichert. Diese Daten werden niemals an unsere Server übertragen oder dort gespeichert.'
      ]
    },
    {
      heading: '3. Zweck und Rechtsgrundlage',
      paragraphs: [],
      bullets: [
        'Kontoerstellung und Anmeldung: Erfüllung eines Vertrags mit dir (Art. 6 Abs. 1 lit. b DSGVO).',
        'Optionale Google-Anmeldung: deine Einwilligung, die du durch die Nutzung erteilst (Art. 6 Abs. 1 lit. a DSGVO).'
      ]
    },
    {
      heading: '4. Empfänger & Auftragsverarbeiter',
      paragraphs: [
        'Firebase Authentication (Google Ireland Limited / Google LLC) verarbeitet deine Kontodaten in unserem Auftrag, um die Anmeldung zu ermöglichen. Firebase kann Daten an Server in den USA übertragen; Google stellt für solche Übertragungen geeignete Garantien wie die EU-Standardvertragsklauseln bereit. Details findest du in der Datenschutzerklärung von Google.'
      ]
    },
    {
      heading: '5. Speicherdauer',
      paragraphs: [],
      bullets: [
        'Kontodaten werden gespeichert, bis du dein Konto löschst (jederzeit über die Kontoseite möglich) oder uns zur Löschung kontaktierst.',
        'Daten im lokalen Speicher deines Browsers verbleiben auf deinem Gerät, bis du sie über die Browsereinstellungen löschst.'
      ]
    },
    {
      heading: '6. Deine Rechte',
      paragraphs: [
        'Nach der DSGVO hast du das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18) und Datenübertragbarkeit (Art. 20) sowie ein Widerspruchsrecht (Art. 21). Du kannst dein Konto und die zugehörigen Daten jederzeit selbst über die Kontoseite löschen. Du hast außerdem das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren.'
      ]
    },
    {
      heading: '7. Cookies & lokaler Speicher',
      paragraphs: ['Diese App verwendet keine Tracking- oder Werbe-Cookies. Wir nutzen den lokalen Speicher deines Browsers nur, um deine Einstellungen (z. B. die Sprache) sowie deine gespeicherten Filme, Kinos und geplanten Vorstellungen auf diesem Gerät zu merken.']
    },
    {
      heading: '8. Kinder',
      paragraphs: ['Diese Demo-App richtet sich nicht an Kinder unter 16 Jahren, und wir erheben wissentlich keine Daten von Kindern.']
    },
    {
      heading: '9. Änderungen dieser Erklärung',
      paragraphs: ['Wir können diese Erklärung von Zeit zu Zeit aktualisieren. Wesentliche Änderungen werden durch ein aktualisiertes Datum oben auf dieser Seite kenntlich gemacht.']
    },
    {
      heading: '10. Kontakt',
      paragraphs: [`Bei Fragen oder Anliegen zum Datenschutz wende dich an ${CONTACT_PLACEHOLDER.de}.`]
    }
  ]
}

export const legalContent: Record<'terms' | 'privacy', Record<Language, LegalDoc>> = {
  terms: { en: termsEn, de: termsDe },
  privacy: { en: privacyEn, de: privacyDe }
}
