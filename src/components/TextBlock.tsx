import styled from 'styled-components'

export const Eyebrow = styled.div`
  font-size: 12px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  opacity: 0.7;
  margin-bottom: 14px;
`

export const H2 = styled.h2`
  margin: 0 0 18px;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: clamp(28px, 3.2vw, 44px);
  line-height: 1.05;
`

export const P = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 1.8;
  letter-spacing: 0.02em;
  opacity: 0.86;
  max-width: 56ch;
`

