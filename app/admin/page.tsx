import AdminGuard from "@/components/AdminGuard";

export default function AdminPage() {
  return (
    <AdminGuard>
      <div style={{ padding: "2rem", fontFamily: "inherit" }}>Welcome to Admin Dashboard</div>
    </AdminGuard>
  );
}
