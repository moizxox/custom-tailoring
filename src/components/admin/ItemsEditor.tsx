"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Plus, Trash2, GripVertical, ChevronDown, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CmsItemField } from "@/lib/cms/page-schemas";
import MediaPickerModal from "@/components/admin/MediaPickerModal";

const ALL_ICONS = [
  "backstitch-sewing-tailoring-needle.svg",
  "bag-sewing-tools-tailoring-handcraft.svg",
  "bobbin-sewing-tailoring-needle.svg",
  "box-threads-sewing-tailoring.svg",
  "button-sewing-tailoring-handcraft.svg",
  "chain-stitch-sewing-needle.svg",
  "crochet-hooks-sewing-tool.svg",
  "cutwork-stitch-sewing-needle.svg",
  "embroidery-sewing-needlework-handcraft.svg",
  "fabric-cloth-sewing-tailoring.svg",
  "hanger-sewing-fashion-cloth.svg",
  "iron-sewing-laundry-tailoring.svg",
  "knitting-sewing-diy-handcraft.svg",
  "measure-pants-sewing-tailoring.svg",
  "measure-suit-sewing-tailoring.svg",
  "mini-scissors-thread-cutter-cut-sewing.svg",
  "needle-threader-fashion-design-sewing-tailoring.svg",
  "pencil-sewing-tailoring-drawing.svg",
  "pin-cushion-handcraft-sewing-tailoring.svg",
  "pin-pin-cushion-sewing-tailoring.svg",
  "pin-sewing-tailoring-handcraft.svg",
  "pinking-shears-fashion-design-sewing-tailoring.svg",
  "rotary-cutter-sewing-tool-handcraft.svg",
  "ruler-sewing-tailoring-handcraft.svg",
  "scissor-cut-fabric-sewing.svg",
  "scissor-cut-sewing-tailoring.svg",
  "seam-ripper-sewing-tool-tailoring.svg",
  "seam-roller-sewing-tailoring-fabric.svg",
  "seam-sewing-tailoring-fabric.svg",
  "sewing-gauges-fashion-design-sewing-tailoring.svg",
  "sewing-machine-manaul-book-sewing-tailoring.svg",
  "sewing-machine-sewing-tailoring-cloth.svg",
  "sewing-machine-sewing-tailoring-vintange.svg",
  "sewing-needles-sewing-tailoring-needle.svg",
  "sewing-needles-thread--sewing-tailoring.svg",
  "sewing-pattern-measure-sewing-tailoring.svg",
  "sewing-pattern-sewing-tailoring-fashion-design.svg",
  "sewing-shop-fashion-sewing-tailoring.svg",
  "spool-of-thread-sewing-tailoring-needle.svg",
  "tailor-chalk-fashion-sewing.svg",
  "tailor-dummy-dress-fashion-sewing.svg",
  "tailor-dummy-fashion-sewing-tailoring.svg",
  "tailor-dummy-ruler-sewing-tailoring.svg",
  "tailor-sewing-fashion-tailoring.svg",
  "tape-measure-sewing-tailoring-size.svg",
  "velcro-tape-sewing-tailoring.svg",
  "wool-sewing-knitting-handcraft.svg",
  "yarn-knitting-needle-sewing-handcraft.svg",
  "yarn-sewing-knitting-handcraft.svg",
  "zipper-sewing-tailoring-handcraft.svg",
];

