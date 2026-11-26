import { unstable_cache } from "next/cache";
import { createAdminClient } from "./supabase/admin";

export const getOwnerId = unstable_cache(
  async (): Promise<string> => {
    const admin = createAdminClient();
    const { data, error } = await admin.auth.admin.listUsers({ perPage: 1 });
    if (error || !data?.users?.length) throw new Error("No owner found in Supabase auth");
    return data.users[0].id;
  },
  ["owner-id"],
  { revalidate: 3600 }
);
