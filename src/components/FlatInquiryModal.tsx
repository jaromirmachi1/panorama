import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import {
  getFlatHoverOverlaySrc,
  getFloorPlanAlt,
} from '../content/apartmentImages'
import type { Lang } from '../i18n/LanguageContext'
import { t } from '../i18n/dictionary'
import { submitApartmentInquiry } from '../lib/inquiryApi'

export type InquiryFlat = {
  id: string
  floor: number
  sizeM2: number
  priceKc: number
  buildingId: 'A' | 'B'
}

type Props = {
  flat: InquiryFlat
  buildingLabel: string
  lang: Lang
  onClose: () => void
}

function formatKc(value: number) {
  return `${new Intl.NumberFormat('cs-CZ').format(value)} Kč`
}

export function FlatInquiryModal({
  flat,
  buildingLabel,
  lang,
  onClose,
}: Props) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const firstFieldRef = useRef<HTMLInputElement>(null)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)

  const iq = t.apartments.inquiry

  const flatPlanSrc = useMemo(
    () => getFlatHoverOverlaySrc({ id: flat.id, floor: flat.floor }),
    [flat.floor, flat.id],
  )
  const flatPlanAlt = useMemo(
    () => `${getFloorPlanAlt(flat.floor, flat.buildingId, lang)} — ${flat.id}`,
    [flat.buildingId, flat.floor, flat.id, lang],
  )

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleEscape)
    const html = document.documentElement
    const prevHtmlOverflow = html.style.overflow
    const prevBodyOverflow = document.body.style.overflow
    html.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    const tId = window.setTimeout(() => firstFieldRef.current?.focus(), 80)
    return () => {
      document.removeEventListener('keydown', handleEscape)
      html.style.overflow = prevHtmlOverflow
      document.body.style.overflow = prevBodyOverflow
      window.clearTimeout(tId)
    }
  }, [handleEscape])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSendError(null)

    const body = {
      flat_id: flat.id,
      building: flat.buildingId,
      building_label: buildingLabel,
      floor: flat.floor,
      size_m2: flat.sizeM2,
      price_kc: flat.priceKc,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      user_email: email.trim(),
      user_phone: phone.trim(),
      note: note.trim(),
    }

    setSubmitting(true)
    try {
      const result = await submitApartmentInquiry(body)
      if (result.ok) {
        setSent(true)
      } else if (result.reason === 'not_configured') {
        setSendError(iq.sendErrorConfig[lang])
      } else {
        const base = iq.sendError[lang]
        setSendError(
          result.detail ? `${base}\n\n${result.detail}` : base,
        )
      }
    } catch (err) {
      console.error('[FlatInquiryModal] inquiry API', err)
      setSendError(iq.sendError[lang])
    } finally {
      setSubmitting(false)
    }
  }

  const node = (
    <Root role="presentation">
      <Backdrop
        type="button"
        aria-label={iq.backdropAria[lang]}
        onClick={onClose}
      />
      <Panel
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <CloseBtn
          type="button"
          data-cursor="hover"
          aria-label={iq.closeAria[lang]}
          onClick={onClose}
        >
          ×
        </CloseBtn>

        <PanelBody>
          <PanelTop>
            <PanelIntro>
              <PanelEyebrow>{iq.flatLabel[lang]}</PanelEyebrow>
              <PanelTitle id={titleId}>{iq.title[lang]}</PanelTitle>
              <FlatSummary>
                <FlatId>{flat.id}</FlatId>
                <FlatMeta>
                  {buildingLabel} · {t.apartments.floorLabel[lang]} {flat.floor}{' '}
                  · {flat.sizeM2.toFixed(1)} m² · {formatKc(flat.priceKc)}
                </FlatMeta>
              </FlatSummary>
              <PanelSubtitle>{iq.subtitle[lang]}</PanelSubtitle>
            </PanelIntro>

            <PanelFormColumn>
        {sent ? (
          <ThanksWrap>
            <Thanks>{iq.thanks[lang]}</Thanks>
            <GhostBtn type="button" data-cursor="hover" onClick={onClose}>
              {iq.close[lang]}
            </GhostBtn>
          </ThanksWrap>
        ) : (
          <Form onSubmit={handleSubmit}>
            {sendError ? (
              <FormError role="alert">
                {sendError.split('\n\n').map((chunk, i) => (
                  <FormErrorLine key={i} $muted={i > 0}>
                    {chunk}
                  </FormErrorLine>
                ))}
              </FormError>
            ) : null}
            <FieldGrid>
              <Field>
                <Label htmlFor="inquiry-first">{iq.firstName[lang]}</Label>
                <Input
                  id="inquiry-first"
                  ref={firstFieldRef}
                  name="firstName"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <Label htmlFor="inquiry-last">{iq.lastName[lang]}</Label>
                <Input
                  id="inquiry-last"
                  name="lastName"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </Field>
              <Field $wide>
                <Label htmlFor="inquiry-email">{iq.email[lang]}</Label>
                <Input
                  id="inquiry-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>
              <Field $wide>
                <Label htmlFor="inquiry-phone">{iq.phone[lang]}</Label>
                <Input
                  id="inquiry-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </Field>
              <Field $wide>
                <Label htmlFor="inquiry-note">{iq.note[lang]}</Label>
                <Textarea
                  id="inquiry-note"
                  name="note"
                  rows={4}
                  maxLength={2000}
                  autoComplete="off"
                  placeholder={iq.notePlaceholder[lang]}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </Field>
            </FieldGrid>
            <Actions>
              <SubmitBtn
                type="submit"
                data-cursor="hover"
                disabled={submitting}
              >
                {submitting ? iq.sending[lang] : iq.submit[lang]}
              </SubmitBtn>
              <GhostBtn type="button" data-cursor="hover" onClick={onClose}>
                {iq.close[lang]}
              </GhostBtn>
            </Actions>
          </Form>
        )}
            </PanelFormColumn>
          </PanelTop>

          <FlatPlanRow>
            <FlatPlanFigure>
              <FlatPlanImg
                src={flatPlanSrc}
                alt={flatPlanAlt}
                loading="eager"
                decoding="async"
              />
            </FlatPlanFigure>
          </FlatPlanRow>
        </PanelBody>
      </Panel>
    </Root>
  )

  return createPortal(node, document.body)
}

