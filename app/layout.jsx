import { IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-sans',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-ibm-plex-mono',
});

export const metadata = {
  title: 'LeadFlow CRM',
  description: 'Gerenciador de Leads — 100% client-side, dados salvos localmente.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${ibmPlexSans.variable} ${ibmPlexMono.variable}`}>
      <body style={{ backgroundColor: '#0C0C0F', fontFamily: 'var(--font-ibm-plex-sans, sans-serif)' }}>
        {children}
      </body>
    </html>
  );
}
