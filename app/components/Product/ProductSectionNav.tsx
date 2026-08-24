"use client";

import { useEffect, useState } from "react";

interface SectionItem {
  id: string;
  label: string;
}

interface ProductSectionNavProps {
  sections: SectionItem[];
  label: string;
}

export default function ProductSectionNav({
  sections,
  label,
}: ProductSectionNavProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");

  useEffect(() => {
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top, behavior: "smooth" });
    setActiveId(id);
  };

  if (sections.length === 0) return null;

  return (
    <div className="sticky top-16 z-[var(--z-sticky)] -mx-6 border-y border-[var(--color-rule)] bg-[var(--color-paper)] px-6 py-2 lg:top-24 lg:mx-0 lg:self-start lg:border-0 lg:bg-transparent lg:px-0 lg:py-0">
      <p className="mb-4 hidden text-sm font-semibold text-[var(--color-ink)] lg:block">
        {label}
      </p>
      <nav
        aria-label={label}
        className="flex gap-1 overflow-x-auto lg:flex-col lg:gap-0 lg:overflow-visible lg:border-t lg:border-[var(--color-rule)]"
      >
        {sections.map((section) => {
          const isActive = section.id === activeId;
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={(e) => handleClick(e, section.id)}
              className={`relative flex min-h-11 flex-shrink-0 items-center justify-between whitespace-nowrap border-b px-3 py-2 text-sm font-semibold transition-colors duration-[var(--dur-short)] active:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 lg:w-full lg:border-[var(--color-rule)] lg:border-t-0 lg:px-0 ${
                isActive
                  ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)] lg:bg-transparent lg:text-[var(--color-accent-strong)]"
                  : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-ink)] lg:border-[var(--color-rule)]"
              }`}
            >
              {section.label}
              <span
                aria-hidden="true"
                className={`ml-5 hidden text-base lg:inline ${
                  isActive ? "text-[var(--color-accent)]" : "text-[var(--color-rule-strong)]"
                }`}
              >
                →
              </span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}
