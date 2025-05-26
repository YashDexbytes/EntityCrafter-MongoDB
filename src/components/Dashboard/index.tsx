import Image from "next/image";
import Link from "next/link";
import { checkIsTenant } from "@/utils/isTenant";
import React, { useState, useEffect } from "react";

const Dashboard = () => {
  const [isTenant, setIsTenant] = useState(false);
  useEffect(() => {
    setIsTenant(checkIsTenant());
  }, []);

  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-black dark:text-white mb-5">
          Welcome to SiteWeaver
        </h2>
        <Image
          className="dark:hidden"
          src="/images/SiteWeaver-Dashboard.svg"
          alt="Logo"
          width={400}
          height={200}
        />
      </div>
    </div>
  );
};

export default Dashboard;
