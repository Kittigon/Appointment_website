'use client';
import { useEffect, useState } from "react";

// กำหนดเวลาในแต่ละวัน
// สามารถปรับเปลี่ยนได้ตามต้องการ
const time = ["10:00", "11:00", "13:00", "14:00"];

// ฟังก์ชันสำหรับสร้างวันที่ถัดไป 7 วัน
const getNext7Weekdays = (): string[] => {
    const days: string[] = [];
    let date = new Date();

    while (days.length < 7) {
        const day = date.getDay();
        if (day !== 0 && day !== 6) { // ไม่เอาอาทิตย์(0) และเสาร์(6)
            const dateStr = date.toISOString().split('T')[0]; // 'yyyy-mm-dd'
            days.push(dateStr);
        }
        date.setDate(date.getDate() + 1);
    }

    return days;
};

const date = getNext7Weekdays();

// สร้างสถานะเริ่มต้นสำหรับวันที่และเวลา
// โดยเริ่มต้นให้ทุกวันและเวลาว่าง (true)
const initStatus: Record<string, Record<string, boolean>> = {};
date.forEach(date => {
    initStatus[date] = {};
    time.forEach(time => {
        initStatus[date][time] = true;
    });
});

// สำหรับแปลง yyyy-mm-dd → "4 ก.ค. 2025"
const formatThaiDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'long',
        year: '2-digit',
        weekday: 'short'
    });
};

type User = {
    id: number;
    email: string;
    name: string
    role: "USER" | "MENTALHEALTH" | "ADMIN";
}


