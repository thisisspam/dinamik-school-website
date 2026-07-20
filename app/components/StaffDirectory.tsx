"use client";

import { Search, Users } from "lucide-react";
import { useMemo, useState } from "react";
import type { StaffGroup, StaffMember } from "../data/staff";

const ALL = "Tümü";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  return `${parts[0]?.[0] ?? ""}${parts.at(-1)?.[0] ?? ""}`.toLocaleUpperCase("tr-TR");
}

export function StaffDirectory({ staffGroups, staffMembers }: { staffGroups: StaffGroup[]; staffMembers: StaffMember[] }) {
  const [activeCategory, setActiveCategory] = useState(ALL);
  const [query, setQuery] = useState("");

  const visibleStaff = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("tr-TR");
    return staffMembers.filter((member) => {
      const matchesCategory = activeCategory === ALL || member.category === activeCategory;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${member.name} ${member.role}`.toLocaleLowerCase("tr-TR").includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query, staffMembers]);

  return (
    <div className="staff-directory">
      <div className="staff-toolbar">
        <label className="staff-search">
          <span className="sr-only">Kadroda ara</span>
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
          <article className="staff-card" key={`${member.category}-${member.name}`}>
            <span className="staff-avatar" aria-hidden="true">{getInitials(member.name)}</span>
            <h3>{member.name}</h3>
            <p>{member.role}</p>
          </article>
        ))}
        {visibleStaff.length === 0 ? (
          <div className="staff-empty">
            <Users size={28} aria-hidden="true" />
            <p>Aramanızla eşleşen bir ekip üyesi bulunamadı.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
