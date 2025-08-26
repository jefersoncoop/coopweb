// app/(main)/layout.tsx
import Navbar from "@/components/Navbar"; // O '@' é um atalho para a raiz do projeto
import '@/src/app/globals.css';
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>  
    <div>
      <Navbar />
      <main style={{ padding: '20px' }}>
        {children}
      </main>
    </div>
    </body>
    </html>
  );
}