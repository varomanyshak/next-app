import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import csv from "csv-parser";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const buffer = Buffer.from(await file.arrayBuffer());
    const csvString = buffer.toString();

    // Parse CSV
    const rows: any[] = [];
    await new Promise((resolve, reject) => {
      const stream = require("stream");
      const readStream = new stream.Readable();
      readStream._read = () => {};
      readStream.push(csvString);
      readStream.push(null);

      readStream
        .pipe(csv())
        .on("data", (row) => rows.push(row))
        .on("end", resolve)
        .on("error", reject);
    });

    // Insert into DB
    for (const row of rows) {
      await prisma.competitor.create({
        data: {
          firstname: row.firstname,
          lastname: row.lastname,
          birthday: new Date(row.birthday),
          club: row.club,
          country: row.country,
          weight: parseInt(row.weight, 10),
          rank: row.rank,
          gender: row.gender,
          user_id: 1,       // 🟩 Add default user_id here
        },
      });
    }

    return NextResponse.json({ message: "Import successful" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erreur lors de l'import" }, { status: 500 });
  }
}
