/* GENERATED: ToolPlaceholder (safe, neutral) */
import React from 'react';

export function ToolPlaceholder({ id, title }: { id: string; title: string }) {
  return (
    <section aria-labelledby="tool-placeholder-title" style={{ padding: 24 }}>
      <h1 id="tool-placeholder-title" style={{ fontSize: 28, marginBottom: 8 }}>{title}</h1>
      <p style={{ fontSize: 18, color: '#334155' }}>
        Cette page est en préparation ({id}). Activez VITE_SHOW_PLACEHOLDERS=true en développement pour visualiser les gabarits.
      </p>
      <p style={{ fontSize: 16, color: '#475569', marginTop: 12 }}>
        En production (flag OFF), ces routes redirigent vers /outils.
      </p>
    </section>
  );
}
