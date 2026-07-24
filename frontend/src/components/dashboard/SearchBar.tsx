import { Search } from 'lucide-react'

export function SearchBar({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="relative block min-w-0 flex-1" htmlFor="lead-search">
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
      <input
        id="lead-search"
        className="h-12 w-full rounded-full border border-white/70 bg-white/75 pl-11 pr-4 text-sm font-semibold text-slate-900 shadow-soft outline-none transition focus:border-blue-200 focus:shadow-[0_0_0_5px_rgb(37_99_235_/_10%)]"
        value={value}
        onChange={(event) => {
          onChange(event.target.value)
        }}
        placeholder="Search leads by name or email"
        type="search"
      />
    </label>
  )
}
