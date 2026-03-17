"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@repo/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu"

export function ThemeToggle() {
    const { setTheme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9 rounded-full bg-white text-black border-white/10 hover:bg-white/90 dark:bg-[#1a1a1a] dark:text-white dark:border-[#333] dark:hover:bg-[#2a2a2a]">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="dark:bg-[#1a1a1a] dark:border-[#333] dark:text-white bg-white border-gray-200">
                <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer dark:focus:bg-[#2a2a2a] focus:bg-gray-100">
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer dark:focus:bg-[#2a2a2a] focus:bg-gray-100">
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer dark:focus:bg-[#2a2a2a] focus:bg-gray-100">
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
