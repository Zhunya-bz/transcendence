import Link from 'next/link';

export default function Footer() {
const current_year = new Date().getFullYear();

return (
  <footer className="mt-auto">
    <div className="min-h-10 border-t border-border bg-muted flex flex-col items-center text-center py-4">
      <div className="flex space-x-6 mb-2">
        <Link href="/files/Privacy_Policy.pdf" target="_blank" className="text-foreground hover:text-orange-600 transition-colors">Privacy Policy</Link>
        <Link href="/files/Terms_of_Service.pdf" target="_blank" className="text-foreground hover:text-orange-600 transition-colors">Terms of Service</Link>
      </div>

      <div className="flex items-center space-x-2 text-muted-foreground">
        <p className='text-sm'>Copyright © {current_year}, Jirok. All rights reserved.</p>
      </div>
    </div>
  </footer>
);
}
