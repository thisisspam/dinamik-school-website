"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { ScholarshipApplicationForm } from "./ScholarshipApplicationForm";

export function ScholarshipAnnouncement() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const restoreScroll = () => { document.documentElement.style.overflow = ""; };
    dialog.addEventListener("close", restoreScroll);
    return () => {
      dialog.removeEventListener("close", restoreScroll);
      restoreScroll();
    };
  }, []);

  function openDialog() {
    const dialog = dialogRef.current;
    if (!dialog) return;
    document.documentElement.style.overflow = "hidden";
    dialog.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  return (
    <section className="scholarship-announcement" aria-labelledby="scholarship-announcement-title">
      <div className="container scholarship-announcement-grid">
        <div className="scholarship-announcement-copy">
          <p className="scholarship-kicker">Başvurular başladı</p>
          <h2 id="scholarship-announcement-title">2027 bursluluk sınavında yerinizi ayırın.</h2>
          <p>9–10 Ocak 2027 tarihlerindeki dört oturumdan size uygun olanı seçerek başvurunuzu birkaç dakikada tamamlayın.</p>
          <div className="scholarship-facts" aria-label="Sınav bilgileri">
            <span><CalendarDays size={18} aria-hidden="true" /><strong>9–10 Ocak 2027</strong></span>
            <span><Clock3 size={18} aria-hidden="true" /><strong>10.00 ve 14.00</strong></span>
          </div>
          <div className="scholarship-announcement-actions">
            <button className="scholarship-primary-action" type="button" onClick={openDialog}>Hemen başvur <ArrowRight size={18} aria-hidden="true" /></button>
            <Link href="/bursluluk-sinavi">Sınav ayrıntıları</Link>
          </div>
        </div>

        <button className="scholarship-poster-button" type="button" onClick={openDialog} aria-label="Bursluluk sınavı afişini aç ve başvuru formunu görüntüle">
          <Image src="/images/bursluluk/bursluluk-sinavi-2027.png" alt="Dinamik Okulları Bursluluk Sınavı, 9–10 Ocak 2027; sabah oturumu 10.00, öğle oturumu 14.00" width={1122} height={1402} sizes="(max-width: 700px) 88vw, 380px" />
          <span>Başvuru formunu aç <ArrowRight size={17} aria-hidden="true" /></span>
        </button>
      </div>

      <dialog className="scholarship-dialog" ref={dialogRef} aria-labelledby="scholarship-dialog-title" onClick={(event) => { if (event.target === event.currentTarget) closeDialog(); }}>
        <div className="scholarship-dialog-panel">
          <header>
            <div><span>Dinamik Okulları</span><strong id="scholarship-dialog-title">Bursluluk Sınavı Başvurusu</strong></div>
            <button type="button" onClick={closeDialog} aria-label="Başvuru formunu kapat"><X size={22} /></button>
          </header>
          <ScholarshipApplicationForm compact />
          <Link className="scholarship-dialog-page-link" href="/bursluluk-sinavi">Formu ayrı sayfada aç</Link>
        </div>
      </dialog>
    </section>
  );
}
