"use client"

export function Header2({title,subtitle}) {
  return (
    <header className="flex items-center px-4 py-2 border-b border-stone-800 text-[10px] bg-stone-950">
      <div className="text-md font-bold text-amber-500">{title}</div>
    </header>
  )
}
