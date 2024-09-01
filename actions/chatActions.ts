'use server';

import { createServerSupabaseAdminClient } from "utils/supabase/server";

export const getAllUsers = async () => {
    const supabase = await createServerSupabaseAdminClient();
  
    const {
      data: { users },
      error,
    } = await supabase.auth.admin.listUsers();
  
    if (error) {
      console.log(error);
      return [];
    }
  
    return users
};

export async function getUserById(userId){
    const supabase = await createServerSupabaseAdminClient();

    const { data, error } = await supabase.auth.admin.getUserById(userId);

    if(error){
        return null;
    }

    return data.user;

};