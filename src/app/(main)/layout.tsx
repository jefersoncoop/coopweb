// app/(main)/layout.tsx (Versão Final Corrigida)

import Navbar from "@/components/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <main style={{ padding: '20px' }}>
        {children}
      </main>
    </div>
  );
}