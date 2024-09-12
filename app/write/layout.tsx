export default function Layout({ children }: { children: any }) {
    return (
        <div className="w-screen overflow-x-hidden">
            {children}
        </div>
    );
}
