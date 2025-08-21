export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-white/70 backdrop-blur-sm">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-black/20 border-t-black" aria-label="Loading" />
    </div>
  )
}
