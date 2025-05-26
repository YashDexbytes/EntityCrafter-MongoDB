export const getSubdomain = () => {
  // Check if window is defined (i.e., running in a browser)
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_TENANT_DOMAIN!; // or handle accordingly
  }
  const hostname = window.location.hostname;

  // Split the hostname by '.' and remove 'www' if it exists
  const domainParts = hostname.split(".");
  if (domainParts.length > 2) {
    // Return everything before the last two parts (the domain and TLD)
    return domainParts.slice(0, domainParts.length - 2).join(".");
  }

  // If no subdomain exists, return null or an empty string
  return process.env.NEXT_PUBLIC_TENANT_DOMAIN!;
};

export const checkIsTenant = (): boolean => {
  let domainName = getSubdomain();
  if (domainName == process.env.NEXT_PUBLIC_ADMIN_DOMAIN_NAME!) {
    return false;
  } else {
    return true;
  }
};
