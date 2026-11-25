export const isNavPathActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);
