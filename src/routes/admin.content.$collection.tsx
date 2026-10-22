import { createFileRoute, notFound, redirect, useRouter } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, Eye, EyeOff, ImageIcon, Pencil, Plus, Trash2, X } from "lucide-react";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";

import { AdminCard, AdminShell } from "@/components/admin/AdminShell";
import { errorText, prepareImage } from "@/components/admin/prepare-image";
import {
  adminClearCollectionImage,
  adminDeleteCollectionItem,
  adminListCollection,
  adminMoveCollectionItem,
  adminSaveCollectionItem,
  adminSetCollectionHidden,
  adminUploadCollectionImage,
} from "@/data/admin";
import { checkAuth } from "@/data/auth";
import {
  collections,
  isCollectionKey,
  type CollectionItem,
  type CollectionKey,
  type FieldDef,
} from "@/data/collections";
import { adminSeo } from "@/lib/admin-seo";

export const Route = createFileRoute("/admin/content/$collection")({
  loader: async ({ params }) => {
    if (!isCollectionKey(params.collection)) throw notFound();
    if (!(await checkAuth())) throw redirect({ to: "/admin/login" });
    return {
      key: params.collection,
      items: await adminListCollection({ data: params.collection }),
    };
  },
  head: ({ params }) =>
    adminSeo(isCollectionKey(params.collection) ? collections[params.collection].label : "Content"),
  component: CollectionAdmin,
});

const str = (v: unknown) => (typeof v === "string" ? v : v == null ? "" : String(v));

/** Photos are shrunk in the browser first; SVG logos go up as they are. */
async function fileForUpload(file: File): Promise<File> {
  if (file.type === "image/svg+xml") return file;
  return (await prepareImage(file)).file;
}

function CollectionAdmin() {
  const { key, items } = Route.useLoaderData() as { key: CollectionKey; items: CollectionItem[] };
  const def = collections[key];
  const [editing, setEditing] = useState<number | "new" | null>(null);

  return (
    <AdminShell
      title={def.label}
      description={def.description}
      actions={
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={() => setEditing("new")}
        >
          <Plus size={17} aria-hidden /> Add {def.singular}
        </button>
      }
    >
      {editing === "new" && (
        <ItemEditor key="new" collection={key} item={null} onDone={() => setEditing(null)} />
      )}

      <AdminCard
        title={`${items.length} ${items.length === 1 ? def.singular : `${def.singular}s`}`}
        description="Use the arrows to change the order on the website. The eye hides an item without deleting it."
      >
        {items.length === 0 ? (
          <p className="admin-muted">
            Nothing here yet. Press “Add {def.singular}” to create the first one — the section
            appears on the website as soon as it has content.
          </p>
        ) : (
          <div className="admin-list" style={{ gap: 10 }}>
            {items.map((item, i) =>
              editing === item.id ? (
                <ItemEditor
                  key={item.id}
                  collection={key}
                  item={item}
                  onDone={() => setEditing(null)}
                />
              ) : (
                <ItemRow
                  key={item.id}
                  collection={key}
                  item={item}
                  first={i === 0}
                  last={i === items.length - 1}
                  onEdit={() => setEditing(item.id)}
                />
              ),
            )}
          </div>
        )}
      </AdminCard>
    </AdminShell>
  );
}

