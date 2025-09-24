import { NextResponse } from "next/server";
import { resume } from "@/lib/resume";

export async function GET() {
  return NextResponse.json(resume);
}
