import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Main Layout Shell for the JC Notes Academic Platform
 */
export const MainLayout: React.FC<MainLayoutProps> = ({ children, header, footer }) => {
  return (
    <div className="app-shell" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {header && <header className="app-header">{header}</header>}
      <main className="app-main" style={{ flex: 1 }}>
        {children}
      </main>
      {footer && <footer className="app-footer">{footer}</footer>}
    </div>
  );
};

export default MainLayout;
