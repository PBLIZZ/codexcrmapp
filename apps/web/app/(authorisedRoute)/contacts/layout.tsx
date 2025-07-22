export default function ContactsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex-1 flex flex-col min-h-0'>
      {/* Container that allows vertical scrolling but constrains horizontal overflow */}
      <div className='flex-1 overflow-y-auto overflow-x-hidden'>{children}</div>
    </div>
  );
}
