'use server';

import { createServerSupabaseAdminClient, createServerSupabaseClient } from "utils/supabase/server";

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

export async function sendMessage({ message, chatUserId }) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session.user) {
    throw new Error("User is not authenticated");
  }

  const { data, error: sendMessageError } = await supabase
    .from("message")
    .insert({
      message,
      receiver: chatUserId,
      sender: session.user.id,
    });

  if (sendMessageError) {
    throw new Error(sendMessageError.message);
  }

  return data;
}

export async function getAllMessages({
  chatUserId
}){
  const supabase = await createServerSupabaseClient();
  const { data: { session }, error } = await supabase.auth.getSession();

  if(error || !session.user){
    throw new Error("User is not aythenticated");
  }

  const { data, error: getMessageError } = await supabase.from("message")
  .select("*")
  .or(`receiver.eq.${chatUserId}, reciver.eq.${session.user.id}`)
  .or(`sender.eq.${chatUserId}, sender.eq.${session.user.id}`)
  .order("created_at", {ascending: true});

  if(getMessageError){
    return [];
  }

  return data;
}