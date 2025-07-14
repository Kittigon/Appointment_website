'use client';
import Head from 'next/head';
import { useState, useEffect } from 'react';


interface SystemStatus {
    isOperational: boolean;
    message: string;
}

interface UserStats {
    totalUsers: number;
    activeUsers: number;
}

interface SurveyStats {
    totalSurveys: number;
    completedSurveys: number;
}


const Dashboard = () => {
    const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const [surveyStats, setSurveyStats] = useState<SurveyStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Simulate API calls
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

                // Simulate System Status
                const simulatedSystemStatus: SystemStatus = {
                    isOperational: Math.random() > 0.1, // 90% chance of being operational
                    message: Math.random() > 0.1 ? 'ระบบทำงานปกติ' : 'พบข้อผิดพลาดบางอย่าง'
                };
                setSystemStatus(simulatedSystemStatus);

                // Simulate User Stats
                const simulatedUserStats: UserStats = {
                    totalUsers: Math.floor(Math.random() * 1000) + 500, // 500-1500 users
                    activeUsers: Math.floor(Math.random() * 300) + 100 // 100-400 active users
                };
                setUserStats(simulatedUserStats);

                // Simulate Survey Stats
                const simulatedSurveyStats: SurveyStats = {
                    totalSurveys: Math.floor(Math.random() * 50) + 10, // 10-60 surveys
                    completedSurveys: Math.floor(Math.random() * 40) + 5 // 5-45 completed
                };
                setSurveyStats(simulatedSurveyStats);

            } catch (err: any) {
                setError('ไม่สามารถโหลดข้อมูลได้: ' + err.message);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center py-2 bg-gray-50">
                <Head>
                    <title>Dashboard Demo</title>
                    <meta name="description" content="Next.js Dashboard Demo with Tailwind CSS" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <main className="flex flex-1 flex-col items-center justify-center px-20 text-center">
                    <h1 className="text-4xl font-bold">กำลังโหลดข้อมูล...</h1>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center py-2 bg-gray-50">
                <Head>
                    <title>Dashboard Demo</title>
                    <meta name="description" content="Next.js Dashboard Demo with Tailwind CSS" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <main className="flex flex-1 flex-col items-center justify-center px-20 text-center">
                    <h1 className="text-4xl font-bold text-red-600">เกิดข้อผิดพลาด</h1>
                    <p className="mt-3 text-2xl text-gray-700">{error}</p>
                </main>
            </div>
        );
    }

    return (
        <>
            <div className="
            bg-[#B67CDE] w-[250px] h-10 text-white p-10 mt-7 flex items-center justify-center rounded-tr-sm rounded-br-sm">
                <h1 className="text-xl font-bold  ">Dashboard</h1>
            </div>

            <div className=" flex flex-col items-center justify-center py-2 ">
                <main className="flex flex-1 flex-col items-center justify-center px-20 text-center">

                    <div className="flex flex-wrap items-center justify-center max-w-4xl mt-6 sm:w-full">
                        {/* System Status */}
                        <div className="m-4 p-6 text-left border border-gray-200 rounded-xl transition-colors hover:text-blue-600 hover:border-blue-600 w-96 min-h-[200px] shadow-lg bg-white">
                            <h2 className="text-2xl font-bold mb-4">สถานะระบบ</h2>
                            {systemStatus && (
                                <>
                                    <p className="text-xl">
                                        สถานะ: {' '}
                                        <span className={`font-bold ${systemStatus.isOperational ? 'text-green-600' : 'text-red-600'}`}>
                                            {systemStatus.isOperational ? 'ปกติ' : 'มีปัญหา'}
                                        </span>
                                    </p>
                                    <p className="text-xl mt-2">{systemStatus.message}</p>
                                </>
                            )}
                        </div>

                        {/* User Statistics */}
                        <div className="m-4 p-6 text-left border border-gray-200 rounded-xl transition-colors hover:text-blue-600 hover:border-blue-600 w-96 min-h-[200px] shadow-lg bg-white">
                            <h2 className="text-2xl font-bold mb-4">จำนวนคนในระบบ</h2>
                            {userStats && (
                                <>
                                    <p className="text-xl">จำนวนผู้ใช้งานทั้งหมด: <span className="font-semibold">{userStats.totalUsers}</span></p>
                                    <p className="text-xl mt-2">ผู้ใช้งานออนไลน์: <span className="font-semibold">{userStats.activeUsers}</span></p>
                                </>
                            )}
                        </div>

                        {/* Survey Statistics */}
                        <div className="m-4 p-6 text-left border border-gray-200 rounded-xl transition-colors hover:text-blue-600 hover:border-blue-600 w-96 min-h-[200px] shadow-lg bg-white">
                            <h2 className="text-2xl font-bold mb-4">แบบสอบถาม</h2>
                            {surveyStats && (
                                <>
                                    <p className="text-xl">จำนวนแบบสอบถามทั้งหมด: <span className="font-semibold">{surveyStats.totalSurveys}</span></p>
                                    <p className="text-xl mt-2">แบบสอบถามที่ทำเสร็จแล้ว: <span className="font-semibold">{surveyStats.completedSurveys}</span></p>
                                    <p className="text-xl mt-2">ร้อยละที่ทำเสร็จ: <span className="font-semibold">{((surveyStats.completedSurveys / surveyStats.totalSurveys) * 100).toFixed(2)}%</span></p>
                                </>
                            )}
                        </div>
                    </div>
                </main>

            </div>

        </>
    )
}
export default Dashboard