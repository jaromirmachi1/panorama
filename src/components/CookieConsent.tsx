import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useLang } from '../i18n/LanguageContext'
import {
  COOKIE_SETTINGS_EVENT,
  getCookieConsent,
  saveCookieConsent,
  type CookieConsentPreferences,
} from '../lib/cookieConsent'
import { applyMarketingConsent } from '../lib/marketingTracking'

const defaultPreferences: CookieConsentPreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
}

const copy = {
  title: {
    cz: 'Soukromí a cookies',
    en: 'Privacy and cookies',
  },
  body: {
    cz: 'Používáme nezbytné cookies pro fungování webu. Volitelné cookies nám pomáhají měřit návštěvnost a vyhodnocovat poptávky.',
    en: 'We use necessary cookies to keep the site working. Optional cookies help us measure traffic and evaluate inquiries.',
  },
  necessary: {
    cz: 'Nezbytné',
    en: 'Necessary',
  },
  necessaryText: {
    cz: 'Vždy aktivní',
    en: 'Always active',
  },
  analytics: {
    cz: 'Analytika',
    en: 'Analytics',
  },
  analyticsText: {
    cz: 'Pomáhá nám pochopit, jak lidé web používají.',
    en: 'Helps us understand how people use the website.',
  },
  marketing: {
    cz: 'Marketing',
    en: 'Marketing',
  },
  marketingText: {
    cz: 'Umožní měření reklam a konverzí, například Sklik a Google Ads.',
    en: 'Allows ad and conversion measurement, for example Sklik and Google Ads.',
  },
  accept: {
    cz: 'Přijmout vše',
    en: 'Accept all',
  },
  reject: {
    cz: 'Odmítnout volitelné',
    en: 'Reject optional',
  },
  settings: {
    cz: 'Nastavení',
    en: 'Settings',
  },
  save: {
    cz: 'Uložit volbu',
    en: 'Save choice',
  },
} as const

export function CookieConsent() {
  const { lang } = useLang()
  const storedConsent = useMemo(() => getCookieConsent(), [])
  const [visible, setVisible] = useState(() => storedConsent === null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [draft, setDraft] = useState<CookieConsentPreferences>(
    storedConsent ?? defaultPreferences,
  )

  useEffect(() => {
    applyMarketingConsent(storedConsent)

    function openSettings() {
      setDraft(getCookieConsent() ?? defaultPreferences)
      setSettingsOpen(true)
      setVisible(true)
    }

    window.addEventListener(COOKIE_SETTINGS_EVENT, openSettings)
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, openSettings)
  }, [storedConsent])

  function persist(preferences: CookieConsentPreferences) {
    saveCookieConsent(preferences)
    applyMarketingConsent(preferences)
    setDraft(preferences)
    setSettingsOpen(false)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <Wrap role="dialog" aria-label={copy.title[lang]} aria-live="polite">
      <Panel>
        <Content>
          <Kicker>Cookies</Kicker>
          <Title>{copy.title[lang]}</Title>
          <Text>{copy.body[lang]}</Text>

          {settingsOpen && (
            <Options>
              <Option>
                <OptionText>
                  <OptionTitle>{copy.necessary[lang]}</OptionTitle>
                  <OptionMeta>{copy.necessaryText[lang]}</OptionMeta>
                </OptionText>
                <Switch aria-label={copy.necessary[lang]}>
                  <input type="checkbox" checked disabled />
                  <span />
                </Switch>
              </Option>

              <Option>
                <OptionText>
                  <OptionTitle>{copy.analytics[lang]}</OptionTitle>
                  <OptionMeta>{copy.analyticsText[lang]}</OptionMeta>
                </OptionText>
                <Switch aria-label={copy.analytics[lang]}>
                  <input
                    type="checkbox"
                    checked={draft.analytics}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        analytics: event.target.checked,
                      }))
                    }
                  />
                  <span />
                </Switch>
              </Option>

              <Option>
                <OptionText>
                  <OptionTitle>{copy.marketing[lang]}</OptionTitle>
                  <OptionMeta>{copy.marketingText[lang]}</OptionMeta>
                </OptionText>
                <Switch aria-label={copy.marketing[lang]}>
                  <input
                    type="checkbox"
                    checked={draft.marketing}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        marketing: event.target.checked,
                      }))
                    }
                  />
                  <span />
                </Switch>
              </Option>
            </Options>
          )}
        </Content>

        <Actions>
          {settingsOpen ? (
            <PrimaryButton data-cursor="hover" onClick={() => persist(draft)}>
              {copy.save[lang]}
            </PrimaryButton>
          ) : (
            <PrimaryButton
              data-cursor="hover"
              onClick={() =>
                persist({ necessary: true, analytics: true, marketing: true })
              }
            >
              {copy.accept[lang]}
            </PrimaryButton>
          )}
          <SecondaryButton
            data-cursor="hover"
            onClick={() =>
              persist({ necessary: true, analytics: false, marketing: false })
            }
          >
            {copy.reject[lang]}
          </SecondaryButton>
          {!settingsOpen && (
            <TextButton
              data-cursor="hover"
              type="button"
              onClick={() => setSettingsOpen(true)}
            >
              {copy.settings[lang]}
            </TextButton>
          )}
        </Actions>
      </Panel>
    </Wrap>
  )
}

