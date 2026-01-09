import { createClient } from "@supabase/supabase-js";

export async function GET() {
    const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. ดึงข้อมูล
    const { data } = await supabase
        .from("documents")
        .select("id, content")
        .order("id");

    // 2. แปลงเป็น CSV แบบตรงไปตรงมา
    let csv = "id,content\n";

    data?.forEach((d) => {
        csv += `${d.id},"${d.content ?? ""}"\n`;
    });

    const filename = encodeURIComponent("document.csv");

    // 3. ส่งไฟล์ให้โหลด
    return new Response(csv, {
        headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": "attachment; filename*=UTF-8''" + filename,
        },
    });
}
