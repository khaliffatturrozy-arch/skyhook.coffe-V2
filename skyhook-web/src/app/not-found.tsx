import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#16110D" }}>
      <div className="text-center max-w-md px-6">
        <h2 className="text-lg font-semibold mb-2" style={{ color: "#F8F2E9" }}>Page not found</h2>
        <p className="text-sm mb-4" style={{ color: "rgba(248,242,233,0.5)" }}>
          The page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2 rounded-xl text-sm font-semibold transition-colors"
          style={{ background: "linear-gradient(135deg, #C8A96A, #A68B4E)", color: "#16110D" }}
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