function niceName(slug: string) {
  return slug
    .replace(".svg", "")
    .split("-")
    .slice(0, 3)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function IconPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const filtered = q ? ALL_ICONS.filter((i) => i.includes(q.toLowerCase())) : ALL_ICONS;

  return (
    <div className="space-y-2">
      {/* Current icon + trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 px-3 py-2 bg-white border border-gray-200 rounded-xl hover:border-violet-300 transition-colors w-full text-left"
      >
        {value ? (
          <Image
            src={`/icons/sewing/${value}`}
            alt=""
            width={22}
            height={22}
            className="shrink-0 opacity-70"
          />
        ) : (
          <div className="w-[22px] h-[22px] rounded-md bg-gray-100 shrink-0" />
        )}
        <span className="flex-1 text-xs text-gray-600 truncate">{value ? niceName(value) : "Choose icon…"}</span>
        <ChevronDown className={cn("w-3.5 h-3.5 text-gray-400 transition-transform shrink-0", open && "rotate-180")} />
      </button>

      {open && (
        <div className="border border-gray-200 rounded-xl bg-white shadow-lg overflow-hidden">
          {/* Search */}
          <div className="px-3 pt-3 pb-2 border-b border-gray-100">
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search icons…"
              className="w-full text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-400 bg-gray-50"
            />
          </div>

          {/* Icon grid */}
          <div className="p-3 max-h-52 overflow-y-auto">
            <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5">
              {filtered.map((slug) => (
                <button
                  key={slug}
                  type="button"
                  title={niceName(slug)}
                  onClick={() => { onChange(slug); setOpen(false); setQ(""); }}
                  className={cn(
                    "w-9 h-9 flex items-center justify-center rounded-lg border transition-all hover:scale-110",
                    value === slug
                      ? "border-violet-400 bg-violet-50 shadow-sm"
                      : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white"
                  )}
                >
                  <Image src={`/icons/sewing/${slug}`} alt={niceName(slug)} width={20} height={20} className="opacity-70" />
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full text-center text-xs text-gray-400 py-4">No icons match &ldquo;{q}&rdquo;</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type ItemRecord = Record<string, string>;

interface ItemsEditorProps {
  value: ItemRecord[];
  onChange: (items: ItemRecord[]) => void;
  itemFields: CmsItemField[];
}

function uid() { return Math.random().toString(36).slice(2, 9); }

type ItemWithId = ItemRecord & { __id: string };

function ensureId(items: ItemRecord[]): ItemWithId[] {
  return items.map((it) => ({ ...it, __id: (it as ItemWithId).__id ?? uid() })) as ItemWithId[];
}

export default function ItemsEditor({ value, onChange, itemFields }: ItemsEditorProps) {
  const [items, setItems] = useState<ItemWithId[]>(() => ensureId(value));
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const dragIndex = useRef<number | null>(null);
  const [mediaPicker, setMediaPicker] = useState<{ itemId: string; fieldKey: string } | null>(null);

  function emit(next: ItemWithId[]) {
    setItems(next);
    onChange(
      next.map(
        (item) =>
          Object.fromEntries(Object.entries(item).filter(([key]) => key !== "__id")) as ItemRecord,
      ),
    );
  }

  function addItem() {
    const newItem = { __id: uid(), ...Object.fromEntries(itemFields.map((f) => [f.key, ""])) } as ItemWithId;
    const next = [...items, newItem];
    emit(next);
    setExpanded((e) => ({ ...e, [newItem.__id]: true }));
  }

  function updateItem(id: string, key: string, val: string) {
    emit(items.map((it) => (it.__id === id ? { ...it, [key]: val } : it)));
  }

  function removeItem(id: string) {
    emit(items.filter((it) => it.__id !== id));
  }

  function onDragStart(i: number) { dragIndex.current = i; }
  function onDragOver(e: React.DragEvent, i: number) {
    e.preventDefault();
    if (dragIndex.current === null || dragIndex.current === i) return;
    const next = [...items];
    const [moved] = next.splice(dragIndex.current, 1);
    next.splice(i, 0, moved);
    dragIndex.current = i;
    emit(next);
  }
  function onDrop() { dragIndex.current = null; }

  const inp = "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition";

  return (
    <div className="space-y-2">
      {items.map((item, i) => {
        const isExpanded = expanded[item.__id] ?? false;
        const iconSlugField = itemFields.find((f) => f.type === "icon_slug");
        const iconSlug = iconSlugField ? item[iconSlugField.key] : "";
        const titleField = itemFields.find((f) => f.key === "title" || f.key === "number");
        const preview = titleField ? item[titleField.key] : `Item ${i + 1}`;

        return (
          <div
            key={item.__id}
            draggable
            onDragStart={() => onDragStart(i)}
            onDragOver={(e) => onDragOver(e, i)}
            onDrop={onDrop}
            className="border border-gray-200 rounded-xl bg-white overflow-hidden hover:border-violet-200 transition-colors"
          >
            {/* Item header */}
            <div className="flex items-center gap-2 px-3 py-2.5 cursor-grab active:cursor-grabbing">
              <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />

              {iconSlug && (
                <Image
                  src={`/icons/sewing/${iconSlug}`}
                  alt=""
                  width={18}
                  height={18}
                  className="shrink-0 opacity-60"
                />
              )}

              <button
                type="button"
                onClick={() => setExpanded((e) => ({ ...e, [item.__id]: !isExpanded }))}
                className="flex-1 flex items-center gap-2 text-left min-w-0"
              >
                <span className="text-sm font-medium text-gray-700 truncate flex-1">
                  {preview || `Item ${i + 1}`}
                </span>
                <ChevronDown className={cn("w-3.5 h-3.5 text-gray-300 transition-transform shrink-0", isExpanded && "rotate-180")} />
              </button>

              <button
                type="button"
                onClick={() => removeItem(item.__id)}
                className="p-1 text-gray-300 hover:text-red-400 transition-colors shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Expanded fields */}
            {isExpanded && (
              <div className="border-t border-gray-100 px-4 py-4 space-y-3 bg-gray-50/50">
                {itemFields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">{field.label}</label>
                    {field.type === "icon_slug" ? (
                      <IconPicker
                        value={item[field.key] ?? ""}
                        onChange={(v) => updateItem(item.__id, field.key, v)}
                      />
                    ) : field.type === "image" ? (
                      <div className="space-y-1.5">
                        {item[field.key] && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item[field.key]} alt="" className="w-24 h-16 rounded-lg object-cover border border-gray-200" />
                        )}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={item[field.key] ?? ""}
                            onChange={(e) => updateItem(item.__id, field.key, e.target.value)}
                            placeholder="/images/..."
                            className={cn(inp, "flex-1 font-mono text-xs")}
                          />
                          <button
                            type="button"
                            onClick={() => setMediaPicker({ itemId: item.__id, fieldKey: field.key })}
                            className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition-colors bg-white whitespace-nowrap"
                          >
                            <ImageIcon className="w-3.5 h-3.5" /> Pick
                          </button>
                        </div>
                      </div>
                    ) : field.type === "textarea" ? (
                      <textarea
                        rows={2}
                        value={item[field.key] ?? ""}
                        onChange={(e) => updateItem(item.__id, field.key, e.target.value)}
                        className={cn(inp, "resize-none")}
                      />
                    ) : field.type === "select" ? (
                      <select
                        value={item[field.key] ?? ""}
                        onChange={(e) => updateItem(item.__id, field.key, e.target.value)}
                        className={cn(inp, "bg-white")}
                      >
                        <option value="">—</option>
                        {(field.options ?? [
                          { value: "h1", label: "H1" },
                          { value: "h2", label: "H2" },
                          { value: "h3", label: "H3" },
                          { value: "h4", label: "H4" },
                        ]).map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type === "url" ? "url" : "text"}
                        value={item[field.key] ?? ""}
                        onChange={(e) => updateItem(item.__id, field.key, e.target.value)}
                        className={inp}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={addItem}
        className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-violet-300 hover:text-violet-600 transition-colors"
      >
        <Plus className="w-4 h-4" /> Add item
      </button>

      {mediaPicker && (
        <MediaPickerModal
          onSelect={(url) => {
            updateItem(mediaPicker.itemId, mediaPicker.fieldKey, url);
            setMediaPicker(null);
          }}
          onClose={() => setMediaPicker(null)}
        />
      )}
    </div>
  );
}
