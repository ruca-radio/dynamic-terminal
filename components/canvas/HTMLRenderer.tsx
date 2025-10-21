"use client";

import { useEffect, useRef } from "react";

interface HTMLRendererProps {
  html: string;
  id: string;
}

export default function HTMLRenderer({ html, id }: HTMLRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Sanitize and render HTML
      containerRef.current.innerHTML = html;

      // Execute any script tags (be careful with this in production)
      const scripts = containerRef.current.getElementsByTagName("script");
      Array.from(scripts).forEach((oldScript) => {
        const newScript = document.createElement("script");
        Array.from(oldScript.attributes).forEach((attr) =>
          newScript.setAttribute(attr.name, attr.value)
        );
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        oldScript.parentNode?.replaceChild(newScript, oldScript);
      });
    }
  }, [html]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{
        overflow: "auto",
        colorScheme: "dark",
      }}
    />
  );
}
