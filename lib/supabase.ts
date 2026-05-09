import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Skill = {
  id: string;
  name: string;
  level: number;
  order_index: number;
};

export type Project = {
  id: string;
  title: string;
  desc: string;
  stack: string[];
  year: string;
  link?: string;
  order_index: number;
};

export type About = {
  id: string;
  bio1: string;
  bio2: string;
  years_exp: string;
  project_count: string;
  extra_stat: string;
  location: string;
  headline1: string;
  headline2: string;
  headline3: string;
};

export type ContactInfo = {
  id: string;
  email: string;
  location: string;
  github: string;
  facebook: string;
  tagline: string;
};

export type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  read: boolean;
};
