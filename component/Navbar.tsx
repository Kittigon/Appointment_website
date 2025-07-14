'use client'
import { useState } from 'react'
import Link from "next/link"
import Image from "next/image"
import { Settings, Lock, Menu } from 'lucide-react'

const Navbar = () => {
    const role: string = "user" 
    const [menuOpen, setMenuOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false)

    return (
        <main>
            <div className="bg-[#8D38C9] w-screen h-8"></div>
            <div className="bg-[#E6E6E6] px-4 md:px-7 py-4">
                <nav className="flex justify-between items-center">
                    {/* LOGO */}
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            className="rounded-full"
                            src="/ตรามหาลัยพะเยา.png"
                            height={40}
                            width={40}
                            alt="Logo"
                        />
                        
                    </Link>

                    {/* Mobile Hamburger */}
                    <div className="md:hidden">
                        <button onClick={() => setMenuOpen(!menuOpen)}>
                            <Menu />
                        </button>
                    </div>

                    {/* Desktop Menu */}
                    <ul className="hidden md:flex gap-10 text-black items-center">
                        {role === "user" && (
                            <>
                                <li><Link href="/user/appointment" className="hover:underline">ตารางนัดหมาย</Link></li>
                                <li><Link href="/user/history" className="hover:underline">ประวัติการนัดหมาย</Link></li>
                            </>
                        )}
                        {role === "mentalhealth" && (
                            <>
                                <li><Link href="/mentalhealth/appointment" className="hover:underline">ปฏิทินการนัดพบ</Link></li>
                                <li><Link href="/mentalhealth/evaluations" className="hover:underline">ตรวจสอบแบบประเมิน</Link></li>
                                <li><Link href="/mentalhealth/history" className="hover:underline">ประวัติบุคลากร</Link></li>
                            </>
                        )}
                        {role === "admin" && (
                            <>
                                <li><Link href="/admin/dashboard" className="hover:underline">Dashboard</Link></li>
                                <li><Link href="/admin/manage" className="hover:underline">จัดการผู้ใช้</Link></li>
                            </>
                        )}
                        <li><Link href="/"><Lock /></Link></li>

                        {/* Dropdown Settings */}
                        <li className="relative pt-2">
                            <button onClick={() => setDropdownOpen(!dropdownOpen)}>
                                <Settings />
                            </button>
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                    <ul className="text-sm text-gray-700">
                                        <li>
                                            <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">โปรไฟล์</Link>
                                        </li>
                                        <li>
                                            <Link href="/change-password" className="block px-4 py-2 hover:bg-gray-100">เปลี่ยนรหัสผ่าน</Link>
                                        </li>
                                        <li>
                                            <Link href="/logout" className="block px-4 py-2 hover:bg-gray-100 text-red-600">ออกจากระบบ</Link>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </li>
                    </ul>
                </nav>

                {/* Mobile Menu Dropdown */}
                {menuOpen && (
                    <div className="md:hidden mt-4 space-y-2 text-left">
                        {role === "user" && (
                            <>
                                <Link href="/user/appointment" className="block hover:underline">ตารางนัดหมาย</Link>
                                <Link href="/user/history" className="block hover:underline">ประวัติการนัดหมาย</Link>
                            </>
                        )}
                        {role === "mentalhealth" && (
                            <>
                                <Link href="/mentalhealth/appointment" className="block hover:underline">ปฏิทินการนัดพบ</Link>
                                <Link href="/mentalhealth/evaluations" className="block hover:underline">ตรวจสอบแบบประเมิน</Link>
                                <Link href="/mentalhealth/history" className="block hover:underline">ประวัติบุคลากร</Link>
                            </>
                        )}
                        {role === "admin" && (
                            <>
                                <Link href="/admin/dashboard" className="block hover:underline">Dashboard</Link>
                                <Link href="/admin/manage" className="block hover:underline">จัดการผู้ใช้</Link>
                            </>
                        )}
                        <div className=" gap-4 mt-2">
                            <Link href="/" className='block mt-2'>ล็อคอิน</Link>
                            
                        <div className="mt-2">
                            <button
                                onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                                className="block w-full text-left hover:underline "
                            >
                                ตั้งค่า ▾
                            </button>

                            {mobileDropdownOpen && (
                                <div className="ml-4 mt-1 space-y-1 text-sm">
                                    <Link href="/profile" className="block hover:underline">โปรไฟล์</Link>
                                    <Link href="/change-password" className="block hover:underline">เปลี่ยนรหัสผ่าน</Link>
                                    <Link href="/logout" className="block hover:underline text-red-600">ออกจากระบบ</Link>
                                </div>
                            )}
                        </div>
                        </div>
                    </div> 
                )}
            </div>
        </main>
    )
}

export default Navbar
