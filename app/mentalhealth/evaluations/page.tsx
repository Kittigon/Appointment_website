'use client';
import { useState } from "react";



const MentalhealthEvaluations = () => {
    const [data, setData] = useState([]);

    return (
        <>
            <div className="
            bg-[#B67CDE] w-[300px] h-10 text-white p-10 mt-7 flex items-center justify-center rounded-tr-sm rounded-br-sm">
                <h1 className="text-xl font-bold  ">ตรวจสอบแบบประเมิน</h1>
            </div>

            <div className="flex flex-col items-center justify-center mt-10 px-4 w-full">
                <div className="bg-white w-full  rounded-lg shadow-lg p-5 overflow-x-auto">
                    <table className="min-w-[600px] w-full text-left">
                        <thead>
                            <tr className=" text-gray-700 text-center">
                                <th className="border-b-2 border-gray-300 p-2">ID</th>
                                <th className="border-b-2 border-gray-300 p-2">ชื่อ-นามสกุล</th>
                                <th className="border-b-2 border-gray-300 p-2">คะแนน/ความเสี่ยงของ ภาวะซึมเศร้า</th>
                                <th className="border-b-2 border-gray-300 p-2">คะแนน/ความเสี่ยงของ ภาวะวิตกกังวล</th>
                                <th className="border-b-2 border-gray-300 p-2">คะแนน/ความเสี่ยงของ ภาวะเครียด</th>
                                <th className="border-b-2 border-gray-300 p-2">วันที่ทำแบบทดสอบ</th>
                                <th className="border-b-2 border-gray-300 p-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="text-gray-700  text-center">
                                <td className="border-b border-gray-200 p-2">1</td>
                                <td className="border-b border-gray-200 p-2">ABC DFG</td>
                                <td className="border-b border-gray-200 p-2">2 / ปกติ</td>
                                <td className="border-b border-gray-200 p-2">1/ ปกติ</td>
                                <td className="border-b border-gray-200 p-2">1/ ปกติ</td>
                                <td className="border-b border-gray-200 p-2">10/2/67</td>
                                <td className="border-b border-gray-200 p-2">
                                    <button className="text-red-500 bg-gray-100 py-2 px-4 font-bold active:bg-black">X</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
export default MentalhealthEvaluations