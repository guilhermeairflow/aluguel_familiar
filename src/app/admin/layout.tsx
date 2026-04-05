'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import styles from './layout.module.css';
import { AuthProvider } from './providers';

const NAV_ITEMS = [
  { icon: '📊', label: 'Dashboard', href: '/admin' },
  { icon: '🏠', label: 'Imóveis', href: '/admin/properties' },
  { icon: '📅', label: 'Calendário & Reservas', href: '/admin/calendar' },
  { icon: '👥', label: 'CRM de Clientes', href: '/admin/clients' },
  { icon: '📝', label: 'Leads & Consultas', href: '/admin/inquiries' },
  { icon: '💰', label: 'Gestão de Preços', href: '/admin/pricing' },
  { icon: '⭐', label: 'Avaliações', href: '/admin/reviews' },
  { icon: '⚙️', label: 'Configurações', href: '/admin/settings' },
];

function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  const groups = [
    { label: 'Gestão', items: NAV_ITEMS.slice(0, 3) },
    { label: 'Comercial', items: NAV_ITEMS.slice(3, 7) },
    { label: 'Sistema', items: NAV_ITEMS.slice(7) },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <>
      {open && <div className={styles.overlay} onClick={onClose} />}
      <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
        <div className={styles.sidebarLogo}>
          <div className={styles.sidebarLogoText}>AluguelFamiliar.</div>
          <div className={styles.sidebarLogoSub}>Painel Administrativo</div>
        </div>

        <nav className={styles.sidebarNav}>
          {groups.map(group => (
            <div key={group.label} className={styles.navSection} style={{ marginBottom: 20 }}>
              <div className={styles.navSectionTitle}>{group.label}</div>
              {group.items.map(item => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`${styles.navItem} ${isActive(item.href) ? styles.active : ''}`}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  {item.label}
                </a>
              ))}
            </div>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            style={{ display: 'block', textAlign: 'center', color: '#2563eb', fontWeight: 600, fontSize: '0.85rem', padding: '8px', marginBottom: 8, textDecoration: 'none' }}
          >
            🌐 Ver site ao vivo
          </a>
          <button className={styles.logoutBtn} onClick={handleLogout}>🚪 Sair</button>
        </div>
      </aside>
    </>
  );
}

function AdminContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoginPage = pathname.startsWith('/admin/login');

  useEffect(() => {
    if (status === 'unauthenticated' && !isLoginPage) {
      router.replace('/admin/login');
    }
  }, [status, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', marginBottom: 6 }}>
            Aluguel<span style={{ color: '#2563eb' }}>Familiar</span>
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Verificando acesso...</div>
        </div>
      </div>
    );
  }

  const currentNav = NAV_ITEMS.find(n => {
    if (n.href === '/admin') return pathname === '/admin';
    return pathname.startsWith(n.href);
  });

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className={styles.mainContent}>
        <div className={styles.topbar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              className={styles.menuBtn}
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div>
              <div className={styles.topbarTitle}>{currentNav?.label ?? 'Painel'}</div>
              <div className={styles.topbarSub}>AluguelFamiliar · Gestão</div>
            </div>
          </div>
          <span className={styles.adminBadge}>👤 {session?.user?.name || 'Admin'}</span>
        </div>

        <div className={styles.pageContent}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminContent>{children}</AdminContent>
    </AuthProvider>
  );
}
