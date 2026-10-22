import { useRouter } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";

import { AdminCard } from "@/components/admin/AdminShell";
import { errorText } from "@/components/admin/prepare-image";
import { adminSaveSettings } from "@/data/admin";
import type { SettingKey, Settings } from "@/data/site-data";

export type SettingField = {
  key: SettingKey;
  label: string;
  rows?: number;
  help?: string;
  placeholder?: string;
};
export type SettingGroup = {
  title: string;
  description?: string;
  fields: SettingField[];
  extra?: ReactNode;
};

/** Cards of settings fields with one sticky save button; only changed values are sent. */
export function SettingsForm({
  settings,
  groups,
  children,
}: {
  settings: Settings;
  groups: SettingGroup[];
  children?: ReactNode;
}) {
  const router = useRouter();
  const keys = groups.flatMap((g) => g.fields.map((f) => f.key));
  const initial = Object.fromEntries(keys.map((k) => [k, settings[k]])) as Record<string, string>;
  const [values, setValues] = useState(initial);
  const [state, setState] = useState({ busy: false, error: "", saved: false });
  const changed = Object.fromEntries(Object.entries(values).filter(([k, v]) => v !== initial[k]));
  const dirty = Object.keys(changed).length > 0;

  async function save() {
    setState({ busy: true, error: "", saved: false });
    try {
      await adminSaveSettings({ data: changed });
      await router.invalidate();
      setState({ busy: false, error: "", saved: true });
    } catch (e) {
      setState({ busy: false, error: errorText(e), saved: false });
    }
  }

  return (
    <>
      {groups.map((g) => (
        <AdminCard key={g.title} title={g.title} description={g.description}>
          <div className="admin-form">
            <div className="admin-grid-2">
              {g.fields.map((f) => (
                <div
                  key={f.key}
                  className="admin-field"
                  style={f.rows ? { gridColumn: "1 / -1" } : undefined}
                >
                  <label htmlFor={`s-${f.key}`}>{f.label}</label>
                  {f.rows ? (
                    <textarea
                      id={`s-${f.key}`}
                      rows={f.rows}
                      value={values[f.key] ?? ""}
                      placeholder={f.placeholder}
                      onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                    />
                  ) : (
                    <input
                      id={`s-${f.key}`}
                      value={values[f.key] ?? ""}
                      placeholder={f.placeholder}
                      onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                    />
                  )}
                  {f.help && <small>{f.help}</small>}
                </div>
              ))}
            </div>
            {g.extra}
          </div>
        </AdminCard>
      ))}
      {children}
      <div className="admin-sticky-save">
        <button
          className="admin-btn admin-btn-primary"
          onClick={save}
          disabled={state.busy || !dirty}
        >
          {state.busy ? "Saving…" : dirty ? "Save changes" : "No changes"}
        </button>
        {state.saved && !dirty && (
          <span className="admin-success">Saved — the website is updated.</span>
        )}
        {state.error && <span className="admin-error">{state.error}</span>}
      </div>
    </>
  );
}
