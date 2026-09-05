import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  LayoutDashboard,
  Map,
  MessageSquare,
  Network,
  PenLine,
  Settings2,
  Trophy,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const SIDEBAR_NAV: NavItem[] = [
  { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
  { href: "/dashboard/library", label: "Biblioteca", icon: BookOpen },
  { href: "/dashboard/chat", label: "Chat", icon: MessageSquare },
  { href: "/dashboard/path", label: "Ruta PDF", icon: Map },
  { href: "/dashboard/deep-learning/notes", label: "Notas humanas", icon: PenLine },
  { href: "/dashboard/deep-learning/graph", label: "Grafo de ideas", icon: Network },
  { href: "/dashboard/rank", label: "Rango", icon: Trophy },
];

export const MOBILE_TABS: NavItem[] = [
  { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
  { href: "/dashboard/library", label: "Biblioteca", icon: BookOpen },
  { href: "/dashboard/chat", label: "Chat", icon: MessageSquare },
  { href: "/dashboard/deep-learning/notes", label: "Notas", icon: PenLine },
  { href: "/dashboard/deep-learning/graph", label: "Grafo", icon: Network },
];

export const MORE_LINKS: NavItem[] = [
  { href: "/dashboard/path", label: "Ruta PDF", icon: Map },
  { href: "/dashboard/rank", label: "Rango", icon: Trophy },
  { href: "/dashboard/settings", label: "Ajustes", icon: Settings2 },
];

export function navActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}