const Root = styled.div`
  position: fixed;
  inset: 0;
  z-index: 12000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(16px, 4vw, 32px);
  overflow: hidden;
  overscroll-behavior: none;
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }
`

const Backdrop = styled.button`
  position: absolute;
  inset: 0;
  border: 0;
  padding: 0;
  margin: 0;
  cursor: pointer;
  background: rgba(6, 6, 6, 0.72);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
`

const Panel = styled.div`
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  width: min(100%, 440px);
  max-height: min(92vh, 720px);
  overflow: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
  padding: clamp(48px, 5vw, 56px) clamp(22px, 4vw, 36px) clamp(26px, 4vw, 34px);
  border-radius: 2px;
  background: linear-gradient(
    165deg,
    rgba(22, 22, 22, 0.98) 0%,
    rgba(12, 12, 12, 0.99) 100%
  );
  border: 1px solid rgba(245, 243, 239, 0.1);
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.35),
    0 32px 80px rgba(0, 0, 0, 0.55);
  color: #f5f3ef;

  @media (min-width: 720px) {
    width: min(100%, 560px);
    max-height: min(94vh, 800px);
  }

  @media (min-width: 960px) {
    width: min(100%, 1180px);
    max-height: min(96vh, 920px);
    overflow-y: auto;
    overflow-x: hidden;
    padding: clamp(44px, 4vw, 52px) clamp(28px, 3vw, 44px) clamp(28px, 3vw, 36px);
  }
`

const PanelBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(20px, 2.5vw, 28px);
  min-width: 0;
`

const PanelTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(22px, 3vw, 28px);
  min-width: 0;

  @media (min-width: 960px) {
    display: grid;
    grid-template-columns: minmax(380px, 1.38fr) minmax(300px, 1fr);
    gap: clamp(32px, 4vw, 48px);
    align-items: start;
  }
`

const PanelIntro = styled.div`
  min-width: 0;
`

const FlatPlanRow = styled.div`
  width: 100%;
  min-width: 0;
`

const PanelFormColumn = styled.div`
  min-width: 0;
`

const PanelEyebrow = styled.div`
  font-size: 10px;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  color: rgba(245, 243, 239, 0.48);
  margin-bottom: 10px;
`

const PanelTitle = styled.h2`
  margin: 0 0 14px;
  font-family: ${({ theme }) => theme.fonts.serif};
  font-weight: 500;
  font-size: clamp(26px, 3.2vw, 32px);
  letter-spacing: -0.02em;
  line-height: 1.08;
  color: rgba(245, 243, 239, 0.98);
`

const FlatSummary = styled.div`
  margin-bottom: 12px;
`

const FlatId = styled.div`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 15px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(232, 215, 176, 0.92);
  margin-bottom: 4px;
`

const FlatMeta = styled.div`
  font-size: 12px;
  letter-spacing: 0.06em;
  line-height: 1.45;
  color: rgba(245, 243, 239, 0.58);
`

const PanelSubtitle = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.65;
  font-weight: 300;
  letter-spacing: 0.03em;
  color: rgba(245, 243, 239, 0.62);
  max-width: 36ch;

  @media (min-width: 960px) {
    max-width: none;
  }
`

const FlatPlanFigure = styled.div`
  margin: 0;
  padding: 0;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
  max-height: min(220px, 32vh);

  @media (min-width: 960px) {
    max-height: min(320px, 38vh);
    min-height: 120px;
  }
`

const FlatPlanImg = styled.img`
  display: block;
  max-width: 100%;
  max-height: min(200px, 30vh);
  width: auto;
  height: auto;
  object-fit: contain;
  object-position: center;

  @media (min-width: 960px) {
    max-height: min(300px, 36vh);
  }
