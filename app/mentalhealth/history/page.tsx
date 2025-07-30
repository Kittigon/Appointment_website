'use client'
import { useState, useEffect } from "react"
import type { appointments } from "@prisma/client"
import { CalendarDays, Clock, User2, Phone, BadgeCheck } from 'lucide-react'

const formatThaiDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        weekday: 'long'
    });
};

const MentalhealthHistory = () => {
    const [appointments, setAppointments] = useState<appointments[]>([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments()
    }, [])

    const fetchAppointments = async () => {
        try {
            const res = await fetch(`/api/userappointment`)
            const data: appointments[] = await res.json()
            setAppointments(data)
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการโหลดข้อมูล:', error)
        }

        setLoading(false);
    }

    return (
        <>
            <div className="bg-[#B67CDE] w-[300px] h-10 text-white p-10 mt-7 flex items-center justify-center rounded-tr-sm rounded-br-sm">
                <h1 className="text-xl font-bold">ประวัติการนัดหมาย</h1>
            </div>

            <section className="py-6 mx-4">
                {loading ? (
                    <p className="text-center text-gray-500">กำลังโหลด...</p>
                ) : appointments.length === 0 ? (
                    <p className="text-center text-gray-500">ยังไม่มีประวัติการนัดหมาย</p>
                ) : (
                    <ul className="flex flex-col gap-4">
                        {appointments.map((item) => (
                            <li
                                key={item.id}
                                className="bg-white shadow-md border border-gray-200 p-5 rounded-xl w-full"
                            >
                                <div className="text-sm sm:text-base space-y-2">
                                    <div className="flex items-center gap-2 text-purple-700 font-semibold">
                                        <User2 size={18} />
                                        <span>ชื่อผู้ใช้: {item.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <BadgeCheck size={18} />
                                        <span>รหัสนัดหมาย: {item.code}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Phone size={18} />
                                        <span>เบอร์โทร: {item.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <CalendarDays size={18} />
                                        <span>วันที่: {formatThaiDate(item.date)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Clock size={18} />
                                        <span>เวลา: {item.time}</span>
                                    </div>
                                    <div className="flex items-start justify-between mt-2">
                                        <p className="text-gray-600 break-words">
                                            <span className="font-medium">หมายเหตุ: </span>{item.description || '-'}
                                        </p>
                                        <p className="text-sm">
                                            <strong>สถานะ:</strong>
                                            <span className="text-green-600 font-semibold ml-1">สำเร็จ</span>
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </>
    )
}
export default MentalhealthHistory
