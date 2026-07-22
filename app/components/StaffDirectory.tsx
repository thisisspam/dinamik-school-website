"use client";

import Image from "next/image";
import { Search, Users } from "lucide-react";
import { useMemo, useState } from "react";
import type { StaffGroup, StaffMember } from "../data/staff";

const ALL = "Tümü";
const PRINCIPAL_ROLES = new Set(["Kurum Müdürü", "Müdür"]);
const VICE_PRINCIPAL_ROLE = "Müdür Yardımcısı";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  return `${parts[0]?.[0] ?? ""}${parts.at(-1)?.[0] ?? ""}`.toLocaleUpperCase("tr-TR");
}

function getAdministrativeRole(member: StaffMember) {
  return [member.additionalRole, member.role].find(
    (role) => role && (PRINCIPAL_ROLES.has(role) || role.startsWith(VICE_PRINCIPAL_ROLE)),
  );
}

function StaffCard({ member, nameHeadingLevel }: { member: StaffMember; nameHeadingLevel: 4 | 5 }) {
  const NameHeading = nameHeadingLevel === 5 ? "h5" : "h4";

  return (
    <article className="staff-card">
      <div className="staff-card-media">
        {member.image ? (
          <Image
            src={member.image}
            alt={[member.name, member.role, member.additionalRole].filter(Boolean).join(", ")}
            fill
            sizes="(max-width: 700px) calc(100vw - 48px), (max-width: 1100px) 33vw, 25vw"
          />
        ) : (
          <span className="staff-avatar" aria-hidden="true">{getInitials(member.name)}</span>
        )}
      </div>
      <div className="staff-card-body">
        <NameHeading>{member.name}</NameHeading>
        <p className="staff-card-primary-role">{member.role}</p>
        {member.additionalRole ? (
          <p className="staff-card-additional-role">{member.additionalRole}</p>
        ) : null}
      </div>
    </article>
  );
}

export function StaffDirectory({ staffGroups, staffMembers }: { staffGroups: StaffGroup[]; staffMembers: StaffMember[] }) {
  const [activeCategory, setActiveCategory] = useState(ALL);
  const [query, setQuery] = useState("");

  const teachingStaff = useMemo(
    () => staffMembers.filter((member) => member.category !== "İdari Kadro"),
    [staffMembers],
  );
  const administrativeGroups = useMemo(() => {
    const administrators = staffMembers
      .map((member) => ({ member, administrativeRole: getAdministrativeRole(member) }))
      .filter((entry): entry is { member: StaffMember; administrativeRole: string } => Boolean(entry.administrativeRole));

    return [
      {
        id: "principals",
        title: "Müdürler",
        members: administrators
          .filter(({ administrativeRole }) => PRINCIPAL_ROLES.has(administrativeRole))
          .map(({ member }) => member),
      },
      {
        id: "vice-principals",
        title: "Müdür Yardımcıları",
        members: administrators
          .filter(({ administrativeRole }) => administrativeRole.startsWith(VICE_PRINCIPAL_ROLE))
          .map(({ member }) => member),
      },
    ].filter((group) => group.members.length > 0);
  }, [staffMembers]);

  const visibleStaff = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("tr-TR");
    return teachingStaff.filter((member) => {
      const matchesCategory = activeCategory === ALL || member.category === activeCategory;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${member.name} ${member.role} ${member.additionalRole ?? ""}`
          .toLocaleLowerCase("tr-TR")
          .includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query, teachingStaff]);

  return (
    <div className="staff-directory">
      {administrativeGroups.length > 0 ? (
        <section className="administrative-staff-section" aria-labelledby="administrative-staff-title">
          <div className="administrative-staff-heading">
            <div>
              <p>Okul yönetimi</p>
              <h3 id="administrative-staff-title">İdari Kadromuz</h3>
            </div>
            <p>Okul yönetiminde görev alan müdürlerimiz ve müdür yardımcılarımız.</p>
          </div>
          <div className="administrative-staff-groups">
            {administrativeGroups.map((group) => (
              <section className="administrative-staff-group" aria-labelledby={`${group.id}-title`} key={group.id}>
                <div className="administrative-staff-group-heading">
                  <h4 id={`${group.id}-title`}>{group.title}</h4>
                  <span>{group.members.length} kişi</span>
                </div>
                <div className="staff-grid administrative-staff-grid">
                  {group.members.map((member) => (
                    <StaffCard
                      member={member}
                      nameHeadingLevel={5}
                      key={`${group.id}-${member.category}-${member.name}`}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      ) : null}

      <section className="teaching-staff-directory" aria-labelledby="teaching-staff-title">
        <div className="teaching-staff-heading">
          <div>
            <p>Branş kadrosu</p>
            <h3 id="teaching-staff-title">Öğretmenlerimiz</h3>
          </div>
          <p>İsme veya branşa göre arayarak öğretmenlerimizi inceleyebilirsiniz.</p>
        </div>
        <div className="staff-toolbar">
          <label className="staff-search">
            <span className="sr-only">Öğretmen kadrosunda ara</span>
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="İsim veya branş ara"
            />
          </label>
          <div className="staff-filter-list" aria-label="Branşa göre filtrele">
            {[ALL, ...staffGroups.map((group) => group.category)].map((category) => (
              <button
                className={activeCategory === category ? "is-active" : ""}
                type="button"
                key={category}
                aria-pressed={activeCategory === category}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="staff-grid" aria-live="polite">
          {visibleStaff.map((member) => (
            <StaffCard member={member} nameHeadingLevel={4} key={`${member.category}-${member.name}`} />
          ))}
          {visibleStaff.length === 0 ? (
            <div className="staff-empty">
              <Users size={28} aria-hidden="true" />
              <p>Aramanızla eşleşen bir öğretmen bulunamadı.</p>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
