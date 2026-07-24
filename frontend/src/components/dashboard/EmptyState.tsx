import { Plus, Sparkles } from 'lucide-react'
import { Button } from '../Button'

export function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="grid place-items-center px-6 py-16 text-center">
      <div className="grid size-20 place-items-center rounded-[28px] bg-blue-50 text-primary">
        <Sparkles className="size-8" />
      </div>
      <h3 className="mt-6 text-2xl font-bold text-slate-950">No leads yet</h3>
      <p className="mt-3 max-w-md text-sm font-medium leading-7 text-slate-500">
        Your first lead will appear here with status controls, search, and activity history.
      </p>
      <Button className="mt-6" type="button" onClick={onCreate}>
        <Plus className="size-4" />
        Add First Lead
      </Button>
    </div>
  )
}
