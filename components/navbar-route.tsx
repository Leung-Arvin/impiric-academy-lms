"use client";

import { SignedIn, SignedOut, SignInButton, SignOutButton, SignUpButton, useAuth, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { isTeacher} from "@/lib/teacher";

export const NavbarRoutes = () => {
    const {userId} = useAuth();
    const pathname = usePathname();


    const isTeacherPage = pathname?.startsWith("/teacher");
    const isCoursePage = pathname?.includes("/courses");
    const isSearchPage = pathname === "/search"

    return (
        <>
            {isSearchPage && (
                <div className="hidden md:block">
                    <SearchInput />
                </div>
            )}
            <div className="flex gap-x-2 ml-auto">
                {isTeacherPage || isCoursePage ? (
                    <Link href="/">
                    <Button>  
                        <LogOut className="h-4 w-4 mr-2"/>
                        Exit
                    </Button>
                    </Link>
                ): isTeacher(userId) ? (
                    <Link href="/teacher/courses">
                        <Button size="sm" variant="ghost">
                            Teacher Mode
                        </Button>
                    </Link>
                ) : null} 
                
                {!userId ? (
                <div>
                <SignedOut>
                    <SignUpButton mode="modal">
                        <Button>
                            Sign Up
                        </Button>
                    </SignUpButton>
                
                <SignInButton mode="modal">
                    <Button variant="ghost">
                        Sign In
                    </Button>
                </SignInButton>
                </SignedOut>
                
                </div>
                ): (
                    <SignedIn>
                        <SignOutButton  mode="modal">
                        
                        <Button size="sm" variant="ghost">
                        Sign Out
                        </Button>
                        </SignOutButton>
                        <UserButton
                            afterSignOutUrl="/"
                        />
                    </SignedIn>
                    
                )}

            </div>
        </>
    )
}