import "./globals.css";

export const metadata = {
  title: "VeloClear",
  description: "Production-grade Connected Delivery Operating System"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
