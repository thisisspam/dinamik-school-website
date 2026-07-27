import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { getContentPage } from "@/lib/cms/content";
import { CONTENT_PAGE_DEFINITION_BY_KEY } from "@/lib/cms/page-definitions";
import { updateContentPageAction } from "@/lib/actions/content-pages";
import { AdminPageHeader } from "../../../AdminPageHeader";
import { ContentPageForm } from "../../../ContentPageForm";

export default async function AdminEditContentPage({
  params,
  searchParams,
}: {
  params: Promise<{ key: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const [{ key }, { saved }] = await Promise.all([params, searchParams]);
  const definition = CONTENT_PAGE_DEFINITION_BY_KEY.get(key);
  if (!definition) notFound();
  const document = await getContentPage(key);

  return (
    <>
      <AdminPageHeader
        eyebrow={definition.category}
        title={definition.displayName}
        description={definition.description}
        actions={(
          <>
            <Link className="admin-btn admin-btn-secondary" href="/admin/sayfalar"><ArrowLeft aria-hidden="true" size={16} /> Sayfalara dön</Link>
            {definition.route.startsWith("/") ? (
              <Link className="admin-btn admin-btn-secondary" href={definition.route} target="_blank">
                Sayfayı aç <ExternalLink aria-hidden="true" size={15} />
              </Link>
            ) : null}
          </>
        )}
      />
      {saved ? <div className="admin-flash">Sayfa içeriği kaydedildi.</div> : null}
      <div className="admin-card admin-content-editor-card">
        <ContentPageForm action={updateContentPageAction} definition={definition} document={document} />
      </div>
    </>
  );
}
