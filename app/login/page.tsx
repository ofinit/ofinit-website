export default function LoginPage() {
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
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
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
            <span style={{ marginLeft: "8px" }}>Admin</span>
          </h1>
          <p style={{ color: "#6b7280" }}>Sign in to access the admin panel</p>
        </div>

        <form action="/api/auth/login" method="POST">
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="admin@ofinit.com"
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
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="Enter your password"
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
            Sign In
          </button>

          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <a href="/" style={{ color: "#6b7280", fontSize: "0.875rem", textDecoration: "none" }}>
              ← Back to Website
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
