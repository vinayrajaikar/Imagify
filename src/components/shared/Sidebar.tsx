'use client'

import { navLinks } from '@/constants';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { Button } from '../ui/button';

const Sidebar = () => {
    const pathname = usePathname();
  return (
    <aside className='hidden h-screen w-72 bg-white p-5 shadow-md shadow-purple-200/50 lg:flex flex-col'>
      <div className='flex size-full flex-col gap-4 w-64 h-auto'>
        <Link href="/" className='flex items-center gap-2 md:py-5 w-48'>
          <Image src="/assets/images/logo-text.svg" alt="logo" width={180} height={28} unoptimized />
        </Link>
      </div>

      <nav className='h-full flex-col justify-between md:flex md:gap-4'>
        <SignedIn>
            <ul className='hidden w-full flex-col items-start gap-2 md:flex'>
                {navLinks.map((link)=>{
                    const isActive = link.route === pathname

                    return (
                        <li key={link.route} className={`flex-center p-16-semibold w-full whitespace-nowrap rounded-full bg-cover  transition-all hover:bg-[#7068fc] hover:text-white  hover:shadow-inner ${isActive?'bg-purple-gradient':'text-gray-700'} `}>
                            <Link className='p-16-semibold flex size-full gap-4 p-4' href={link.route} >
                                <Image 
                                    src={link.icon}
                                    alt='logo'
                                    width={24}
                                    height={24}
                                    className={`${isActive ? 'brightness-200' : 'brightness-100'} `}
                                />
                                {link.label}
                            </Link>
                        </li>
                    )
                })}

                <li className='flex justify-center items-center cursor-pointer gap-2 p-4'>
                    <UserButton afterSignOutUrl='/' showName/>
                </li>
            </ul>
        </SignedIn>

        <SignedOut>
            <Button asChild className="button bg-[#7068fc] bg-cover">
                <Link href="/sign-in">Login</Link>
            </Button>
        </SignedOut>
      </nav>
    </aside>
  );
};

export default Sidebar;
