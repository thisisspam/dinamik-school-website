export function AdminPageHeader({
  eyebrow = "İçerik yönetimi",
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="admin-page-header">
      <div className="admin-page-heading">
        <span className="admin-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {description ? <p className="admin-page-desc">{description}</p> : null}
      </div>
      {actions ? <div className="admin-page-actions">{actions}</div> : null}
    </header>
  );
}
