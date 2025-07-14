'use client'
import { Pencil } from 'lucide-react';
import { Trash2 } from 'lucide-react';

const AdminManage = () => {
    return (
        <>
            <div className="
            bg-[#B67CDE] w-[250px] h-10 text-white p-10 mt-7 flex items-center justify-center rounded-tr-sm rounded-br-sm">
                <h1 className="text-xl font-bold  ">จัดการผู้ใช้</h1>
            </div>

            <div className="flex flex-col items-center justify-center mt-10 px-4 w-full">
                <div className="bg-white w-full  rounded-lg shadow-lg p-5 overflow-x-auto">
                    <table className="min-w-[600px] w-full text-left">
                        <thead>
                            <tr className=" text-gray-700 text-center">
                                <th className="border-b-2 border-gray-300 p-2">ID</th>
                                <th className="border-b-2 border-gray-300 p-2">ชื่อ-นามสกุล</th>
                                <th className="border-b-2 border-gray-300 p-2">อีเมล</th>
                                <th className="border-b-2 border-gray-300 p-2">บทบาท</th>
                                <th className="border-b-2 border-gray-300 p-2">แก้ไขเมื่อ</th>
                                <th className="border-b-2 border-gray-300 p-2">เปลี่ยนรหัสผ่าน / ลบผู้ใช้งาน</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="text-gray-700  text-center">
                                <td className="border-b border-gray-200 p-2">1</td>
                                <td className="border-b border-gray-200 p-2">ABC DFG</td>
                                <td className="border-b border-gray-200 p-2">ABC@gmail.com</td>
                                <td className="border-b border-gray-200 p-2">user</td>
                                <td className="border-b border-gray-200 p-2">10/2/67</td>
                                <td className="border-b border-gray-200 p-2 flex justify-center items-center">
                                    <button className="text-blue-500 bg-gray-100 py-2 px-4 font-bold mr-2 text-center">
                                        <Pencil className="inline" />
                                    </button>
                                    <button className="text-red-500 bg-gray-100 py-2 px-4  ml-2 font-bold text-center">
                                        <Trash2 className="inline" />
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
export default AdminManage