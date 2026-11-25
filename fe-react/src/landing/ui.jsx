export function SectionHeading({ eyebrow, title, text, light = false }) {
  return (
    <div className="max-w-xl">
      <p className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${light ? 'text-accent' : 'text-brand-700'}`}>
        <span className="h-0.5 w-5 bg-accent" />
        {eyebrow}
      </p>
      <h2 className={`mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl ${light ? 'text-white' : 'text-brand-800'}`}>
        {title}
      </h2>
      {text && <p className={`mt-3 ${light ? 'text-brand-100' : 'text-gray-600'}`}>{text}</p>}
    </div>
  )
}

export function Toggle({ label, options, value, onChange }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-500">{label}</span>
      <div className="flex rounded-full border border-gray-200 bg-white p-1">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
            className={`rounded-full px-3 py-1 font-medium transition ${
              value === o.value ? 'bg-brand-700 text-white' : 'text-gray-600 hover:text-brand-700'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function Accordion({ items }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <details key={item.title} className="group rounded-xl border border-gray-200 bg-white">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium text-gray-800 [&::-webkit-details-marker]:hidden">
            {item.title}
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700 transition group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="px-5 pb-4 text-sm text-gray-600">{item.text}</p>
        </details>
      ))}
    </div>
  )
}
