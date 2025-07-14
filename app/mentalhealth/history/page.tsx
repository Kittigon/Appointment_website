const MentalhealthHistory = () => {
    return (
        <>
            <div className="
            bg-[#B67CDE] w-[300px] h-10 text-white p-10 mt-7 flex items-center justify-center rounded-tr-sm rounded-br-sm">
                <h1 className="text-xl font-bold  "> ประวัติการนัดหมาย</h1>
            </div>

            <section>
                <div className=" mx-auto p-4">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <p className="text-gray-600 mb-4">แสดงประวัติการนัดหมายทั้งหมดของผู้ใช้</p>
                        {/* รายการนัดหมาย */}
                        <ul className="space-y-4">
                            {/* ตัวอย่างรายการนัดหมาย */}
                            <li className="border-b pb-2">
                                <div className="flex justify-between items-center">
                                    <span>วันที่: 2023-10-01 เวลา: 10:00</span>
                                    <span>สถานะ: สำเร็จ</span>
                                </div>
                            </li>
                            {/* เพิ่มรายการอื่น ๆ ตามต้องการ */}
                        </ul>
                    </div>
                </div>
            </section>
        </>
    )
}
export default MentalhealthHistory