function ItemRow({
  collection,
  item,
  first,
  last,
  onEdit,
}: {
  collection: CollectionKey;
  item: CollectionItem;
  first: boolean;
  last: boolean;
  onEdit: () => void;
}) {
  const router = useRouter();
  const def = collections[collection];
  const [busy, setBusy] = useState(false);
  const imageField = def.fields.find((f) => f.type === "image");
  const thumb = imageField ? str(item[imageField.key]) : "";
  const title = str(item[def.titleField]) || `Untitled ${def.singular}`;
  const subtitle = def.fields
    .filter(
      (f) =>
        f.key !== def.titleField &&
        (f.type === "text" || f.type === "textarea" || f.type === "select"),
    )
    .map((f) => str(item[f.key]))
    .find(Boolean);

  async function run(action: () => Promise<unknown>) {
    setBusy(true);
    try {
      await action();
      await router.invalidate();
    } catch (e) {
      alert(errorText(e));
    }
    setBusy(false);
  }

  return (
    <div className={`admin-item ${item.hidden ? "is-hidden" : ""}`} aria-busy={busy}>
      {thumb ? (
        <img src={thumb} alt="" className="admin-item-thumb" loading="lazy" />
      ) : (
        <span className="admin-item-thumb">
          <ImageIcon size={20} aria-hidden />
        </span>
      )}
      <div className="admin-item-text">
        <strong>{title}</strong>
        <small>{item.hidden ? "Hidden from the website" : subtitle || " "}</small>
      </div>
      <div className="admin-row-actions">
        <button
          className="admin-btn admin-btn-small"
          disabled={busy || first}
          aria-label="Move up"
          onClick={() =>
            run(() =>
              adminMoveCollectionItem({ data: { collection, id: item.id, direction: "up" } }),
            )
          }
        >
          <ArrowUp size={16} />
        </button>
        <button
          className="admin-btn admin-btn-small"
          disabled={busy || last}
          aria-label="Move down"
          onClick={() =>
            run(() =>
              adminMoveCollectionItem({ data: { collection, id: item.id, direction: "down" } }),
            )
          }
        >
          <ArrowDown size={16} />
        </button>
        <button
          className="admin-btn admin-btn-small"
          disabled={busy}
          aria-label={item.hidden ? "Show on website" : "Hide from website"}
          title={item.hidden ? "Show on website" : "Hide from website"}
          onClick={() =>
            run(() =>
              adminSetCollectionHidden({ data: { collection, id: item.id, hidden: !item.hidden } }),
            )
          }
        >
          {item.hidden ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
        <button className="admin-btn admin-btn-small" disabled={busy} onClick={onEdit}>
          <Pencil size={16} /> Edit
        </button>
        <button
          className="admin-btn admin-btn-small admin-btn-danger"
          disabled={busy}
          aria-label="Delete"
          onClick={() =>
            confirm(`Delete “${title}”? This cannot be undone.`) &&
            run(() => adminDeleteCollectionItem({ data: { collection, id: item.id } }))
          }
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

function ItemEditor({
  collection,
  item,
  onDone,
}: {
  collection: CollectionKey;
  item: CollectionItem | null;
  onDone: () => void;
}) {
  const router = useRouter();
  const def = collections[collection];
  const fields = def.fields as readonly FieldDef[];
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      fields
        .filter((f) => f.type !== "image")
        .map((f) => [f.key, item ? str(item[f.key]) : (f.options?.[0]?.value ?? "")]),
    ),
  );
  // Pictures chosen before a new item exists are uploaded right after it is created.
  const [pending, setPending] = useState<Record<string, { file: File; preview: string }>>({});
  const [state, setState] = useState({ busy: false, error: "", progress: "" });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setState({ busy: true, error: "", progress: "Saving…" });
    try {
      const { id } = await adminSaveCollectionItem({
        data: { collection, id: item?.id ?? null, values },
      });
      for (const [field, p] of Object.entries(pending)) {
        setState({ busy: true, error: "", progress: "Uploading picture…" });
        await uploadImage(collection, id, field, p.file);
      }
      await router.invalidate();
      onDone();
    } catch (err) {
      setState({ busy: false, error: errorText(err), progress: "" });
    }
  }

  return (
    <AdminCard
      title={item ? `Edit ${def.singular}` : `New ${def.singular}`}
      actions={
        <button type="button" className="admin-btn admin-btn-small" onClick={onDone}>
          <X size={16} /> Close
        </button>
      }
      className="admin-editor-card"
    >
      <form className="admin-form" onSubmit={onSubmit}>
        <div className="admin-grid-2">
          {fields.map((f) =>
            f.type === "image" ? (
              <ImageField
                key={f.key}
                field={f}
                collection={collection}
                itemId={item?.id ?? null}
                current={item ? str(item[f.key]) : ""}
                pending={pending[f.key]}
                onPending={(p) => setPending((x) => ({ ...x, [f.key]: p }))}
                contain={collection === "clients" || collection === "testimonials"}
              />
            ) : (
              <TextField
                key={f.key}
                field={f}
                value={values[f.key] ?? ""}
                onChange={(v) => setValues((x) => ({ ...x, [f.key]: v }))}
              />
            ),
          )}
        </div>
        {state.error && <p className="admin-error">{state.error}</p>}
        <div className="admin-actions">
          <button type="submit" className="admin-btn admin-btn-primary" disabled={state.busy}>
            {state.busy ? state.progress : item ? "Save changes" : `Add ${def.singular}`}
          </button>
          <button type="button" className="admin-btn" onClick={onDone} disabled={state.busy}>
            Cancel
          </button>
        </div>
      </form>
    </AdminCard>
  );
}

