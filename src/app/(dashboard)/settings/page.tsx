import { Header } from "@/components/layout/Header";
import { SettingsContent } from "@/components/settings/SettingsContent";
import { createClient } from "@/lib/supabase/server";
import { getOwnerId } from "@/lib/owner";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  let company = null;
  let docSettings = null;
  let userId = "";

  try {
    userId = await getOwnerId();
    const supabase = await createClient();

    const [cs, ds] = await Promise.all([
      supabase.from("company_settings").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("doc_settings").select("*").eq("user_id", userId).maybeSingle(),
    ]);

    company = cs.data;
    docSettings = ds.data;
  } catch {}

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Settings" />
      <SettingsContent company={company} docSettings={docSettings} userId={userId} />
    </div>
  );
}
