"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#16110D" }}>
      <div className="text-center max-w-md px-6">
        <h2 className="text-lg font-semibold mb-2" style={{ color: "#F8F2E9" }}>Something went wrong</h2>
        <p className="text-sm mb-4" style={{ color: "rgba(248,242,233,0.5)" }}>
          {error.message || "An unexpected error occurred"}
        </p>
        <button
          onClick={reset}
          className="px-6 py-2 rounded-xl text-sm font-semibold transition-colors"
          style={{ background: "linear-gradient(135deg, #C8A96A, #A68B4E)", color: "#16110D" }}
        >
          Try again
        </button>
      </div>
    </div>
  )
}
