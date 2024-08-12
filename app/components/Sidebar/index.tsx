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
    // { title: 'Dashboard', icon: <HomeIcon />, to: '/dashboard' },
    { title: 'Users', icon: <UsersIcon />, to: '/dashboard/users' },
    { title: 'Tags', icon: <TagIcon />, to: '/dashboard/tags' },
    { title: 'News', icon: <NewsIcon />, to: '/dashboard/news' },
    { title: 'RSS', icon: <PuzzleIcon />, to: '/dashboard/rss' },
    { title: 'Ads', icon: <AdsIcon />, to: '/dashboard/ads' },
    // { title: 'Settings', icon: <SettingsIcon />, to: '/dashboard/settings' },
  ];

  return (
    <>
      <nav className="fixed top-0  w-full bg-white border-b-2 border-gray-200 ">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="flex items-center">
              <div className="flex items-center ms-3">
                <div>
                  <Link
                    to={'/logout'}
                    className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100  group"
                  >
                    <LogoutIcon />
                    <span className="ms-4 hidden md:block lg:block">
                      Logout
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

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
          <ul className="content-between space-y-2 font-medium text-lg">
            <div className="space-y-2 font-medium text-lg">
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
            </div>
          </ul>
        </div>
      </aside>
    </>
  );
}
