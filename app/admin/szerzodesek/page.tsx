import type { Metadata } from "next";
import ContractGenerator, { type ContractRecord } from "./ContractGenerator";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Járművezető-képzési dokumentumok",
};

export default async function ContractsPage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("training_contracts")
    .select("id, contract_number, contract_year, signed_at, student_name, course_category, status, created_at, updated_at, document_snapshot")
    .order("signed_at", { ascending: false });

  return <ContractGenerator records={(data ?? []) as ContractRecord[]} databaseReady={!error} databaseError={error?.message ?? null} />;
}
