import styled from 'styled-components'
import { Container } from './Section'
import { useLang } from '../i18n/LanguageContext'
import { t } from '../i18n/dictionary'
import { FaInstagram, FaTiktok } from 'react-icons/fa'
import { useMemo, type MouseEvent } from 'react'

export function Footer() {
  const { lang } = useLang()
  const year = new Date().getFullYear()
  const poweredText = String(t.footer.powered[lang])
  const poweredParts = poweredText.split('uitherapy')
  const madeByText = String(t.footer.madeBy[lang])
  const madeByParts = madeByText.split('uitherapy')

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  }, [])

  function scrollToSection(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault()
    const href = e.currentTarget.getAttribute('href') || ''
    const id = href.startsWith('#') ? href.slice(1) : ''
    if (!id) return

    const el = document.getElementById(id)
    if (!el) return

    el.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    })

    window.history.replaceState({}, '', `#${id}`)
  }

  return (
    <Wrap>
      <Container>
        <FooterInner>
          <WordmarkStack>
            <WordmarkLogo
              src="/[LOGO]panoramaBezBgBile.png"
              alt={t.hero.wordmarkAria[lang]}
              loading="lazy"
              decoding="async"
            />
          </WordmarkStack>

        <FooterTop>
          <BrandBlock>
            <Brand>
              <LogoImg
                src="/[LOGO]panoramaBezBgBile.png"
                alt="Panorama Žabiny logo"
                loading="lazy"
                decoding="async"
              />
              Panorama Žabiny
            </Brand>
            <Powered>
              {poweredParts.length > 1 ? (
                <>
                  {poweredParts[0]}
                  <PoweredEm>uitherapy</PoweredEm>
                  {poweredParts.slice(1).join('')}
                </>
              ) : (
                t.footer.powered[lang]
              )}
            </Powered>
          </BrandBlock>

          <Cols>
            <Col>
              <ColTitle>{t.footer.columns.projects[lang]}</ColTitle>
              <ColLink data-cursor="hover" href="#agency" onClick={scrollToSection}>
                {t.nav.project[lang]}
              </ColLink>
              <ColLink
                data-cursor="hover"
                href="#apartments"
                onClick={scrollToSection}
              >
                {t.nav.apartments[lang]}
              </ColLink>
              <ColLink
                data-cursor="hover"
                href="#features"
                onClick={scrollToSection}
              >
                {t.nav.benefits[lang]}
              </ColLink>
            </Col>

            <Col>
              <ColTitle>{t.footer.columns.contact[lang]}</ColTitle>
              <ColLink
                data-cursor="hover"
                href="mailto:info@panorama-zabiny.cz"
                onClick={(e) => {
                  // keep default mailto behavior
                  e.stopPropagation()
                }}
              >
                info@panorama-zabiny.cz
              </ColLink>
              <ColLink
                data-cursor="hover"
                href="tel:+420000000000"
                onClick={(e) => {
                  // keep default tel behavior
                  e.stopPropagation()
                }}
              >
                +420 000 000 000
              </ColLink>
            </Col>

            <Col>
              <ColTitle>{t.footer.columns.socials[lang]}</ColTitle>
              <ColMeta>{t.nav.news[lang]}</ColMeta>
              <ColMeta>{t.nav['réseaux'][lang]}</ColMeta>
              <ColMeta>{t.footer.location[lang]}</ColMeta>
            </Col>
          </Cols>
        </FooterTop>

          <Bottom>
            <BottomLeft>
              <Small>© {year}</Small>
            </BottomLeft>

            <BottomCenter>
              <SocialLink
                data-cursor="hover"
                aria-label={t.nav.instagram[lang]}
                href="https://www.instagram.com/lvlreality.cz/"
                target="_blank"
                rel="noreferrer"
              >
                <FaInstagram size={18} />
              </SocialLink>
              <SocialLink
                data-cursor="hover"
                aria-label="TikTok"
                href="https://www.tiktok.com/"
                target="_blank"
                rel="noreferrer"
              >
                <FaTiktok size={18} />
              </SocialLink>
            </BottomCenter>

            <BottomRight>
              <Small>
                {madeByParts.length > 1 ? (
                  <>
                    {madeByParts[0]}
                    <PoweredEm>uitherapy</PoweredEm>
                    {madeByParts.slice(1).join('')}
                  </>
                ) : (
                  t.footer.madeBy[lang]
                )}
              </Small>
            </BottomRight>
          </Bottom>
        </FooterInner>
      </Container>
    </Wrap>
  )
}

const Wrap = styled.footer`
  position: relative;
  background: #000000;
  color: #ffffff;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: clamp(40px, 6vw, 72px) 0 clamp(28px, 4vw, 48px);
  min-height: clamp(320px, 42vh, 560px);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(
      120% 80% at 50% 0%,
      rgba(255, 255, 255, 0.06),
      transparent 55%
    );
  }

  &::after {
    content: none;
  }
`

const FooterInner = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: clamp(28px, 4vw, 48px);
  min-height: min(42vh, 520px);
`

const WordmarkStack = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: clamp(12px, 2.5vw, 32px) 0;
`

const WordmarkLogo = styled.img`
  display: block;
  width: min(100%, clamp(160px, 40vw, 360px));
  height: auto;
  object-fit: contain;
`

const FooterTop = styled.div`
  position: relative;
  z-index: 1;
  display: none;
`

const Brand = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: ${({ theme }) => theme.fonts.heading};
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.8);
`

const LogoImg = styled.img`
  display: block;
  width: 26px;
  height: auto;
`

const BrandBlock = styled.div`
  display: grid;
  gap: 12px;
  align-content: start;
`

const Cols = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 26px;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`

const Col = styled.div`
  display: grid;
  gap: 10px;
`

const ColTitle = styled.div`
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  opacity: 0.72;
`

const ColLink = styled.a`
  font-size: 12px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.64);
  transition: color 450ms ease;
  position: relative;
  padding-bottom: 6px;

  &:hover {
    color: rgba(255, 255, 255, 0.88);
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background: rgba(255, 255, 255, 0.35);
    transform: scaleX(0.08);
    transform-origin: left;
    transition: transform 520ms ease, opacity 520ms ease;
    opacity: 0.7;
  }

  &:hover::after {
    transform: scaleX(1);
    opacity: 1;
  }
`

const ColMeta = styled.div`
  font-size: 12px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.64);
  line-height: 1.6;
`

const Powered = styled.div`
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.55);
  max-width: 44ch;
`

const PoweredEm = styled.span`
  color: rgba(255, 255, 255, 0.98);
  font-weight: 600;
`

const Bottom = styled.div`
  position: relative;
  z-index: 1;
  margin-top: 0;
  padding-top: clamp(18px, 2.5vw, 28px);
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 14px;
  align-items: center;

  @media (max-width: 720px) {
    grid-template-columns: 1fr auto;
    grid-template-areas:
      'left center'
      'right right';
  }
`

const BottomLeft = styled.div`
  display: grid;
  gap: 10px;
  justify-self: start;
`

const BottomCenter = styled.div`
  display: inline-flex;
  align-items: center;
  justify-self: center;
  gap: 18px;
`

const BottomRight = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  justify-self: end;
`

const Small = styled.div`
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.84);
`

const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: rgba(255, 255, 255, 0.92);
  transition: transform 220ms ease, opacity 220ms ease;

  &:hover {
    transform: translateY(-1px);
    opacity: 0.96;
  }
`

