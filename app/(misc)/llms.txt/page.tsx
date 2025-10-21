import { redirect } from "next/navigation";

export default function LLMSTxt() {
  redirect("/api/resume?format=markdown");
}
