import { HomeIcon } from '~/icons/HomeIcon';
import { UsersIcon } from '~/icons/UsersIcon';
import { TagIcon } from '~/icons/TagIcon';
import { NewsIcon } from '~/icons/NewsIcon';
import { PuzzleIcon } from '~/icons/PuzzleIcon';
import { AdsIcon } from '~/icons/AdsIcon';
import { SettingsIcon } from '~/icons/SettingsIcon';
import { LogoutIcon } from '~/icons/LogoutIcon';
import { Link, useNavigate } from '@remix-run/react';

export function Sidebar() {
  const navigate = useNavigate();

  const menu = [
    { title: 'Dashboard', icon: <HomeIcon />, to: '/dashboard' },
    { title: 'Users', icon: <UsersIcon />, to: '/dashboard/users' },
    { title: 'Tags', icon: <TagIcon />, to: '/dashboard/tags' },
    { title: 'News', icon: <NewsIcon />, to: '/dashboard/news' },
    { title: 'RSS', icon: <PuzzleIcon />, to: '/dashboard/rss' },
    { title: 'Ads', icon: <AdsIcon />, to: '/dashboard/ads' },
    { title: 'Settings', icon: <SettingsIcon />, to: '/dashboard/settings' },
    { title: 'Logout', icon: <LogoutIcon />, to: '/logout' },
  ];

  return (
    <aside
      id="default-sidebar"
      className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-indigo-600">
        <div className="flex h-16 shrink-0 items-center ml-4">
          <img
            src="https://tailwindui.com/img/logos/mark.svg?color=white"
            alt="Your Company"
            className="h-8 w-auto"
          />
        </div>
        <ul className="space-y-2 font-medium text-lg">
          {menu.map((item, idx) => (
            <li key={idx}>
              <Link
                to={item.to}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-indigo-700 group"
              >
                {item.icon}
                <span className="ms-4">{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
