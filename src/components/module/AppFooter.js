"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiPlus, FiCalendar, FiUser } from "react-icons/fi";
import { VscListSelection } from "react-icons/vsc";
import { useSelectedDay } from "@/providers/DayProvider";

function AppFooter() {
  const pathname = usePathname();
  const { selectedDay } = useSelectedDay();
  const onHome = pathname === "/";
  const onAdd = pathname === "/todos" || pathname === "/add-todo";
  const onCalendar = pathname === "/calendar";
  const onProfile = pathname === "/profile";

  return (
    <nav className="app-footer" aria-label="Main">
      <Link href="/" className={`footer-item${onHome ? " is-active" : ""}`}>
        <FiHome />
        <span>Home</span>
      </Link>
      <Link href="/" className="footer-item">
        <VscListSelection />
        <span>Tasks</span>
      </Link>
      <Link href={`/todos?date=${selectedDay}`} className={`footer-item footer-add${onAdd ? " is-active" : ""}`}>
        <span className="footer-plus">
          <FiPlus />
        </span>
        <span>Add new</span>
      </Link>
      <Link
        href="/calendar"
        className={`footer-item${onCalendar ? " is-active" : ""}`}
      >
        <FiCalendar />
        <span>Calendar</span>
      </Link>
      <Link
        href="/profile"
        className={`footer-item${onProfile ? " is-active" : ""}`}
      >
        <FiUser />
        <span>Profile</span>
      </Link>
    </nav>
  );
}

export default AppFooter;
