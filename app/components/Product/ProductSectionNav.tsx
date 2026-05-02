"use client";

import { useEffect, useState } from "react";

interface SectionItem {
  id: string;
  label: string;
}

interface ProductSectionNavProps {
  sections: SectionItem[];
}

export default function ProductSectionNav({ sections }: ProductSectionNavProps) {
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
    <div className="sticky top-16 z-20 -mx-4 mb-6 border-y border-gray-200 bg-white/90 px-4 py-2 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/90 sm:-mx-6 sm:px-6">
      <nav
        aria-label="Product details navigation"
        className="flex gap-1 overflow-x-auto"
      >
        {sections.map((section) => {
          const isActive = section.id === activeId;
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={(e) => handleClick(e, section.id)}
              className={`relative flex-shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-[#08778c] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
              }`}
            >
              {section.label}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
