import { ArrowUpRight } from "lucide-react";
import type { DirectoryApp } from "@/data/apps";

export function AppTile({ app }: { app: DirectoryApp }) {
  const Icon = app.icon;

  return (
    <a
      className="app-tile"
      href={app.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${app.name} in a new tab`}
    >
      <div className="app-tile__visual" aria-hidden="true">
        <span className="app-tile__visual-label">PDF</span>
        <span className="app-tile__sheet app-tile__sheet--back" />
        <span className="app-tile__sheet app-tile__sheet--front">
          <Icon className="app-tile__sheet-icon" strokeWidth={1.5} />
          <span className="app-tile__sheet-lines" />
        </span>
      </div>

      <div className="app-tile__body">
        <div className="app-tile__meta">
          <span>{app.category}</span>
          <span className="app-tile__status">
            <span className="app-tile__status-dot" aria-hidden="true" />
            {app.status}
          </span>
        </div>
        <h3>{app.name}</h3>
        <p>{app.description}</p>
        <span className="app-tile__cta">
          Open {app.name}
          <ArrowUpRight aria-hidden="true" />
        </span>
      </div>
    </a>
  );
}
