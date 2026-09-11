import { AppHeader } from "@/components/app/app-header";
import { requireUser } from "@/lib/auth/session";

export default async function ProtectedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  return (
    <div className="min-h-screen bg-background">
      <AppHeader email={user.email ?? "Signed in"} />
      {children}
    </div>
  );
}
