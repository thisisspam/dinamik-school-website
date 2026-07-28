"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { createRegistrationApplicationAction } from "@/lib/actions/registration-applications";
import { PRIVACY_NOTICE_VERSION } from "@/lib/privacy";
import { createWhatsappHref } from "@/lib/whatsapp";
import { parseContentList } from "@/lib/cms/helpers";

type RegistrationFieldName =
  | "studentName"
  | "parentName"
  | "grade"
  | "phone"
  | "privacyNoticeAcknowledged";

type RegistrationFieldErrors = Partial<Record<RegistrationFieldName, string>>;

export function RegistrationForm({
  whatsappNumber,
  content,
}: {
  whatsappNumber: string;
  content: Record<string, string>;
}) {
  const pathname = usePathname();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<RegistrationFieldErrors>({});
  const departmentOptions = parseContentList(content.departmentOptions);

  function clearFieldError(fieldName: RegistrationFieldName) {
    setFieldErrors((current) => {
      if (!current[fieldName]) return current;
      const next = { ...current };
      delete next[fieldName];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const studentNameInput = form.elements.namedItem("studentName") as HTMLInputElement;
    const parentNameInput = form.elements.namedItem("parentName") as HTMLInputElement;
    const gradeSelect = form.elements.namedItem("grade") as HTMLSelectElement;
    const phoneInput = form.elements.namedItem("phone") as HTMLInputElement;
    const privacyCheckbox = form.elements.namedItem("privacyNoticeAcknowledged") as HTMLInputElement;
    const nextFieldErrors: RegistrationFieldErrors = {};

    if (!studentNameInput.value.trim()) {
      nextFieldErrors.studentName = "Öğrencinin adını ve soyadını yazın.";
    }
    if (!parentNameInput.value.trim()) {
      nextFieldErrors.parentName = "Velinin adını ve soyadını yazın.";
    }
    if (!gradeSelect.value) {
      nextFieldErrors.grade = "Öğrencinin mevcut sınıfını seçin.";
    }
    if (!phoneInput.value.trim()) {
      nextFieldErrors.phone = "İletişim kurulabilecek telefon numarasını yazın.";
    } else if (!phoneInput.validity.valid) {
      nextFieldErrors.phone = "Telefon numarası 10–20 karakter olmalı; yalnızca rakam, boşluk, +, ( ve ) kullanın.";
    }
    if (!privacyCheckbox.checked) {
      nextFieldErrors.privacyNoticeAcknowledged = "Başvuru göndermeden önce KVKK aydınlatma metnini okuduğunuzu onaylayın.";
    }

    setFieldErrors(nextFieldErrors);
    const firstInvalidField = (
      ["studentName", "parentName", "grade", "phone", "privacyNoticeAcknowledged"] as RegistrationFieldName[]
    ).find((fieldName) => nextFieldErrors[fieldName]);
    if (firstInvalidField) {
      setStatus("error");
      setStatusMessage("Formda düzeltilmesi gereken alanlar var. İlk hatalı alana yönlendirildiniz.");
      (form.elements.namedItem(firstInvalidField) as HTMLElement | null)?.focus();
      return;
    }

    const data = new FormData(form);
    if (String(data.get("website") ?? "").trim()) return;
    data.set("source", pathname);

    const studentName = String(data.get("studentName") ?? "").trim();
    const parentName = String(data.get("parentName") ?? "").trim();
    const grade = String(data.get("grade") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const department = String(data.get("department") ?? "Kararsızım").trim();

    const message = [
      "Merhaba, Dinamik Okulları hakkında ön kayıt bilgisi almak istiyorum.",
      `Öğrenci: ${studentName}`,
      `Veli: ${parentName}`,
      `Sınıf: ${grade}`,
      `İlgilenilen alan: ${department}`,
      `Telefon: ${phone}`,
    ].join("\n");

    const whatsappConsent = data.get("whatsappConsent") === "on";
    const whatsappUrl = createWhatsappHref(whatsappNumber, message);
    const whatsappWindow = whatsappConsent ? window.open("about:blank", "_blank") : null;
    if (whatsappWindow) whatsappWindow.opener = null;

    setStatus("submitting");
    setStatusMessage("");
    const result = await createRegistrationApplicationAction(data);
    if (!result.success) {
      whatsappWindow?.close();
      setStatus("error");
      setStatusMessage(result.message);
      return;
    }

    if (whatsappWindow) whatsappWindow.location.href = whatsappUrl;
    form.reset();
    setFieldErrors({});
    setStatus("success");
    setStatusMessage(whatsappConsent
      ? (whatsappWindow
        ? "Başvurunuz kaydedildi. WhatsApp mesajını kontrol edip gönderebilirsiniz."
        : "Başvurunuz kaydedildi. WhatsApp açılamadı; okul ekibi sizinle iletişime geçecek.")
      : "Başvurunuz güvenle kaydedildi. Okul ekibi verdiğiniz telefon üzerinden sizinle iletişime geçecek.");
  }

  return (
    <form className="registration-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row form-row--two">
        <label>
          <span>{content.studentLabel}</span>
          <input
            name="studentName"
            autoComplete="name"
            required
            maxLength={80}
            aria-invalid={Boolean(fieldErrors.studentName)}
            aria-describedby={fieldErrors.studentName ? "student-name-error" : undefined}
            onChange={() => clearFieldError("studentName")}
          />
          {fieldErrors.studentName ? <small id="student-name-error" className="form-field-error">{fieldErrors.studentName}</small> : null}
        </label>
        <label>
          <span>{content.parentLabel}</span>
          <input
            name="parentName"
            autoComplete="name"
            required
            maxLength={80}
            aria-invalid={Boolean(fieldErrors.parentName)}
            aria-describedby={fieldErrors.parentName ? "parent-name-error" : undefined}
            onChange={() => clearFieldError("parentName")}
          />
          {fieldErrors.parentName ? <small id="parent-name-error" className="form-field-error">{fieldErrors.parentName}</small> : null}
        </label>
      </div>

      <div className="form-row form-row--two">
        <label>
          <span>{content.gradeLabel}</span>
          <select
            name="grade"
            required
            defaultValue=""
            aria-invalid={Boolean(fieldErrors.grade)}
            aria-describedby={fieldErrors.grade ? "grade-error" : undefined}
            onChange={() => clearFieldError("grade")}
          >
            <option value="" disabled>Seçiniz</option>
            <option>8. Sınıf</option>
            <option>9. Sınıf</option>
            <option>10. Sınıf</option>
            <option>11. Sınıf</option>
          </select>
          {fieldErrors.grade ? <small id="grade-error" className="form-field-error">{fieldErrors.grade}</small> : null}
        </label>
        <label>
          <span>{content.phoneLabel}</span>
          <input
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            minLength={10}
            maxLength={20}
            pattern="[0-9+() -]{10,20}"
            placeholder="05xx xxx xx xx"
            aria-invalid={Boolean(fieldErrors.phone)}
            aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
            onChange={() => clearFieldError("phone")}
          />
          {fieldErrors.phone ? <small id="phone-error" className="form-field-error">{fieldErrors.phone}</small> : null}
        </label>
      </div>

      <label>
        <span>{content.departmentLabel}</span>
        <select name="department" defaultValue={departmentOptions[0] ?? "Kararsızım"}>
          {departmentOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </label>

      <div className="honeypot" aria-hidden="true">
        <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      </div>

      <input name="privacyNoticeVersion" type="hidden" value={PRIVACY_NOTICE_VERSION} />

      <div className="privacy-consent-panel">
        <strong>{content.privacyTitle}</strong>
        <p>{content.privacyDescription}</p>
      </div>

      <label className="consent-field">
        <input
          name="privacyNoticeAcknowledged"
          type="checkbox"
          required
          aria-invalid={Boolean(fieldErrors.privacyNoticeAcknowledged)}
          aria-describedby={fieldErrors.privacyNoticeAcknowledged ? "privacy-notice-error" : undefined}
          onChange={() => clearFieldError("privacyNoticeAcknowledged")}
        />
        <span>
          <Link href="/kvkk#aydinlatma" target="_blank">Ön Kayıt KVKK Aydınlatma Metni</Link>&apos;ni
          okudum ve kişisel verilerimin nasıl işlendiği konusunda bilgilendirildim.
        </span>
        {fieldErrors.privacyNoticeAcknowledged ? (
          <small id="privacy-notice-error" className="form-field-error">{fieldErrors.privacyNoticeAcknowledged}</small>
        ) : null}
      </label>

      <label className="consent-field consent-field--optional">
        <input name="whatsappConsent" type="checkbox" />
        <span>
          <strong>İsteğe bağlı:</strong>{" "}Başvuru bilgilerimi içeren hazır mesajın WhatsApp&apos;ta
          açılmasını istiyorum. Bu işlem bilgilerimi WhatsApp hizmetine aktarabilir; mesajı
          göndermediğim sürece bilgiler WhatsApp üzerinden okula iletilmez.
        </span>
      </label>

      <div className="form-footer">
        <p>
          Gizlilik tercihiniz ve aydınlatma metni sürümü başvuruyla birlikte kaydedilir.
        </p>
        <button className="button button--primary" type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Başvuru kaydediliyor..." : content.submitLabel}
          <ArrowRight size={17} aria-hidden="true" />
        </button>
      </div>

      <p className={`form-status form-status--${status}`} aria-live="polite">
        {status === "success" ? <><CheckCircle2 size={17} aria-hidden="true" /> {statusMessage}</> : null}
        {status === "error" ? statusMessage || "Lütfen zorunlu alanları kontrol edin." : null}
      </p>
    </form>
  );
}
