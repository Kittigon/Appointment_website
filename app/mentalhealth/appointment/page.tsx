'use client';
import { useState } from "react";

const time = ["10:00", "11:00", "13:00", "14:00"];

// คืนค่า array วันที่ 7 วันถัดไป
const getNext7Days = (): string[] => {
    const days: string[] = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        days.push(date.toISOString().split('T')[0]); // yyyy-mm-dd
    }
    return days;
};

const date = getNext7Days();

// initStatus: สร้างออบเจกต์วันที่และเวลาว่าง (null = ยังไม่มีชื่อ)
const initStatus: Record<string, Record<string, string | null>> = {};
date.forEach(date => {
    initStatus[date] = {};
    time.forEach(t => {
        initStatus[date][t] = null;
    });
});

initStatus["2025-07-19"]["10:00"] = "นางสาวสมศรี ใจดี";


// แปลงวันที่เป็นแบบไทย เช่น "ศ. 19 เม.ย. 67"
const formatThaiDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: '2-digit',
        weekday: 'short'
    });
};

const MentalhealthAppointment = () => {
    const [status, setStatus] = useState(initStatus); // ข้อมูลตาราง
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [code, setCode] = useState('');
    const [phone, setPhone] = useState('');
    const [name, setName] = useState("");
    const [selectedBookedInfo, setSelectedBookedInfo] = useState<{
        name: string;
        code: string;
        phone: string;
        date: string;
        time: string;
    } | null>(null);

    // เมื่อคลิกเลือกเวลาที่ "ว่าง"
    const handleSelect = (date: string, time: string) => {
        if (status[date][time]) return; // ห้ามเลือกถ้ามีชื่อ

        // ตรวจสอบว่าเวลาที่เลือกมากกว่าเวลาปัจจุบัน +2 ชม.
        const now = new Date();
        const [h, m] = time.split(":").map(Number);
        const selected = new Date(date);
        selected.setHours(h, m, 0, 0);

        const twoHours = 2 * 60 * 60 * 1000;
        if (selected.getTime() - now.getTime() < twoHours) {
            alert("กรุณาเลือกเวลาล่วงหน้าอย่างน้อย 2 ชั่วโมง");
            return;
        }

        setSelectedDate(date);
        setSelectedTime(time);
    };

    // บันทึกชื่อเข้า status
    const handleSave = () => {
        if (!selectedDate || !selectedTime) return alert("กรุณาเลือกวันและเวลา");
        if (!name.trim()) return alert("กรุณากรอกชื่อ");
        if (!code.trim() || !phone.trim()) return alert("กรุณากรอกรหัสและเบอร์โทรศัพท์");

        setStatus(prev => ({
            ...prev,
            [selectedDate]: {
                ...prev[selectedDate],
                [selectedTime]: name.trim()
            }
        }));

        alert(`จองสำเร็จ: ${formatThaiDate(selectedDate)} เวลา ${selectedTime} โดย ${name}`);
        setSelectedDate("");
        setSelectedTime("");
        setName("");
        setCode("");
        setPhone("");
    };

    return (
        <>
            <div className="bg-[#B67CDE] w-[250px] h-10 text-white p-10 mt-7 flex items-center justify-center rounded-tr-sm rounded-br-sm">
                <h1 className="text-xl font-bold">ปฎิทินการนัดพบ</h1>
            </div>

            <div className="p-4 md:p-6 mx-auto">
                {/* ตาราง */}
                <div className="overflow-x-auto">
                    <table className="min-w-[700px] w-full text-center mb-6 border-separate border-spacing-2">
                        <thead>
                            <tr>
                                <th className="p-3 bg-purple-100 rounded-md">เวลา</th>
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
                                    <td className="p-3 font-semibold bg-white rounded-md shadow">{time}</td>
                                    {date.map(date => {
                                        const name = status[date][time];
                                        const isSelected = selectedDate === date && selectedTime === time;

                                        return (
                                            <td
                                                key={date + time}
                                                className={`
                                                    p-2 rounded-md text-sm font-medium whitespace-nowrap
                                                    ${name ? 'bg-gray-200 text-gray-600' : 'bg-orange-100 text-orange-800 hover:bg-orange-200 cursor-pointer'}
                                                    ${isSelected ? 'ring-2 ring-yellow-500' : ''}
                                                `}
                                                onClick={() => {
                                                    if (name) {
                                                        // ถ้ามีชื่อ → แสดงรายละเอียด
                                                        setSelectedBookedInfo({ name, date, time, code , phone });
                                                    } else {
                                                        handleSelect(date, time); // ถ้ายังไม่มี → เลือกเพื่อจอง
                                                    }
                                                }}
                                            >
                                                {name  ? "ไม่ว่าง" : "ว่าง"}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ฟอร์มกรอกชื่อ */}
                {selectedDate && selectedTime && !status[selectedDate][selectedTime] && (
                    <div className="bg-white shadow-md rounded-lg p-4 md:p-6 mt-6 ">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">กรอกชื่อผู้รับการปรึกษา</h2>
                        <input
                            type="text"
                            placeholder="ชื่อ-นามสกุล"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                        <input
                            type="text"
                            placeholder="รหัสประจำตัว"
                            value={code}
                            onChange={e => setCode(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                        <input
                            type="text"
                            placeholder="เบอร์โทรศัพท์"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                        <input
                            type="text"
                            value={`วัน: ${formatThaiDate(selectedDate)} | เวลา: ${selectedTime}`}
                            readOnly
                            className="w-full p-3 border border-gray-200 bg-gray-100 text-gray-600 rounded-md mb-4"
                        />
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
                {selectedBookedInfo && (
                    <div className="bg-white shadow-md rounded-lg p-6 mt-6  mx-auto border border-purple-200">
                        <h3 className="text-xl font-bold text-black mb-4 border-b pb-2">ข้อมูลผู้จอง</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800 text-[15px]">
                            <div>
                                <input
                                    type="text"
                                    value={`ชื่อ: ${selectedBookedInfo.name}`}
                                    readOnly
                                    className="w-full p-3 border font-semibold border-gray-200 bg-gray-100 text-gray-600 rounded-md mb-4"
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    value={`รหัส: ${selectedBookedInfo.code}`}
                                    readOnly
                                    className="w-full p-3 border font-semibold border-gray-200 bg-gray-100 text-gray-600 rounded-md mb-4"
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    value={`เบอร์โทรศัพท์: ${selectedBookedInfo.phone}`}
                                    readOnly
                                    className="w-full p-3 border font-semibold border-gray-200 bg-gray-100 text-gray-600 rounded-md mb-4"
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    value={`วัน: ${formatThaiDate(selectedBookedInfo.date)} | เวลา: ${selectedBookedInfo.time}`}
                                    readOnly
                                    className="w-full p-3 border font-semibold border-gray-200 bg-gray-100 text-gray-600 rounded-md mb-4"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setSelectedBookedInfo(null)}
                                className="px-6 py-2 bg-gray-300 hover:bg-gray-400 rounded-full text-sm font-medium text-gray-800 transition duration-200"
                            >
                                ปิด
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default MentalhealthAppointment;
