import { createClient } from "@supabase/supabase-js";
import PDFDocument from "pdfkit";
import path from "path";

export async function GET() {
    const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data } = await supabase
        .from("documents")
        .select("id, content")
        .order("id");

    const fontPath = path.join(
        process.cwd(),
        "public/fonts/THSarabunNew.ttf"
    );

    const doc = new PDFDocument({
        font: fontPath,
    });

    const buffers: Buffer[] = [];
    doc.on("data", (b) => buffers.push(b));

    // เขียนเนื้อหา "ก่อน"
    doc.fontSize(18).text("Documents\n\n");

    data?.forEach((d) => {
        doc.fontSize(12).text(`ID: ${d.id}`);
        doc.fontSize(11).text(d.content ?? "-");
        doc.text("\n------------------\n");
    });

    //  ปิด document
    doc.end();

    //  รอให้เขียนเสร็จ
    const pdfBuffer: Buffer = await new Promise((resolve) => {
        doc.on("end", () => {
            resolve(Buffer.concat(buffers));
        });
    });

    //  ส่งไฟล์
    return new Response(
        new Uint8Array(pdfBuffer),
        {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": "attachment; filename=documents.pdf",
            },
        }
    );
}
