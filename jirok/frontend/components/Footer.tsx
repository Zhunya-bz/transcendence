import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';  // Import FontAwesome (or use a CDN in HTML if you prefer)
import Link from 'next/link';

export default function Footer() {
const current_year = new Date().getFullYear();

return (
  <footer>
    <div className="min-h-10 bg-blue-300 flex flex-col items-center text-center py-4">
      <div className="flex space-x-6 mb-2">
        <Link href="/files/privacy-policy.txt" target="_blank" className="text-gray-900 hover:text-blue-700 transition-colors">Privacy Policy</Link>
        <Link href="/files/terms.txt" target="_blank" className="text-gray-900 hover:text-blue-700 transition-colors">Terms of Service</Link>
      </div>

      <div className="flex items-center space-x-2 text-gray-700">
        <p>Copyright © {current_year}, Jirok. All rights reserved.</p>
      </div>
    </div>
  </footer>
);
}