import { useLayoutEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import { gsap, stOnce } from "../../lib/gsap";
import { Container, Section } from "../Section";
import { Eyebrow, H2, P } from "../TextBlock";

import { useLang } from "../../i18n/LanguageContext";
import { t } from "../../i18n/dictionary";

const REALTORS = [
  {
    name: "Hana Saidova",
    phoneDisplay: "723 232 491",
    phoneTel: "+420723232491",
    email: "info@lvlreality.cz",
    photoSrc: "/realitak1.webp" as string | null,
    initials: "HS",
  },
  {
    name: "Ing. David Said",
    phoneDisplay: "722 033 055",
    phoneTel: "+420722033055",
    email: "info@lvlreality.cz",
    photoSrc: "/davidsaid.webp" as string | null,
    initials: "DS",
  },
] as const;

export function Features() {
  const rootRef = useRef<HTMLElement | null>(null);
  const { lang } = useLang();
  const address = "Kroftova 2191/80, 679 04 Brno";
  const mapSrc = useMemo(
    () =>
      `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`,
    [],
  );

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const root = rootRef.current;
      if (!root) return;

      const cards = gsap.utils.toArray<HTMLElement>("[data-realtor-card]", root);
      gsap.fromTo(
        cards,
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: "power3.out",
          stagger: 0.14,
          force3D: true,
          scrollTrigger: stOnce(root, "top 75%"),
        },
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const tf = t.features;

  return (
    <Section
      ref={rootRef}
      tone="light"
      aria-label={tf.eyebrow[lang]}
      id="features"
      style={{ background: "#ffffff" }}
    >
      <Container>
        <Head>
          <Eyebrow>{tf.eyebrow[lang]}</Eyebrow>
          <H2>{tf.title[lang]}</H2>
          <Lead>{tf.lead[lang]}</Lead>
        </Head>

        <Main>
          <MapWrap>
            <MapFrame
              title={tf.mapLabel[lang]}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={mapSrc}
            />
            <MapMeta>
              <MapLabel>{tf.mapLabel[lang]}</MapLabel>
              <MapAddress>{tf.mapAddress[lang]}</MapAddress>
            </MapMeta>
          </MapWrap>

          <RealtorsColumn>
            {REALTORS.map((agent) => (
              <RealtorCard key={agent.name} data-realtor-card>
                <PhotoWrap>
                  {agent.photoSrc ? (
                    <PhotoImg
                      src={agent.photoSrc}
                      alt={agent.name}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <PhotoPlaceholder aria-hidden="true">
                      {agent.initials}
                    </PhotoPlaceholder>
                  )}
                </PhotoWrap>
                <InfoCol>
                  <RealtorName>{agent.name}</RealtorName>
                  <ContactBlock>
                    <ContactRow>
                      <ContactLabel>{tf.realtorMobile[lang]}</ContactLabel>
                      <ContactValue
                        href={`tel:${agent.phoneTel}`}
                        data-cursor="hover"
                      >
                        {agent.phoneDisplay}
                      </ContactValue>
                    </ContactRow>
                    <ContactRow>
                      <ContactLabel>{tf.realtorEmail[lang]}</ContactLabel>
                      <ContactValue
                        href={`mailto:${agent.email}`}
                        data-cursor="hover"
                      >
                        {agent.email}
                      </ContactValue>
                    </ContactRow>
                  </ContactBlock>
                </InfoCol>
              </RealtorCard>
            ))}
          </RealtorsColumn>
        </Main>
      </Container>
    </Section>
  );
}

const Head = styled.div`
  color: rgba(10, 10, 10, 0.9);
  margin-bottom: clamp(24px, 4vw, 46px);
`;

const Lead = styled(P)`
  max-width: 68ch;
`;

const Main = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  gap: clamp(18px, 4vw, 42px);
  align-items: start;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

const RealtorsColumn = styled.div`
  display: grid;
  gap: clamp(20px, 3vw, 28px);
  padding-left: clamp(18px, 3vw, 28px);
  border-left: 1px solid rgba(10, 10, 10, 0.1);
  min-width: 0;

  @media (max-width: 1000px) {
    padding-left: 0;
    border-left: none;
    padding-top: clamp(20px, 4vw, 28px);
    border-top: 1px solid rgba(10, 10, 10, 0.08);
  }
`;

const RealtorCard = styled.article`
  display: grid;
  grid-template-columns: clamp(100px, 22vw, 132px) minmax(0, 1fr);
  gap: clamp(16px, 3vw, 22px);
  align-items: start;
  padding-bottom: clamp(18px, 3vw, 24px);
  border-bottom: 1px solid rgba(10, 10, 10, 0.08);

  &:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }

  @media (max-width: 480px) {
    grid-template-columns: 88px minmax(0, 1fr);
    gap: 14px;
  }
`;

const PhotoWrap = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: 2px;
  overflow: hidden;
  background: rgba(10, 10, 10, 0.04);
  border: 1px solid rgba(10, 10, 10, 0.08);
`;

const PhotoImg = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: translate3d(0, 0, 0);
`;

const PhotoPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  font-family: ${({ theme }) => theme.fonts.serif};
  font-weight: 500;
  font-size: clamp(22px, 4.5vw, 30px);
  letter-spacing: 0.06em;
  color: rgba(10, 10, 10, 0.42);
  background: linear-gradient(
    145deg,
    rgba(232, 215, 176, 0.35) 0%,
    rgba(10, 10, 10, 0.06) 100%
  );
`;

const InfoCol = styled.div`
  display: grid;
  gap: 12px;
  min-width: 0;
  padding-top: 2px;
`;

const RealtorName = styled.h3`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.serif};
  font-weight: 500;
  letter-spacing: -0.02em;
  font-size: clamp(20px, 2.2vw, 26px);
  line-height: 1.15;
  color: rgba(10, 10, 10, 0.94);
`;

const ContactBlock = styled.div`
  display: grid;
  gap: 10px;
`;

const ContactRow = styled.div`
  display: grid;
  gap: 4px;
`;

const ContactLabel = styled.div`
  font-size: 10px;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: rgba(10, 10, 10, 0.45);
`;

const ContactValue = styled.a`
  font-size: 14px;
  letter-spacing: 0.02em;
  color: rgba(10, 10, 10, 0.88);
  text-decoration: none;
  width: fit-content;
  border-bottom: 1px solid transparent;
  transition:
    color 0.35s ease,
    border-color 0.35s ease;

  &:hover {
    color: rgba(165, 135, 70, 0.95);
    border-bottom-color: rgba(165, 135, 70, 0.45);
  }
`;

const MapWrap = styled.div`
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(10, 10, 10, 0.12);
  padding: 0;
`;

const MapFrame = styled.iframe`
  width: 100%;
  height: 340px;
  border: 0;
  display: block;
`;

const MapMeta = styled.div`
  padding: 16px 18px 18px;
  display: grid;
  gap: 8px;
  border-top: 1px solid rgba(10, 10, 10, 0.12);
`;

const MapLabel = styled.div`
  font-size: 12px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(165, 135, 70, 0.92);
`;

const MapAddress = styled.div`
  font-size: 13px;
  opacity: 0.86;
  line-height: 1.4;
  color: rgba(10, 10, 10, 0.86);
`;
