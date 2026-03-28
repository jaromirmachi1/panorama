import { useLayoutEffect, useRef } from "react";
import styled from "styled-components";
import { gsap } from "../../lib/gsap";
import { images } from "../../content/images";
import { useLang } from "../../i18n/LanguageContext";
import { t } from "../../i18n/dictionary";
import { Eyebrow } from "../TextBlock";
import { ImageBlock } from "../ImageBlock";

export function ProjectIntro() {
  const rootRef = useRef<HTMLElement | null>(null);
  const { lang } = useLang();
  const arch = t.aboutArch;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const root = rootRef.current;
      if (!root) return;
      const q = gsap.utils.selector(root);

      gsap.set(q("[data-pi]"), { opacity: 0, y: 16 });
      gsap.set(q("[data-pi-img]"), { opacity: 0, y: 14, scale: 1.01 });

      gsap.to(q("[data-pi]"), {
        opacity: 1,
        y: 0,
        duration: 1.05,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: root,
          start: "top 78%",
          once: true,
        },
      });

      gsap.to(q("[data-pi-img]"), {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.15,
        ease: "expo.out",
        scrollTrigger: {
          trigger: root,
          start: "top 75%",
          once: true,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <Wrap
      ref={rootRef}
      id="agency"
      aria-label={t.projectIntro.title[lang]}
    >
      <Ornament aria-hidden="true" />
      <Top>
        <ProjectStack>
          <Title data-pi>{t.projectIntro.title[lang]}</Title>
          <TextCol>
            <Body data-pi>{t.projectIntro.body1[lang]}</Body>
            <Body data-pi>{t.projectIntro.body2[lang]}</Body>
          </TextCol>
        </ProjectStack>

        <ArchitectAside data-pi>
          <ArchHead>
            <Eyebrow>{arch.eyebrow[lang]}</Eyebrow>
            <ArchitectTitle>
              <TitleName>{arch.title[lang]}</TitleName>
              <TitleStudio>
                <StudioName>{arch.studio[lang]}</StudioName>
                <StudioSep aria-hidden="true">·</StudioSep>
                <StudioRole>{arch.studioRole[lang]}</StudioRole>
              </TitleStudio>
            </ArchitectTitle>
          </ArchHead>
          <ArchitectIntro>{arch.intro[lang]}</ArchitectIntro>
          <ArchitectVisual>
            <ImageBlock
              src={images.architect.src}
              alt={images.architect.alt[lang]}
              sizes="(max-width: 900px) 200px, 220px"
            />
          </ArchitectVisual>
        </ArchitectAside>
      </Top>

      <ImageFrame data-pi-img>
        <Image
          src={images.hero.src}
          alt="Vizualizace projektu Panorama Žabiny"
          loading="lazy"
          decoding="async"
        />
      </ImageFrame>

      <Bottom data-pi>
        <Plus aria-hidden="true">+</Plus>
        <Meta>
          {t.projectIntro.meta[lang]}
          <br />
          <Small>{t.projectIntro.small[lang]}</Small>
        </Meta>
      </Bottom>
    </Wrap>
  );
}

const Wrap = styled.section`
  position: relative;
  background: ${({ theme }) => theme.colors.paper};
  color: rgba(10, 10, 10, 0.9);
  padding: clamp(70px, 9vw, 120px) clamp(18px, 4vw, 38px)
    clamp(80px, 10vw, 140px);
  overflow: hidden;
`;

const Ornament = styled.div`
  position: absolute;
  inset: -30%;
  pointer-events: none;
  opacity: 0.55;
  background:
    radial-gradient(
      circle at 70% 30%,
      transparent 58%,
      rgba(10, 10, 10, 0.08) 59%,
      transparent 60%
    ),
    radial-gradient(
      circle at 78% 44%,
      transparent 66%,
      rgba(10, 10, 10, 0.06) 67%,
      transparent 68%
    ),
    radial-gradient(
      circle at 62% 56%,
      transparent 72%,
      rgba(10, 10, 10, 0.05) 73%,
      transparent 74%
    );
`;

const Top = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 380px);
  gap: clamp(20px, 3.5vw, 40px);
  align-items: start;
  max-width: 1320px;
  margin: 0 auto;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: clamp(28px, 5vw, 40px);
  }
