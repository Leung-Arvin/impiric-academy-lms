"use client";
import { BarChart, Compass, Layout, List } from "lucide-react";
import { SiderbarItem } from "./siderbar-item";
import { usePathname } from "next/navigation";

const guestRoutes = [
    {
        icon: Layout,
        label: "Dashboard",
        href: "/",
    },
    {
        icon: Compass,
        label: "Browse",
        href: "/search",
    },
]

const teacherRoutes = [
    {
        icon: List,
        label: "Courses",
        href: "/teacher/courses",
    }
]
export const SiderbarRoutes = () => {
    const pathname = usePathname();
    const isTeacherPage = pathname?.includes("/teacher");
    const routes = isTeacherPage ? teacherRoutes:guestRoutes;
    return(
        <div className ="flex flex-col w-full">
            {routes.map((route) => (
                <SiderbarItem
                    key= {route.href}
                    icon = {route.icon}
                    label = {route.label}
                    href = {route.href}               
                />
            ))}
        </div>
    )
}