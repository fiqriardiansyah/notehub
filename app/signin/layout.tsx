export default function Layout({ children }: { children: any }) {
  return (
    <div className="w-full min-h-screen flex items-center justify-center container mx-auto">
      {children}
    </div>
  );
}