const Wrap = styled.section`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 120;
  padding: clamp(14px, 3vw, 28px);
  pointer-events: none;
`

const Panel = styled.div`
  pointer-events: auto;
  width: min(100%, 920px);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: clamp(18px, 3vw, 34px);
  align-items: end;
  padding: clamp(18px, 3vw, 28px);
  color: ${({ theme }) => theme.colors.white};
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.035)),
    rgba(10, 10, 10, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(18px);

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`

const Content = styled.div`
  display: grid;
  gap: 10px;
`

const Kicker = styled.p`
  margin: 0;
  font-size: 10px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.54);
`

const Title = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(20px, 2vw, 30px);
  font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`

const Text = styled.p`
  max-width: 66ch;
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 13px;
  line-height: 1.7;
`

const Options = styled.div`
  display: grid;
  gap: 10px;
  margin-top: 8px;
`

const Option = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 12px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`

const OptionText = styled.span`
  display: grid;
  gap: 4px;
`

const OptionTitle = styled.span`
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
`

const OptionMeta = styled.span`
  color: rgba(255, 255, 255, 0.58);
  font-size: 12px;
  line-height: 1.5;
`

const Switch = styled.span`
  position: relative;
  flex: 0 0 auto;
  width: 48px;
  height: 26px;

  input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }

  input:disabled {
    cursor: not-allowed;
  }

  span {
    position: absolute;
    inset: 0;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.16);
    transition: background 220ms ease;
  }

  span::after {
    content: '';
    position: absolute;
    top: 4px;
    left: 4px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #ffffff;
    transition: transform 220ms ease;
  }

  input:checked + span {
    background: rgba(255, 255, 255, 0.86);
  }

  input:checked + span::after {
    transform: translateX(22px);
    background: #0a0a0a;
  }
`

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;

  @media (max-width: 760px) {
    justify-content: stretch;

    button {
      flex: 1 1 100%;
    }
  }
`

const ButtonBase = styled.button`
  border: 0;
  cursor: pointer;
  min-height: 42px;
  padding: 0 18px;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  transition:
    transform 220ms ease,
    background 220ms ease,
    color 220ms ease,
    border-color 220ms ease;

  &:hover {
    transform: translateY(-1px);
  }
`

const PrimaryButton = styled(ButtonBase)`
  color: #0a0a0a;
  background: rgba(255, 255, 255, 0.92);
`

const SecondaryButton = styled(ButtonBase)`
  color: rgba(255, 255, 255, 0.88);
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
`

const TextButton = styled(ButtonBase)`
  min-height: 0;
  padding: 0;
  color: rgba(255, 255, 255, 0.68);
  background: transparent;

  &:hover {
    color: rgba(255, 255, 255, 0.94);
    transform: none;
  }
`
