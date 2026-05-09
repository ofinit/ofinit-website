import Link from "next/link"

const card = {
  width: "100%",
  maxWidth: "400px",
  backgroundColor: "white",
  padding: "2rem",
  borderRadius: "8px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
} as const

type SearchParams = Promise<{ sent?: string; error?: string }>

export default async function ForgotPasswordPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f3f4f6",
        padding: "1rem",
      }}
    >
      <div style={card}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "#2563eb" }}>{"<"}</span>
            <span>OfinIT</span>
            <span style={{ color: "#2563eb" }}>{"/>"}</span>
            <span style={{ marginLeft: "8px" }}>Forgot password</span>
          </h1>
          <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
            Enter your admin email. If an account exists, we will send a reset link when email is configured.
          </p>
        </div>

        {params.sent === "1" ? (
          <div style={{ marginBottom: "1rem", padding: "0.75rem", backgroundColor: "#ecfdf5", borderRadius: "6px", fontSize: "0.875rem", color: "#065f46" }}>
            If that email matches an admin account, check your inbox for a reset link. The link expires in one hour.
          </div>
        ) : null}

        {params.error === "missing" ? (
          <div style={{ marginBottom: "1rem", padding: "0.75rem", backgroundColor: "#fef2f2", borderRadius: "6px", fontSize: "0.875rem", color: "#991b1b" }}>
            Please enter your email address.
          </div>
        ) : null}

        {params.error === "server" ? (
          <div style={{ marginBottom: "1rem", padding: "0.75rem", backgroundColor: "#fef2f2", borderRadius: "6px", fontSize: "0.875rem", color: "#991b1b" }}>
            Something went wrong. Try again later.
          </div>
        ) : null}

        <form action="/api/auth/forgot-password" method="POST">
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>
              Email address
            </label>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                fontSize: "0.875rem",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "0.875rem",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            Send reset link
          </button>
        </form>

        <div style={{ marginTop: "1rem", textAlign: "center", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <Link href="/login" style={{ color: "#2563eb", fontSize: "0.875rem", textDecoration: "none" }}>
            ← Back to sign in
          </Link>
          <Link href="/" style={{ color: "#6b7280", fontSize: "0.875rem", textDecoration: "none" }}>
            ← Back to Website
          </Link>
        </div>
      </div>
    </div>
  )
}