async function uploadImage(collection: CollectionKey, id: number, field: string, file: File) {
  const form = new FormData();
  form.append("file", file);
  form.append("collection", collection);
  form.append("field", field);
  form.append("id", String(id));
  await adminUploadCollectionImage({ data: form });
}

function TextField({
  field: f,
  value,
  onChange,
}: {
  field: FieldDef;
  value: string;
  onChange: (v: string) => void;
}) {
  const wide = f.type === "textarea" || f.type === "lines";
  const id = `f-${f.key}`;
  return (
    <div className="admin-field" style={wide ? { gridColumn: "1 / -1" } : undefined}>
      <label htmlFor={id}>
        {f.label}
        {f.required ? " *" : ""}
      </label>
      {f.type === "select" || f.type === "icon" ? (
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
          {f.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : wide ? (
        <textarea
          id={id}
          rows={f.type === "lines" ? 5 : f.max && f.max > 500 ? 6 : 3}
          maxLength={f.max}
          required={f.required}
          value={value}
          placeholder={f.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          id={id}
          type={f.type === "url" ? "url" : "text"}
          maxLength={f.max}
          required={f.required}
          value={value}
          placeholder={f.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {f.help && <small>{f.help}</small>}
      {f.max && wide && (
        <small>
          {value.length}/{f.max}
        </small>
      )}
    </div>
  );
}

function ImageField({
  field: f,
  collection,
  itemId,
  current,
  pending,
  onPending,
  contain,
}: {
  field: FieldDef;
  collection: CollectionKey;
  itemId: number | null;
  current: string;
  pending: { file: File; preview: string } | undefined;
  onPending: (p: { file: File; preview: string }) => void;
  contain: boolean;
}) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [state, setState] = useState({ busy: false, error: "" });
  const shown = pending?.preview || current;

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setState({ busy: true, error: "" });
    try {
      const ready = await fileForUpload(file);
      if (itemId === null) {
        onPending({ file: ready, preview: URL.createObjectURL(ready) });
      } else {
        await uploadImage(collection, itemId, f.key, ready);
        await router.invalidate();
      }
      setState({ busy: false, error: "" });
    } catch (err) {
      setState({ busy: false, error: errorText(err) });
    }
    if (input.current) input.current.value = "";
  }

  async function onRemove() {
    if (itemId === null) return;
    setState({ busy: true, error: "" });
    try {
      await adminClearCollectionImage({ data: { collection, id: itemId, field: f.key } });
      await router.invalidate();
      setState({ busy: false, error: "" });
    } catch (err) {
      setState({ busy: false, error: errorText(err) });
    }
  }

  return (
    <div className="admin-field" style={{ gridColumn: "1 / -1" }}>
      <span>
        {f.label}
        {f.required ? " *" : ""}
      </span>
      <div className="admin-image-field">
        {shown ? (
          <img src={shown} alt="" className={contain ? "is-contain" : ""} />
        ) : (
          <span className="admin-item-thumb" style={{ width: 140, height: 105 }}>
            <ImageIcon size={24} />
          </span>
        )}
        <div className="admin-actions">
          <label className="admin-btn admin-btn-small">
            {state.busy ? "Uploading…" : shown ? "Replace picture" : "Choose picture"}
            <input
              ref={input}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
              onChange={onFile}
              disabled={state.busy}
              className="sr-only"
            />
          </label>
          {current && itemId !== null && !f.required && (
            <button
              type="button"
              className="admin-btn admin-btn-small"
              onClick={onRemove}
              disabled={state.busy}
            >
              Remove
            </button>
          )}
        </div>
      </div>
      <small>
        {itemId === null && pending
          ? "This picture uploads when you save."
          : "JPG, PNG or WebP. Large photos are resized automatically."}
      </small>
      {state.error && <p className="admin-error">{state.error}</p>}
    </div>
  );
}
