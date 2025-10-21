import { redirect } from "next/navigation";
import { RESUME_CONFIG } from "@/lib/config";

export default async function Page({}) {
  redirect(RESUME_CONFIG.pdfPath());
}
