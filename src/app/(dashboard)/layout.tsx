import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { Component } from "react";


export default function DashboardLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return <div className="h-screen flex">

    {/* Left */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] overflow-scroll">

        <Link href="/" className="flex items-center justify-center lg:justify-start gap-1 py-2 mx-4 mt-2">
           <Image src="/logo.png" alt="logo" width={32} height={32}/>
           <span className="hidden lg:block font-bold text-purple-950">LYNX Academy</span>
        </Link>
        <Menu/>
      </div>
    
    {/* Right */}
      <div className="w-[92%] md:w-[92%] lg:w-[100%] xl:w-[100%] bg-[#F7F8FA] overflow-scroll ">
        <Navbar/>
   

        {children}
     
      
    

      </div>
    
    </div>
  }

  