import Link from "next/link"

const card = {
  width: "100%",
  maxWidth: "400px",
  backgroundColor: "white",
  padding: "2rem",
  borderRadius: "8px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
} as const

type SearchParams = Promise<{ token?: string; error?: string }>

const errorText: Record<string, string> = {
  missing_token: "Reset link is invalid. Request a new one from Forgot password.",
  weak: "Password must be at least 8 characters.",
  mismatch: "Passwords do not match.",
  invalid: "This reset link is invalid or has expired. Request a new one.",
  server: "Something went wrong. Try again.",
}

export default async function ResetPasswordPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const token = params.token?.trim() ?? ""
  const errKey = params.error
  const errMsg = errKey ? errorText[errKey] ?? "Unable to reset password." : null

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
            <span style={{ marginLeft: "8px" }}>New password</span>
          </h1>
          <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>Choose a new password for your admin account.</p>
        </div>

        {!token && !errMsg ? (
          <p style={{ color: "#991b1b", fontSize: "0.875rem", marginBottom: "1rem" }}>
            Open the link from your email, or use Forgot password to request a new one.
          </p>
        ) : null}

        {errMsg ? (
          <div style={{ marginBottom: "1rem", padding: "0.75rem", backgroundColor: "#fef2f2", borderRadius: "6px", fontSize: "0.875rem", color: "#991b1b" }}>
            {errMsg}
          </div>
        ) : null}

        {token ? (
          <form action="/api/auth/reset-password" method="POST">
            <input type="hidden" name="token" value={token} />

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>
                New password
              </label>
              <input
                type="password"
                name="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>
                Confirm password
              </label>
              <input
                type="password"
                name="confirm"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Repeat new password"
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
              Update password
            </button>
          </form>
        ) : null}

        <div style={{ marginTop: "1rem", textAlign: "center", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <Link href="/login/forgot-password" style={{ color: "#2563eb", fontSize: "0.875rem", textDecoration: "none" }}>
            Forgot password
          </Link>
          <Link href="/login" style={{ color: "#6b7280", fontSize: "0.875rem", textDecoration: "none" }}>
            ← Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
