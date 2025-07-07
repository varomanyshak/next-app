// app/layout.tsx
import './globals.css';
import Sidebar from './components/Sidebar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-100">{children}</main>
      </body>
    </html>
  );
}
