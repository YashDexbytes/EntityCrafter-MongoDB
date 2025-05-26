import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarDropdown = ({ item }: any) => {
  const pathname = usePathname();

  return (
    <>
      <ul
        id={`menuItem-${item.label}-dropdown-items`}
        className="flex flex-col gap-1.5 pl-6"
      >
        {item.map((item: any, index: number) => (
          <li id={`menuItem-${item.label}-dropdown-item-${index}`} key={index}>
            <Link
              id={`menuItem-${item.label}-dropdown-item-${index}-link`}
              href={item.route}
              className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
                pathname === item.route ? "text-white" : ""
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default SidebarDropdown;
