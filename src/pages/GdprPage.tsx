import { useEffect } from 'react'
import styled from 'styled-components'
import {
  privacyPolicyMeta,
  privacyPolicySections,
} from '../content/privacyPolicy'
import { useLang } from '../i18n/LanguageContext'
import { t } from '../i18n/dictionary'
import { COOKIE_SETTINGS_EVENT } from '../lib/cookieConsent'
import { privacyPolicyHref } from '../lib/siteRoutes'

export function GdprPage() {
  const { lang, setLang } = useLang()

  useEffect(() => {
    const title = `${privacyPolicyMeta.title[lang]} | Panorama Žabiny`
    document.title = title
    return () => {
      document.title = 'Panorama Žabiny | Byty a rezidenční projekt Brno Žabovřesky'
    }
  }, [lang])

  function openCookieSettings() {
    window.dispatchEvent(new CustomEvent(COOKIE_SETTINGS_EVENT))
  }

  return (
    <Page>
      <TopBar>
        <BarInner>
          <BackLink href="/" data-cursor="hover">
            ← {privacyPolicyMeta.backHome[lang]}
          </BackLink>
          <LangToggle>
            <LangButton
              type="button"
              data-cursor="hover"
              $active={lang === 'cz'}
              onClick={() => setLang('cz')}
            >
              CZ
            </LangButton>
            <LangButton
              type="button"
              data-cursor="hover"
              $active={lang === 'en'}
              onClick={() => setLang('en')}
            >
              EN
            </LangButton>
          </LangToggle>
        </BarInner>
      </TopBar>

      <Main>
        <Content>
          <Intro>
            <Eyebrow>{t.footer.privacy[lang]}</Eyebrow>
            <Title>{privacyPolicyMeta.title[lang]}</Title>
            <Updated>{privacyPolicyMeta.updated[lang]}</Updated>
          </Intro>

          <Article>
            {privacyPolicySections.map((section) => (
              <SectionBlock key={section.heading.cz}>
                <SectionTitle>{section.heading[lang]}</SectionTitle>
                {section.paragraphs.map((paragraph) => (
                  <Paragraph key={paragraph.cz}>{paragraph[lang]}</Paragraph>
                ))}
              </SectionBlock>
            ))}
          </Article>

          <FooterLinks>
            <FooterLink href="/" data-cursor="hover">
              panoramazabiny.cz
            </FooterLink>
            <FooterButton type="button" data-cursor="hover" onClick={openCookieSettings}>
              {t.footer.cookies[lang]}
            </FooterButton>
            <FooterLink href={privacyPolicyHref()} data-cursor="hover" aria-current="page">
              {t.footer.privacy[lang]}
            </FooterLink>
          </FooterLinks>
        </Content>
      </Main>
    </Page>
  )
}

const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.ink};
  color: rgba(245, 243, 239, 0.9);
`

const TopBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(10, 10, 10, 0.92);
  backdrop-filter: blur(12px);
`

const BarInner = styled.div`
  width: min(${({ theme }) => theme.layout.max}px, calc(100% - 2 * ${({ theme }) => theme.layout.gutter}px));
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 0;
`

const BackLink = styled.a`
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(245, 243, 239, 0.72);
  text-decoration: none;
  transition: color 220ms ease;

  &:hover {
    color: rgba(245, 243, 239, 0.96);
  }
`

const LangToggle = styled.div`
  display: inline-flex;
  gap: 8px;
`

const LangButton = styled.button<{ $active?: boolean }>`
  border: 1px solid
    ${({ $active }) =>
      $active ? 'rgba(232, 215, 176, 0.55)' : 'rgba(255, 255, 255, 0.14)'};
  background: ${({ $active }) =>
    $active ? 'rgba(232, 215, 176, 0.12)' : 'transparent'};
  color: ${({ $active }) =>
    $active ? 'rgba(245, 243, 239, 0.96)' : 'rgba(245, 243, 239, 0.58)'};
  cursor: pointer;
  min-width: 40px;
  min-height: 32px;
  font-size: 10px;
  letter-spacing: 0.18em;
`

const Main = styled.main`
  padding: clamp(40px, 6vw, 72px) 0 clamp(72px, 10vw, 120px);
`

const Content = styled.div`
  width: min(760px, calc(100% - 2 * ${({ theme }) => theme.layout.gutter}px));
  margin: 0 auto;
  display: grid;
  gap: clamp(36px, 5vw, 52px);
`

const Intro = styled.header`
  display: grid;
  gap: 14px;
  max-width: 20ch;
`

const Eyebrow = styled.p`
  margin: 0;
  font-size: 11px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(245, 243, 239, 0.48);
`

const Title = styled.h1`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: clamp(34px, 5vw, 52px);
  font-weight: 500;
  line-height: 1.08;
  letter-spacing: -0.02em;
`

const Updated = styled.p`
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.06em;
  color: rgba(245, 243, 239, 0.5);
`

const Article = styled.article`
  display: grid;
  gap: clamp(28px, 4vw, 36px);
`

const SectionBlock = styled.section`
  display: grid;
  gap: 12px;
`

const SectionTitle = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(232, 215, 176, 0.92);
`

const Paragraph = styled.p`
  margin: 0;
  font-size: 15px;
  line-height: 1.85;
  color: rgba(245, 243, 239, 0.78);
`

const FooterLinks = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`

const FooterLink = styled.a`
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(245, 243, 239, 0.58);
  text-decoration: none;

  &:hover {
    color: rgba(245, 243, 239, 0.9);
  }
`

const FooterButton = styled.button`
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(245, 243, 239, 0.58);

  &:hover {
    color: rgba(245, 243, 239, 0.9);
  }
`
