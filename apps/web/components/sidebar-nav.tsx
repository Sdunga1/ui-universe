import { getRegistryByCategory } from "../lib/registry";
import { SidebarNavClient } from "./sidebar-nav-client";

export function SidebarNav() {
  const byCategory = getRegistryByCategory();
  return <SidebarNavClient byCategory={byCategory} />;
}
