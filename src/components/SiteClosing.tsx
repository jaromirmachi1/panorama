import styled from "styled-components";

/** Single canvas for contact CTA + footer: continuous #000 and shared highlight. */
export const SiteClosing = styled.div`
  position: relative;
  background: #000000;
  color: rgba(255, 255, 255, 0.9);
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background: radial-gradient(
      120% 80% at 50% 0%,
      rgba(255, 255, 255, 0.06),
      transparent 55%
    );
  }

  & > * {
    position: relative;
    z-index: 1;
  }
`;
