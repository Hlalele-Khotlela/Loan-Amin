'use client'

import { text } from "stream/consumers"

type FabProps = {
  onClick: () => void
  text: string
}

export default function FloatingActionButton({ onClick, text }: FabProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 h-14 w-40 rounded bg-blue-600 text-white shadow-lg hover:bg-blue-700"
    >
      {/* {icon ?? '+'} */}
      {text}
    </button>
  )
}