`;

const ProjectStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(10px, 2vw, 18px);
  min-width: 0;
`;

const Title = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.serif};
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 0.95;
  font-size: clamp(46px, 6.6vw, 104px);
`;

const TextCol = styled.div`
  max-width: 62ch;
  padding-top: clamp(4px, 1vw, 10px);

  @media (min-width: 901px) {
    margin-left: clamp(28px, 6vw, 88px);
  }
`;

const Body = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 1.85;
  letter-spacing: 0.01em;
  color: rgba(10, 10, 10, 0.78);

  & + & {
    margin-top: 18px;
  }
`;

const ArchitectAside = styled.aside`
  padding-top: clamp(6px, 1vw, 12px);
  padding-left: clamp(20px, 3vw, 32px);
  border-left: 1px solid rgba(10, 10, 10, 0.1);
  display: flex;
  flex-direction: column;
  gap: clamp(12px, 2vw, 16px);
  min-width: 0;

  @media (max-width: 900px) {
    padding-left: 0;
    padding-top: clamp(20px, 3vw, 28px);
    border-left: none;
    border-top: 1px solid rgba(10, 10, 10, 0.1);
    align-items: center;
    text-align: center;
  }
`;

const ArchHead = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(8px, 1.5vw, 14px);

  @media (max-width: 900px) {
    order: 3;
    margin-top: clamp(6px, 2vw, 14px);
  }
`;

const ArchitectTitle = styled.div`
  margin: 0;
`;

const TitleName = styled.h3`
  margin: 0 0 8px;
  font-family: ${({ theme }) => theme.fonts.serif};
  font-weight: 500;
  letter-spacing: -0.02em;
  font-size: clamp(22px, 2.4vw, 30px);
  line-height: 1.08;
  color: rgba(10, 10, 10, 0.94);
`;

const TitleStudio = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 6px 8px;
  font-size: 10px;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: rgba(10, 10, 10, 0.52);

  @media (max-width: 900px) {
    justify-content: center;
  }
`;

const StudioName = styled.span`
  font-family: ${({ theme }) => theme.fonts.heading};
  letter-spacing: 0.2em;
  color: rgba(10, 10, 10, 0.68);
`;

const StudioSep = styled.span`
  opacity: 0.45;
  letter-spacing: 0;
`;

const StudioRole = styled.span`
  font-weight: 500;
`;

const ArchitectIntro = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.72;
  letter-spacing: 0.02em;
  color: rgba(10, 10, 10, 0.72);

  @media (max-width: 900px) {
    order: 2;
    max-width: 52ch;
    text-align: left;
  }
`;

const ArchitectVisual = styled.div`
  flex-shrink: 0;
  width: 100%;
  max-width: 220px;
  height: clamp(130px, 16vw, 190px);
  margin-top: 6px;

  & > figure {
    height: 100%;
  }

  @media (max-width: 900px) {
    order: 1;
    margin-top: 0;
    max-width: 200px;
    height: clamp(125px, 32vw, 190px);
  }
`;

const ImageFrame = styled.figure`
  margin: clamp(28px, 5vw, 54px) auto 0;
  width: min(860px, 100%);
  border-radius: 18px;
  overflow: hidden;
  background: rgba(10, 10, 10, 0.06);
  box-shadow: rgba(0, 0, 0, 0.18) 0 30px 60px -40px;
`;

const Image = styled.img`
  display: block;
  width: 100%;
  height: auto;
  transform: scale(1.01);
  will-change: transform;
`;

const Bottom = styled.div`
  max-width: 1320px;
  margin: clamp(28px, 5vw, 48px) auto 0;
  display: grid;
  grid-template-columns: 36px 1fr;
  gap: 16px;
  align-items: end;
  padding-top: 22px;
`;

const Plus = styled.div`
  font-size: 18px;
  line-height: 1;
  opacity: 0.75;
`;

const Meta = styled.div`
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(10, 10, 10, 0.6);
`;

const Small = styled.span`
  display: inline-block;
  margin-top: 10px;
  opacity: 0.8;
  letter-spacing: 0.22em;
`;
