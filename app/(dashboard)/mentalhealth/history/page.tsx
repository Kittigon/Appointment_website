'use client'

import { useEffect, useState } from "react"
import type { appointments } from "@prisma/client"
import {
    CalendarDays,
    Clock,
    User2,
    Phone,
    BadgeCheck,
    CheckCircle,
    XCircle,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'
import { toast } from "react-hot-toast"

/* ------------------ Utils ------------------ */
const formatThaiDate = (dateStr: string): string => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        weekday: 'long'
    })
}

/* ------------------ Component ------------------ */
const MentalhealthHistory = () => {
    const [appointments, setAppointments] = useState<appointments[]>([])
    const [loading, setLoading] = useState(true)

    /* ---------- Pagination State ---------- */
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 3  

    useEffect(() => {
        fetchAppointments()
    }, [])

    const fetchAppointments = async () => {
        try {
            const res = await fetch("/api/appointments/my-appointments", {
                cache: "no-store",
                credentials: "include",
            })

            const data: appointments[] = await res.json()

            const filteredAndSorted = data
                .filter(item =>
                    item.status === "COMPLETED" ||
                    item.status === "CANCELLED"
                )
                .sort((a, b) => {
                    const aDate = new Date(`${a.date}T${a.time}`)
                    const bDate = new Date(`${b.date}T${b.time}`)
                    return bDate.getTime() - aDate.getTime()
                })

            setAppointments(filteredAndSorted)
            setCurrentPage(1)
        } catch (error) {
            console.error("โหลดข้อมูลล้มเหลว:", error)
            toast.error("เกิดข้อผิดพลาดในการโหลดข้อมูล")
        } finally {
            setLoading(false)
        }
    }

    /* ------------------ Pagination Logic ------------------ */
    const totalPages = Math.ceil(appointments.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const currentItems = appointments.slice(
        startIndex,
        startIndex + itemsPerPage
    )

    /* ------------------ Status Badge ------------------ */
    const StatusBadge = (status: appointments["status"]) => {
        switch (status) {
            case "COMPLETED":
                return (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                        <CheckCircle size={16} />
                        เสร็จสิ้น
                    </span>
                )
            case "CANCELLED":
                return (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700">
                        <XCircle size={16} />
                        ยกเลิก
                    </span>
                )
            default:
                return null
        }
    }

    const borderStyle = (status: appointments["status"]) => {
        if (status === "COMPLETED") return "border-l-4 border-green-500"
        if (status === "CANCELLED") return "border-l-4 border-red-500"
        return "border-l-4 border-gray-300"
    }

    /* ------------------ Render ------------------ */
    return (
        <>
            {/* Header */}
            <div className="bg-[#B67CDE] w-[300px] h-10 text-white p-10 mt-7 flex items-center justify-center rounded-tr-sm rounded-br-sm shadow-md">
                <h1 className="text-xl font-bold">ประวัติผู้ใช้บริการ</h1>
            </div>

            <section className="py-6 mx-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 mb-3"></div>
                        <p>กำลังโหลดข้อมูล...</p>
                    </div>
                ) : appointments.length === 0 ? (
                    <p className="text-center text-gray-500 mt-10">
                        ยังไม่มีประวัติการนัดหมาย
                    </p>
                ) : (
                    <>
                        {/* List */}
                        <ul className="flex flex-col gap-4 mx-auto">
                            {currentItems.map((item) => (
                                <li
                                    key={item.id}
                                    className={`bg-white shadow-sm rounded-xl p-5 transition hover:shadow-md ${borderStyle(item.status)}`}
                                >
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">

                                        {/* Info */}
                                        <div className="space-y-2 text-sm sm:text-base">
                                            <p className="flex items-center gap-2 text-purple-700 font-semibold">
                                                <User2 size={18} />
                                                {item.name}
                                            </p>
                                            <p className="flex items-center gap-2 text-gray-600">
                                                <BadgeCheck size={16} />
                                                รหัสนัดหมาย: {item.code}
                                            </p>
                                            <p className="flex items-center gap-2 text-gray-600">
                                                <Phone size={16} />
                                                {item.phone}
                                            </p>
                                            <p className="flex items-center gap-2 text-gray-600">
                                                <CalendarDays size={16} />
                                                {formatThaiDate(item.date)}
                                            </p>
                                            <p className="flex items-center gap-2 text-gray-600">
                                                <Clock size={16} />
                                                {item.time} น.
                                            </p>
                                            <p className="text-gray-500">
                                                <span className="font-medium text-gray-700">
                                                    หมายเหตุ:
                                                </span>{" "}
                                                {item.description || "-"}
                                            </p>
                                        </div>

                                        {/* Status */}
                                        <div className="flex md:flex-col items-end gap-2">
                                            {StatusBadge(item.status)}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-8">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="flex items-center gap-1 px-4 py-2 rounded-full border border-purple-300 text-purple-600 hover:bg-purple-50 disabled:opacity-50"
                                >
                                    <ChevronLeft size={18} />
                                    ก่อนหน้า
                                </button>

                                <span className="text-sm font-medium text-gray-600">
                                    หน้า {currentPage} จาก {totalPages}
                                </span>

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="flex items-center gap-1 px-4 py-2 rounded-full border border-purple-300 text-purple-600 hover:bg-purple-50 disabled:opacity-50"
                                >
                                    ถัดไป
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>
        </>
    )
}

export default MentalhealthHistory
