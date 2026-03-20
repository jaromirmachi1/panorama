import styled from 'styled-components'
import { Container } from './Section'

export function Footer() {
  return (
    <Wrap>
      <Container>
        <Row>
          <Brand>
            <Mark aria-hidden="true" />
            Panorama Žabiny
          </Brand>
          <Links>
            <Link data-cursor="hover" href="mailto:info@panorama-zabiny.cz">
              info@panorama-zabiny.cz
            </Link>
            <Sep aria-hidden="true" />
            <Link data-cursor="hover" href="tel:+420000000000">
              +420 000 000 000
            </Link>
          </Links>
        </Row>
        <Bottom>
          <Small>© {new Date().getFullYear()} Panorama Žabiny</Small>
          <Small>Luxusní prezentace • statický web</Small>
        </Bottom>
      </Container>
    </Wrap>
  )
}

const Wrap = styled.footer`
  padding: 36px 0 44px;
  background: ${({ theme }) => theme.colors.ink};
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
`

const Brand = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: ${({ theme }) => theme.fonts.heading};
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
`

const Mark = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
`

const Links = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`

const Link = styled.a`
  font-size: 12px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.64);
  transition: color 450ms ease;

  &:hover {
    color: rgba(255, 255, 255, 0.88);
  }
`

const Sep = styled.div`
  width: 28px;
  height: 1px;
  background: rgba(255, 255, 255, 0.14);
`

const Bottom = styled.div`
  margin-top: 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
`

const Small = styled.div`
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.42);
`

