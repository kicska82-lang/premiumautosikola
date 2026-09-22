import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const applicationId = z.string().uuid().safeParse(id);
  if (!applicationId.success) return new NextResponse("Nem található dokumentum.", { status: 404 });

  const { supabase } = await requireAdmin();
  const { data: application } = await supabase
    .from("applications")
    .select("medical_document_path")
    .eq("id", applicationId.data)
    .maybeSingle();

  if (!application?.medical_document_path) return new NextResponse("Nem található dokumentum.", { status: 404 });

  const { data, error } = await createAdminClient().storage
    .from("application-documents")
    .createSignedUrl(application.medical_document_path, 60);

  if (error || !data?.signedUrl) return new NextResponse("A dokumentum most nem elérhető.", { status: 500 });
  return NextResponse.redirect(data.signedUrl);
}
