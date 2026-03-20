import styled from 'styled-components'

type ImageBlockProps = {
  src: string
  alt: string
  sizes?: string
}

export function ImageBlock({ src, alt, sizes }: ImageBlockProps) {
  return (
    <Frame>
      <Img src={src} alt={alt} loading="lazy" decoding="async" sizes={sizes} />
      <Sheen aria-hidden="true" />
    </Frame>
  )
}

const Frame = styled.figure`
  margin: 0;
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.06);
`

const Img = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.02);
  will-change: transform;
`

const Sheen = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
  background: radial-gradient(80% 120% at 20% 0%, rgba(255, 255, 255, 0.18), transparent 55%);
  opacity: 0.55;
`

