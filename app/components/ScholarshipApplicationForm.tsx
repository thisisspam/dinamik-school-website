"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleAlert } from "lucide-react";
import { FormEvent, useState } from "react";
import { createScholarshipApplicationAction } from "@/lib/actions/scholarship-applications";
import { PRIVACY_NOTICE_VERSION } from "@/lib/privacy";
import { SCHOLARSHIP_EXAM_SESSIONS, SCHOLARSHIP_TRANSPORT_OPTIONS } from "@/lib/scholarship-applications";

type FieldName = "studentName" | "guardianPhone" | "currentSchool" | "examSession" | "transportPreference" | "privacyNoticeAcknowledged";
type FieldErrors = Partial<Record<FieldName, string>>;

function campaignSource(): string {
  if (typeof window === "undefined") return "/bursluluk-sinavi";
  const allowedParameters = ["utm_source", "utm_medium", "utm_campaign", "utm_content"];
  const current = new URL(window.location.href);
  const selected = new URLSearchParams();
  for (const name of allowedParameters) {
    const value = current.searchParams.get(name)?.trim();
    if (value) selected.set(name, value.slice(0, 80));
  }
  const query = selected.toString();
  return `${current.pathname}${query ? `?${query}` : ""}`;
}

export function ScholarshipApplicationForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error" | "warning">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function clearFieldError(name: FieldName) {
    setFieldErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const studentName = form.elements.namedItem("studentName") as HTMLInputElement;
    const guardianPhone = form.elements.namedItem("guardianPhone") as HTMLInputElement;
    const currentSchool = form.elements.namedItem("currentSchool") as HTMLInputElement;
    const examSession = form.elements.namedItem("examSession") as HTMLSelectElement;
    const transportPreference = form.querySelector<HTMLInputElement>('input[name="transportPreference"]:checked');
    const privacyNotice = form.elements.namedItem("privacyNoticeAcknowledged") as HTMLInputElement;
    const nextErrors: FieldErrors = {};

    if (studentName.value.trim().length < 2) nextErrors.studentName = "Öğrencinin adını ve soyadını yazın.";
    if (!guardianPhone.validity.valid || !guardianPhone.value.trim()) nextErrors.guardianPhone = "Geçerli bir veli cep telefonu girin.";
    if (currentSchool.value.trim().length < 2) nextErrors.currentSchool = "Öğrencinin mevcut okulunu yazın.";
    if (!examSession.value) nextErrors.examSession = "Katılacağınız oturumu seçin.";
    if (!transportPreference) nextErrors.transportPreference = "Servis tercihinizi seçin.";
    if (!privacyNotice.checked) nextErrors.privacyNoticeAcknowledged = "KVKK aydınlatma metnini okuduğunuzu onaylayın.";

    setFieldErrors(nextErrors);
    const firstInvalid = (["studentName", "guardianPhone", "currentSchool", "examSession", "transportPreference", "privacyNoticeAcknowledged"] as FieldName[])
      .find((name) => nextErrors[name]);
    if (firstInvalid) {
      setStatus("error");
      setStatusMessage("Lütfen işaretli alanları kontrol edin.");
      (form.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus();
      return;
    }

    const formData = new FormData(form);
    if (String(formData.get("website") ?? "").trim()) return;
    formData.set("source", campaignSource());
    setStatus("submitting");
    setStatusMessage("");

    const result = await createScholarshipApplicationAction(formData);
    if (!result.success) {
      setStatus(result.persisted ? "warning" : "error");
      setStatusMessage(result.message);
      return;
    }

    form.reset();
    setFieldErrors({});
    setStatus("success");
    setStatusMessage(result.message);
  }

  return (
    <form className={`scholarship-form${compact ? " scholarship-form--compact" : ""}`} onSubmit={handleSubmit} noValidate>
      <div className="scholarship-form-heading">
        <span>2026–2027 Akademik Yılı</span>
        <h2>Bursluluk sınavı başvurusu</h2>
        <p>Bilgilerinizi eksiksiz doldurun, katılacağınız oturumu seçin.</p>
      </div>

      <div className="scholarship-form-fields">
        <label>
          <span>Öğrenci adı soyadı</span>
          <input name="studentName" autoComplete="name" maxLength={80} required aria-invalid={Boolean(fieldErrors.studentName)} aria-describedby={fieldErrors.studentName ? "scholarship-student-error" : undefined} onChange={() => clearFieldError("studentName")} />
          {fieldErrors.studentName ? <small className="form-field-error" id="scholarship-student-error">{fieldErrors.studentName}</small> : null}
        </label>

        <label>
          <span>Veli cep telefonu</span>
          <input name="guardianPhone" type="tel" inputMode="tel" autoComplete="tel" minLength={10} maxLength={20} pattern="[0-9+() -]{10,20}" placeholder="05xx xxx xx xx" required aria-invalid={Boolean(fieldErrors.guardianPhone)} aria-describedby={fieldErrors.guardianPhone ? "scholarship-phone-error" : undefined} onChange={() => clearFieldError("guardianPhone")} />
          {fieldErrors.guardianPhone ? <small className="form-field-error" id="scholarship-phone-error">{fieldErrors.guardianPhone}</small> : null}
        </label>

        <label>
          <span>Öğrencinin mevcut okulu</span>
          <input name="currentSchool" autoComplete="organization" maxLength={120} required aria-invalid={Boolean(fieldErrors.currentSchool)} aria-describedby={fieldErrors.currentSchool ? "scholarship-school-error" : undefined} onChange={() => clearFieldError("currentSchool")} />
          {fieldErrors.currentSchool ? <small className="form-field-error" id="scholarship-school-error">{fieldErrors.currentSchool}</small> : null}
        </label>

        <label>
          <span>Oturum seçeneği</span>
          <select name="examSession" defaultValue="" required aria-invalid={Boolean(fieldErrors.examSession)} aria-describedby={fieldErrors.examSession ? "scholarship-session-error" : undefined} onChange={() => clearFieldError("examSession")}>
            <option value="" disabled>Oturum seçiniz</option>
            {SCHOLARSHIP_EXAM_SESSIONS.map((session) => <option value={session.value} key={session.value}>{session.label}</option>)}
          </select>
          {fieldErrors.examSession ? <small className="form-field-error" id="scholarship-session-error">{fieldErrors.examSession}</small> : null}
        </label>

        <fieldset className="scholarship-transport" aria-invalid={Boolean(fieldErrors.transportPreference)} aria-describedby={fieldErrors.transportPreference ? "scholarship-transport-error" : "scholarship-transport-note"} onChange={() => clearFieldError("transportPreference")}>
          <legend>Servis seçeneği</legend>
          <div className="scholarship-radio-grid">
            {SCHOLARSHIP_TRANSPORT_OPTIONS.map((option) => (
              <label key={option.value}>
                <input name="transportPreference" type="radio" value={option.value} required />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
          <p id="scholarship-transport-note">Servis kullanacaksanız mevcut okulunuzun bahçesinden kalkacak servislerle sınavımıza ücretsiz katılabilirsiniz.</p>
          {fieldErrors.transportPreference ? <small className="form-field-error" id="scholarship-transport-error">{fieldErrors.transportPreference}</small> : null}
        </fieldset>
      </div>

      <div className="honeypot" aria-hidden="true">
        <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      </div>
      <input name="privacyNoticeVersion" type="hidden" value={PRIVACY_NOTICE_VERSION} />

      <label className="scholarship-consent">
        <input name="privacyNoticeAcknowledged" type="checkbox" required aria-invalid={Boolean(fieldErrors.privacyNoticeAcknowledged)} aria-describedby={fieldErrors.privacyNoticeAcknowledged ? "scholarship-privacy-error" : undefined} onChange={() => clearFieldError("privacyNoticeAcknowledged")} />
        <span><Link href="/kvkk#aydinlatma" target="_blank">KVKK Aydınlatma Metni</Link>&apos;ni okudum; başvuru bilgilerimin sınav organizasyonu ve iletişim amacıyla işlenmesi hakkında bilgilendirildim.</span>
        {fieldErrors.privacyNoticeAcknowledged ? <small className="form-field-error" id="scholarship-privacy-error">{fieldErrors.privacyNoticeAcknowledged}</small> : null}
      </label>

      <button className="scholarship-submit" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Başvuru gönderiliyor…" : "Başvuruyu tamamla"}
        <ArrowRight size={18} aria-hidden="true" />
      </button>

      <div className={`scholarship-status scholarship-status--${status}`} aria-live="polite">
        {status === "success" ? <CheckCircle2 size={18} aria-hidden="true" /> : null}
        {status === "error" || status === "warning" ? <CircleAlert size={18} aria-hidden="true" /> : null}
        {statusMessage ? <span>{statusMessage}</span> : null}
      </div>
    </form>
  );
}
