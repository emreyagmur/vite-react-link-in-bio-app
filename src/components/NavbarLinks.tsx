"use client";

export const navbarLinks = [
  {
    id: 0,
    name: "Home",
    href: "/",
  },
  {
    id: 1,
    name: "Profile",
    href: "profile",
  },
  {
    id: 2,
    name: "Ui Kits",
    href: "#",
  },
  {
    id: 3,
    name: "Icons",
    href: "#",
  },
];

const NavbarLinks = () => {
  return (
    <div className="hidden md:flex justify-center items-center col-span-6 gap-x-2">
      {navbarLinks.map((item) => (
        <a
          key={item.id}
          href={item.href}
          className="group flex items-center px-2 py-2 font-medium rounded-md hover:bg-muted hover:bg-opacity-75"
        >
          {item.name}
        </a>
      ))}
    </div>
  );
};

export default NavbarLinks;
