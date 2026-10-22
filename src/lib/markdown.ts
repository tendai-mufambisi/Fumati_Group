/**
 * A small markdown renderer for project write-ups.
 *
 * Deliberately not a dependency: the dashboard is single-owner, the syntax the
 * owner needs is narrow, and shipping a parser to every visitor for a handful of
 * project pages is not a trade worth making.
 *
 * Safety: every line is HTML-escaped *before* any markdown is applied, so the
 * only tags in the output are ones this file emits. That is what makes the
 * result safe to pass to `dangerouslySetInnerHTML`. Never reorder those steps.
 * URLs are additionally filtered so `javascript:` and friends cannot reach an
 * href or src.
 */

const H2 = "mt-10 text-2xl font-extrabold text-green-700 sm:text-3xl";
const H3 = "mt-8 text-xl font-semibold text-green-700";
const P = "mt-4 leading-relaxed text-muted-foreground";
const UL = "mt-5 space-y-2";
const OL = "mt-5 list-decimal space-y-2 pl-5 marker:font-semibold marker:text-red-600";
const LI_BULLET =
  "flex items-start gap-3 text-muted-foreground before:mt-2.5 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-red-600";
const LI_NUMBER = "pl-1 leading-relaxed text-muted-foreground";
const QUOTE = "mt-6 border-l-2 border-red-600 pl-5 text-lg leading-relaxed text-green-700";
const IMG = "mt-8 w-full rounded-2xl border border-border shadow-card";
const LINK = "font-semibold text-green-700 underline underline-offset-4 hover:text-green-700";
const CODE = "rounded bg-secondary px-1.5 py-0.5 text-[0.9em] text-green-700";
const HR = "my-10 border-border";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Allow only URLs that cannot execute script. Relative paths and anchors pass;
 * anything with a scheme must be http, https or mailto.
 */
function safeUrl(raw: string): string | null {
  const url = raw.trim();
  if (!url) return null;
  if (/^(?:https?:|mailto:)/i.test(url)) return url;
  // No scheme at all — a relative path, anchor or query.
  if (!/^[a-z][a-z0-9+.-]*:/i.test(url)) return url;
  return null;
}

/**
 * Inline formatting, applied to text that is already escaped. Images run before
 * links so `![alt](src)` is not mistaken for a link with a stray `!`.
 */
function inline(text: string): string {
  return (
    text
      // `code` — first, so formatting inside it is not re-interpreted.
      .replace(/`([^`]+)`/g, (_m, code: string) => `<code class="${CODE}">${code}</code>`)
      // ![alt](src)
      .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (match, alt: string, src: string) => {
        const href = safeUrl(src);
        return href ? `<img src="${href}" alt="${alt}" loading="lazy" class="${IMG}" />` : match;
      })
      // [label](href)
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (match, label: string, target: string) => {
        const href = safeUrl(target);
        if (!href) return match;
        const external = /^https?:/i.test(href);
        const rel = external ? ' target="_blank" rel="noreferrer noopener"' : "";
        return `<a href="${href}" class="${LINK}"${rel}>${label}</a>`;
      })
      // **bold** then *italic*
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>")
  );
}

type ListKind = "ul" | "ol";

/**
 * Render markdown to an HTML string.
 *
 * Supported: `##`/`###` headings, paragraphs, `-`/`*` bullets, `1.` numbered
 * lists, `>` blockquotes, `---` rules, plus inline bold, italic, code, links
 * and images. Anything else renders as literal text.
 */
export function renderMarkdown(markdown: string): string {
  const lines = escapeHtml(markdown).replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];

  let list: ListKind | null = null;
  let paragraph: string[] = [];

  const closeList = () => {
    if (!list) return;
    out.push(list === "ul" ? "</ul>" : "</ol>");
    list = null;
  };

  const closeParagraph = () => {
    if (paragraph.length === 0) return;
    out.push(`<p class="${P}">${inline(paragraph.join(" "))}</p>`);
    paragraph = [];
  };

  const flush = () => {
    closeParagraph();
    closeList();
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flush();
      continue;
    }

    // A standalone image is a block, not a paragraph with an image in it.
    if (/^!\[[^\]]*\]\([^)\s]+\)$/.test(trimmed)) {
      flush();
      out.push(inline(trimmed));
      continue;
    }

    if (trimmed === "---" || trimmed === "***") {
      flush();
      out.push(`<hr class="${HR}" />`);
      continue;
    }

    const heading = trimmed.match(/^(#{2,3})\s+(.*)$/);
    if (heading) {
      flush();
      const level = (heading[1] ?? "##").length === 2 ? "h2" : "h3";
      const cls = level === "h2" ? H2 : H3;
      out.push(`<${level} class="${cls}">${inline(heading[2] ?? "")}</${level}>`);
      continue;
    }

    // Escaping runs before block detection, so a leading `>` has already
    // become `&gt;` by the time it gets here. Every other block marker
    // (`#`, `-`, `*`, digits, `---`) survives escaping unchanged.
    const quote = trimmed.match(/^&gt;\s?(.*)$/);
    if (quote) {
      flush();
      out.push(`<blockquote class="${QUOTE}">${inline(quote[1] ?? "")}</blockquote>`);
      continue;
    }

    const bullet = trimmed.match(/^[-*]\s+(.*)$/);
    if (bullet) {
      closeParagraph();
      if (list !== "ul") {
        closeList();
        out.push(`<ul class="${UL}">`);
        list = "ul";
      }
      out.push(`<li class="${LI_BULLET}">${inline(bullet[1] ?? "")}</li>`);
      continue;
    }

    const numbered = trimmed.match(/^\d+[.)]\s+(.*)$/);
    if (numbered) {
      closeParagraph();
      if (list !== "ol") {
        closeList();
        out.push(`<ol class="${OL}">`);
        list = "ol";
      }
      out.push(`<li class="${LI_NUMBER}">${inline(numbered[1] ?? "")}</li>`);
      continue;
    }

    // Plain text: buffer it so wrapped lines join into one paragraph.
    closeList();
    paragraph.push(trimmed);
  }

  flush();
  return out.join("\n");
}

/** Rough reading time, offered as a default when the owner leaves it blank. */
export function estimateReadingTime(markdown: string): string {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}
