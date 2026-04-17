import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/ui/error-boundary";

export const metadata: Metadata = {
  title: 'SavdoBot - AI POS Sistema',
  description: 'Sovremennaya POS-sistema s AI-assistentom dlya biznesa v Uzbekistane',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ErrorBoundary
          onError={(error, errorInfo) => {
            // Log errors to console in development
            if (process.env.NODE_ENV === "development") {
              console.error("Layout Error Boundary:", error, errorInfo);
            }
            // In production, send to error reporting service
            if (process.env.NODE_ENV === "production") {
              // Example: Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
            }
          }}
        >
          {children}
          <Toaster />
        </ErrorBoundary>
      </body>
    </html>
  );
}