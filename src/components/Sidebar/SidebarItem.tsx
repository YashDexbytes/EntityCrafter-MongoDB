import React from "react";
import Link from "next/link";
import SidebarDropdown from "@/components/Sidebar/SidebarDropdown";
import { usePathname } from "next/navigation";

const SidebarItem = ({ item, pageName, setPageName }: any) => {
  const handleClick = () => {
    if (item.children) {
      const updatedPageName = pageName !== item.label.toLowerCase() ? item.label.toLowerCase() : "";
      setPageName(updatedPageName);
    }
  };

  const pathname = usePathname();

  const isActive = (item: any) => {
    if (item.route === pathname) return true;
    if (item.children) {
      return item.children.some((child: any) => child.route === pathname);
    }
    return false;
  };

  const isItemActive = isActive(item);

  return (
    <li id={`menuItem-${item.label}`}>
      {item.children ? (
        <button
          id={`menuItem-${item.label}-button`}
          onClick={handleClick}
          className={`${
            isItemActive ? "bg-graydark dark:bg-meta-4" : ""
          } group relative flex w-full items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4`}
        >
          {item.icon}
          {item.label}
          <svg
            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
              pageName === item.label.toLowerCase() ? "rotate-180" : ""
            }`}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
              fill=""
            />
          </svg>
        </button>
      ) : (
        <Link
          id={`menuItem-${item.label}-link`}
          href={item.route}
          className={`${
            isItemActive ? "bg-graydark dark:bg-meta-4" : ""
          } group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4`}
        >
          {item.icon}
          {item.label}
        </Link>
      )}

      {item.children && (
        <div
          id={`menuItem-${item.label}-dropdown`}
          className={`translate transform overflow-hidden ${
            pageName !== item.label.toLowerCase() && "hidden"
          }`}
        >
          <ul className="mt-1 flex flex-col gap-1 pl-6">
            {item.children.map((child: any, index: number) => (
              <li key={index}>
                <Link
                  href={child.route}
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-1 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                    pathname === child.route ? "text-white" : ""
                  }`}
                >
                  {child.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

export default SidebarItem;
