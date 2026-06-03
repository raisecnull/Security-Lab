import { createClient } from "@supabase/supabase-js";

// Remove the "!" and add a fallback placeholder string so the Vercel compiler doesn't crash
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Post = {
    id: string;
    title: string;
    slug: string;
    category: string;
    sub_category?: string;
    content: string;
    created_at: string;
};

export type LearnResource = {
    id: string;
    title: string;
    slug: string;
    category: string;
    sub_category: string;
    content: string;
    created_at: string;
};
