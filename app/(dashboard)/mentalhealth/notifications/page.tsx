'use client';

import { useEffect, useState } from "react";
import type { Notifications, users, appointments } from "@prisma/client";
import { toast } from "react-hot-toast";

/* ================= Utils ================= */

const ITEMS_PER_PAGE = 3;

const formatThaiDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("th-TH", {
        day: "numeric",
        month: "long",
        year: "2-digit",
        weekday: "long",
    });
};

type TabType = "noti" | "appoint" | "dass21";

/* ================= Page ================= */

export default function NotificationsPage() {
    const [tab, setTab] = useState<TabType>("noti");

    const [notifications, setNotifications] = useState<Notifications[]>([]);
    const [appointments, setAppointments] = useState<appointments[]>([]);
    const [dass21, setDass21] = useState<Notifications[]>([]);

    const [user, setUser] = useState<users | null>(null);
    const [loading, setLoading] = useState(true);

    // pagination
    const [notiPage, setNotiPage] = useState(1);
    const [appointPage, setAppointPage] = useState(1);
    const [dassPage, setDassPage] = useState(1);

    /* ============== Load User ============== */
    useEffect(() => {
        const loadUser = async () => {
            try {
                const res = await fetch("/api/auth/token", {
                    credentials: "include",
                });
                const data = await res.json();
                if (res.ok) setUser(data.user);
            } catch {
                toast.error("เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้");
            }
        };
        loadUser();
    }, []);

    /* ============== Load Data ============== */
    useEffect(() => {
        if (!user?.id) return;

        const loadAll = async () => {
            try {
                const [n, a, d] = await Promise.all([
                    fetch("/api/system/notifications/user/" + user.id),
                    fetch("/api/appointments"),
                    fetch("/api/system/notifications/mentalhealth"),
                ]);

                const notiData = await n.json();
                const appData = await a.json();
                const dassData = await d.json();

                setNotifications(notiData.notifications || []);
                setAppointments(appData.showAppoinment || []);
                setDass21(dassData.DASS21noti || []);
            } catch {
                toast.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
            } finally {
                setLoading(false);
            }
        };

        loadAll();
    }, [user]);

    /* ============== Mark as Read ============== */
    useEffect(() => {
        if (!user?.id) return;

        fetch("/api/system/notifications/mark-read/" + user.id, {
            method: "POST",
            credentials: "include",
        }).then(() => {
            window.dispatchEvent(new Event("notifications-read"));
        });
    }, [user]);

    /* ============== Reset page when tab changes ============== */
    useEffect(() => {
        setNotiPage(1);
        setAppointPage(1);
        setDassPage(1);
    }, [tab]);

    /* ================= Pagination ================= */

    const notiItems = notifications.slice(
        (notiPage - 1) * ITEMS_PER_PAGE,
        notiPage * ITEMS_PER_PAGE
    );
    const notiTotal = Math.ceil(notifications.length / ITEMS_PER_PAGE);

    const appointItems = appointments.slice(
        (appointPage - 1) * ITEMS_PER_PAGE,
        appointPage * ITEMS_PER_PAGE
    );
    const appointTotal = Math.ceil(appointments.length / ITEMS_PER_PAGE);

    const dassItems = dass21.slice(
        (dassPage - 1) * ITEMS_PER_PAGE,
        dassPage * ITEMS_PER_PAGE
    );
    const dassTotal = Math.ceil(dass21.length / ITEMS_PER_PAGE);

    const tabs: { key: TabType; label: string }[] = [
        { key: "noti", label: "การแจ้งเตือน" },
        { key: "appoint", label: "การนัดหมาย" },
        { key: "dass21", label: "แบบประเมิน DASS-21" },
    ];

    /* ================= Render ================= */

    return (
        <div className="min-h-screen overflow-y-scroll">
            {/* Header */}
            <div className="bg-[#B67CDE] w-[300px] h-10 text-white p-10 mt-7 flex items-center justify-center rounded-tr-sm rounded-br-sm">
                <h1 className="text-xl font-bold">การแจ้งเตือน</h1>
            </div>

            <div className="flex flex-col items-center w-full py-10">
                {/*  ล็อกความสูง content */}
                <div className="w-full max-w-3xl px-6 min-h-[60vh]">

                    {/* Tabs */}
                    <div className="flex justify-center gap-3 mb-6">
                        {tabs.map(t => (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className={`px-5 py-2 rounded-full font-semibold transition
                ${tab === t.key
                                        ? "bg-purple-600 text-white"
                                        : "bg-gray-100 hover:bg-gray-200"}`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* Loading Skeleton */}
                    {loading && (
                        <div className="space-y-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-24 bg-gray-200 rounded-xl animate-pulse"
                                />
                            ))}
                        </div>
                    )}

                    {/* ================= TAB: Notifications ================= */}
                    {tab === "noti" && !loading && (
                        <>
                            {notiItems.length === 0 ? (
                                <p className="text-center text-gray-500">ไม่มีการแจ้งเตือน</p>
                            ) : (
                                <>
                                    {notiItems.map(n => (
                                        <div key={n.id} className="bg-white border rounded-xl p-5 mb-4">
                                            <h2 className="font-semibold text-lg">{n.title}</h2>
                                            <p className="text-gray-600 whitespace-pre-line">{n.message}</p>
                                            <p className="text-xs text-gray-400 mt-2">
                                                {formatThaiDate(n.createdAt.toString())}
                                            </p>
                                        </div>
                                    ))}
                                    <Pagination page={notiPage} total={notiTotal} onChange={setNotiPage} />
                                </>
                            )}
                        </>
                    )}

                    {/* ================= TAB: Appointments ================= */}
                    {tab === "appoint" && !loading && (
                        <>
                            {appointItems.length === 0 ? (
                                <p className="text-center text-gray-500">ไม่มีการนัดหมาย</p>
                            ) : (
                                <>
                                    {appointItems.map(a => (
                                        <div key={a.id} className="bg-white border rounded-xl p-5 mb-4">
                                            <h3 className="font-semibold text-lg">
                                                นัดวันที่ {formatThaiDate(a.date)}
                                            </h3>
                                            <p>เวลา: {a.time}</p>
                                            <p className="text-xs text-gray-400">
                                                ผู้จอง: {a.name}
                                            </p>
                                        </div>
                                    ))}
                                    <Pagination page={appointPage} total={appointTotal} onChange={setAppointPage} />
                                </>
                            )}
                        </>
                    )}

                    {/* ================= TAB: DASS-21 ================= */}
                    {tab === "dass21" && !loading && (
                        <>
                            {dassItems.length === 0 ? (
                                <p className="text-center text-gray-500">ยังไม่มีการประเมิน</p>
                            ) : (
                                <>
                                    {dassItems.map(d => (
                                        <div key={d.id} className="bg-white border rounded-xl p-5 mb-4">
                                            <h2 className="font-semibold text-lg">{d.title}</h2>
                                            <p className="text-gray-600 whitespace-pre-line">{d.message}</p>
                                            <p className="text-xs text-gray-400 mt-2">
                                                {formatThaiDate(d.createdAt.toString())}
                                            </p>
                                        </div>
                                    ))}
                                    <Pagination page={dassPage} total={dassTotal} onChange={setDassPage} />
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ================= Pagination Component ================= */

function Pagination({
    page,
    total,
    onChange,
}: {
    page: number;
    total: number;
    onChange: (p: number) => void;
}) {
    if (total <= 1) return null;

    return (
        <div className="flex justify-center gap-4 mt-4">
            <button
                disabled={page === 1}
                onClick={() => onChange(page - 1)}
                className="px-4 py-1 rounded bg-gray-100 disabled:opacity-40"
            >
                ก่อนหน้า
            </button>
            <span className="text-sm text-gray-600">
                หน้า {page} / {total}
            </span>
            <button
                disabled={page === total}
                onClick={() => onChange(page + 1)}
                className="px-4 py-1 rounded bg-gray-100 disabled:opacity-40"
            >
                ถัดไป
            </button>
        </div>
    );
}