const UserAppointment = () => {
    const [status, setStatus] = useState(initStatus);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [phone, setPhone] = useState("");
    const [description, setdescription] = useState('');

    const [data, setData] = useState<User | null>(null)

    //โหลดข้อมูลการนัดหมาย
    useEffect(() => {
        FetchAppoinment();
        FecthUser();
    }, [])

    const FetchAppoinment = async () => {
        try {
            const res = await fetch('/api/appointment');
            const data = await res.json();
            // console.log(data)

            const newstatus: typeof initStatus = { ...initStatus };

            data.showAppoinment.forEach((appoint: any) => {
                if (newstatus[appoint.date]) {
                    newstatus[appoint.date][appoint.time] = false;
                }
            });

            setStatus(newstatus)

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("Load Appoinment Failed : ", error.message)
            } else {
                console.log("Unknow error in Load Appoinment  !", error)
            }
        }
    }

    const FecthUser = async () => {
        try {
            const res = await fetch('/api/token', {
                method: 'GET',
                credentials: "include",
            });

            const data = await res.json();
            // console.log("Data:", data);

            if (res.ok) {
                setData(data.user);
            }
            // } else {
            //     console.log("ไม่พบ token หรือ token ไม่ถูกต้อง:", data.message);
            // }
        } catch (error) {
            console.log("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:", error);
        }
    }

    // ฟังก์ชันสำหรับจัดการการเลือกวันและเวลา
    // ถ้าวันและเวลาเลือกได้ (ว่าง) จะอัปเดตสถาน 
    // ถ้าไม่ว่างจะไม่ทำอะไร
    // และจะไม่อัปเดต selectedDate และ selectedTime   
    const handleSelect = (date: string, time: string) => {
        if (!status[date][time]) return;

        const checkDay = new Date(date).getDay();
        if (checkDay === 0 || checkDay === 6) {
            alert("ไม่สามารถจองวันเสาร์-อาทิตย์ได้");
            return;
        }

        // เช็คเวลาปัจจุบัน + 2 ชั่วโมง
        const now = new Date();
        const [hour, minute] = time.split(":").map(Number);
        const selected = new Date(date);
        selected.setHours(hour, minute, 0, 0);

        // ถ้าเวลาที่เลือกน้อยกว่าเวลาปัจจุบัน + 2 ชั่วโมง ไม่ให้เลือก
        const minDiffMs = 2 * 60 * 60 * 1000; // 2 ชั่วโมง
        if (selected.getTime() - now.getTime() < minDiffMs) {
            alert("กรุณาเลือกเวลาล่วงหน้าอย่างน้อย 2 ชั่วโมง");
            return;
        }

        setSelectedDate(date);
        setSelectedTime(time);
    };

    // ฟังก์ชันสำหรับบันทึกข้อมูลการนัดหมาย
    // จะตรวจสอบว่ามีการเลือกวันและเวลา และกรอกข้อมูลครบถ้วนหรือไม่
    // ถ้าครบจะอัปเดตสถานะเป็นไม่ว่าง (false)
    // และแสดงข้อความแจ้งเตือนการจองสำเร็จ
    const handleSave = async () => {
        try {
            if (!selectedDate || !selectedTime) return alert("กรุณาเลือกวันและเวลาก่อน");
            if (!name || !code || !phone) return alert("กรุณากรอกข้อมูลให้ครบ");

            const userId = data?.id ;

            const payload = {
                userId,
                name,
                code,
                phone,
                description,
                date: selectedDate,
                time: selectedTime
            }

            const res = await fetch('/api/appointment', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })

            // ปรับสถานะเป็นไม่ว่าง
            if (res.ok) {
                setStatus(prev => ({
                    ...prev,
                    [selectedDate]: {
                        ...prev[selectedDate],
                        [selectedTime]: false
                    }
                }));
            }

            alert(`จองสำเร็จ: ${selectedDate} เวลา ${selectedTime}`);

            // รีเซ็ตฟอร์ม
            setSelectedDate("");
            setSelectedTime("");
            setName("");
            setCode("");
            setPhone("");
            setdescription("");

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("Create Appoinment Failed : ", error.message)
            } else {
                console.log("Unknow error in Load Appoinment : ", error)
            }
        }
    };


    return (
        <>
            <div className="
            bg-[#B67CDE] w-[250px] h-10 text-white p-10 mt-7 flex items-center justify-center rounded-tr-sm rounded-br-sm">
                <h1 className="text-xl font-bold  "> ตารางนัดหมาย</h1>
            </div>

            {/* กล่องเนื้อหาหลัก */}
            <div className="p-4 md:p-6  mx-auto">
                {/* ตาราง */}
                <div className="overflow-x-auto">
                    <table className="min-w-[700px] w-full text-center mb-6 border-separate border-spacing-2">
                        <thead>
                            <tr>
                                <th className="p-3 bg-purple-100 rounded-md whitespace-nowrap">เวลา</th>
                                {date.map(date => (
                                    <th key={date} className="p-3 bg-purple-100 rounded-md whitespace-nowrap">
                                        {formatThaiDate(date)}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {time.map(time => (
                                <tr key={time}>
                                    <td className="p-3 font-semibold bg-white rounded-md shadow whitespace-nowrap">{time}</td>
                                    {date.map(date => {
                                        const available = status[date][time];
                                        const isSelected = selectedDate === date && selectedTime === time;
                                        return (
                                            <td
                                                key={date + time}
                                                className={`
                                            p-2 rounded-md cursor-pointer text-sm font-medium 
                                            transition duration-200 whitespace-nowrap
                                            ${available ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                                            ${isSelected ? 'ring-2 ring-yellow-500' : ''}
                                        `}
                                                onClick={() => available && handleSelect(date, time)}
                                            >
                                                {available ? 'ว่าง' : 'ไม่ว่าง'}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ฟอร์มกรอกข้อมูล */}
                {selectedDate && selectedTime && (
                    <div className="bg-white shadow-md rounded-lg p-4 md:p-6 mt-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">กรอกข้อมูลการนัดหมาย</h2>
                        <p className="text-md text-gray-600 mb-4">
                            {/* วันที่: <span className="font-medium ">{formatThaiDate(selectedDate)}</span> | เวลา: <span className="font-medium">{selectedTime}</span> */}
                            <input type="text"
                                value={`วัน: ${formatThaiDate(selectedDate)} | เวลา: ${selectedTime}`}
                                readOnly
                                className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 mb-4"
                            />
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <input
                                type="text"
                                placeholder="ชื่อ-นามสกุล"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                            />
                            <input
                                type="text"
                                placeholder="รหัส"
                                value={code}
                                onChange={e => setCode(e.target.value)}
                                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                            />
                            <input
                                type="text"
                                placeholder="เบอร์โทรศัพท์"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                            />
                            <textarea
                                placeholder="ช่องทางการติดต่อเพิ่มเติม"
                                value={description}
                                onChange={e => setdescription(e.target.value)}
                                rows={3}
                                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 col-span-1 md:col-span-2"
                            />
                        </div>

                        <div className="flex flex-col md:flex-row justify-end gap-4">
                            <button
                                onClick={handleSave}
                                className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-full"
                            >
                                บันทึก
                            </button>

                            <button
                                onClick={() => {
                                    setSelectedDate("");
                                    setSelectedTime("");
                                    setName("");
                                }}
                                className="w-full md:w-auto bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-6 rounded-full"
                            >
                                ยกเลิก
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
export default UserAppointment