`

const CloseBtn = styled.button`
  position: absolute;
  top: clamp(14px, 2.5vw, 22px);
  right: clamp(14px, 2.5vw, 22px);
  z-index: 2;
  appearance: none;
  border: none;
  background: transparent;
  color: rgba(245, 243, 239, 0.55);
  font-size: 28px;
  line-height: 1;
  width: 40px;
  height: 40px;
  margin: 0;
  padding: 0;
  cursor: pointer;
  border-radius: 2px;
  transition: color 0.35s ease, transform 0.35s ease;

  &:hover {
    color: rgba(245, 243, 239, 0.95);
    transform: scale(1.06);
  }
`

const Form = styled.form`
  display: grid;
  gap: clamp(16px, 2vw, 20px);

  @media (min-width: 960px) {
    gap: 16px;
  }
`

const FormError = styled.div`
  margin: 0;
  padding: 12px 14px;
  font-size: 12px;
  line-height: 1.45;
  letter-spacing: 0.03em;
  color: rgba(255, 220, 200, 0.95);
  background: rgba(180, 60, 50, 0.35);
  border: 1px solid rgba(255, 160, 140, 0.35);
  border-radius: 2px;
`

const FormErrorLine = styled.p<{ $muted?: boolean }>`
  margin: 0;
  font-size: ${({ $muted }) => ($muted ? '11px' : '12px')};
  line-height: 1.5;
  letter-spacing: ${({ $muted }) => ($muted ? '0.02em' : '0.03em')};
  color: ${({ $muted }) =>
    $muted ? 'rgba(255, 230, 220, 0.88)' : 'inherit'};
  opacity: ${({ $muted }) => ($muted ? 0.95 : 1)};
  white-space: pre-wrap;
  word-break: break-word;

  & + & {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid rgba(255, 160, 140, 0.22);
  }
`

const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 14px;

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }

  @media (min-width: 960px) {
    gap: 14px 16px;
  }
`

const Field = styled.div<{ $wide?: boolean }>`
  display: grid;
  gap: 8px;
  grid-column: ${({ $wide }) => ($wide ? '1 / -1' : 'auto')};
`

const Label = styled.label`
  font-size: 10px;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: rgba(245, 243, 239, 0.45);
`

const Input = styled.input`
  appearance: none;
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.02em;
  color: rgba(245, 243, 239, 0.95);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(245, 243, 239, 0.12);
  border-radius: 2px;
  outline: none;
  transition:
    border-color 0.35s ease,
    background 0.35s ease,
    box-shadow 0.35s ease;

  &::placeholder {
    color: rgba(245, 243, 239, 0.28);
  }

  &:hover {
    border-color: rgba(245, 243, 239, 0.2);
    background: rgba(255, 255, 255, 0.055);
  }

  &:focus-visible {
    border-color: rgba(232, 215, 176, 0.55);
    box-shadow: 0 0 0 1px rgba(232, 215, 176, 0.2);
  }
`

const Textarea = styled.textarea`
  appearance: none;
  width: 100%;
  box-sizing: border-box;
  min-height: 96px;
  padding: 12px 14px;

  @media (min-width: 960px) {
    min-height: 72px;
  }
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.02em;
  line-height: 1.5;
  color: rgba(245, 243, 239, 0.95);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(245, 243, 239, 0.12);
  border-radius: 2px;
  outline: none;
  resize: vertical;
  transition:
    border-color 0.35s ease,
    background 0.35s ease,
    box-shadow 0.35s ease;

  &::placeholder {
    color: rgba(245, 243, 239, 0.28);
  }

  &:hover {
    border-color: rgba(245, 243, 239, 0.2);
    background: rgba(255, 255, 255, 0.055);
  }

  &:focus-visible {
    border-color: rgba(232, 215, 176, 0.55);
    box-shadow: 0 0 0 1px rgba(232, 215, 176, 0.2);
  }
`

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-top: 4px;
`

const SubmitBtn = styled.button`
  appearance: none;
  border: none;
  cursor: pointer;
  padding: 14px 22px;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(12, 12, 12, 0.95);
  background: rgba(232, 215, 176, 0.92);
  border-radius: 2px;
  transition:
    transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    background 0.35s ease,
    opacity 0.35s ease;

  &:hover {
    background: rgba(240, 225, 190, 0.98);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    cursor: wait;
    opacity: 0.72;
    transform: none;
  }
`

const GhostBtn = styled.button`
  appearance: none;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 14px 8px;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(245, 243, 239, 0.5);
  transition: color 0.35s ease;

  &:hover {
    color: rgba(245, 243, 239, 0.88);
  }
`

const ThanksWrap = styled.div`
  display: grid;
  gap: 20px;
  padding: 8px 0 4px;
`

const Thanks = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 20px;
  font-weight: 400;
  line-height: 1.45;
  letter-spacing: 0.02em;
  color: rgba(245, 243, 239, 0.9);
`
