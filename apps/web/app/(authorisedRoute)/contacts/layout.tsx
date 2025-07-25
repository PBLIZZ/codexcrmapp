export default function ContactsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex-1 flex flex-col min-h-0'>
      {/* Remove overflow properties - let MainLayout handle scrolling */}
      <div className='flex-1'>{children}</div>
    </div>
  );
}
