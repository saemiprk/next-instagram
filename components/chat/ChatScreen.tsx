"use client";

import { Button, Spinner } from "@material-tailwind/react";
import Person from "./Person";
import Message from "./Message";
import { useRecoilValue } from "recoil";
import { presenceState, selectedUserIdState, selectedUserIndexState } from "utils/recoil/atoms";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllMessages, getUserById, sendMessage } from "actions/chatActions";
import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "utils/supabase/client";

export default function ChatScreen(){
    const selectedUserId = useRecoilValue(selectedUserIdState);
    const selectedUserIndex = useRecoilValue(selectedUserIndexState);
    const selectedUserQuery = useQuery({
        queryKey: ["user", selectedUserId],
        queryFn: () => getUserById(selectedUserId),
    });

    const presence = useRecoilValue(presenceState);
    
    const [message, setMessage] = useState("");
    const supabase = createBrowserSupabaseClient();

    const sendMessageMutation = useMutation({
        mutationFn: async () => {
          return sendMessage({
            message,
            chatUserId: selectedUserId,
          });
        },
        onSuccess: () => {
          setMessage("");
          getAllMessagesQuery.refetch();
        },
    });
    
    const getAllMessagesQuery = useQuery({
    queryKey: ["messages", selectedUserId],
    queryFn: () => getAllMessages({ chatUserId: selectedUserId }),
    });

    useEffect(() => {
    const channel = supabase
        .channel("message_postgres_changes")
        .on(
        "postgres_changes",
        {
            event: "INSERT",
            schema: "public",
            table: "message",
        },
        (payload) => {
            if (payload.eventType === "INSERT" && !payload.errors) {
            getAllMessagesQuery.refetch();
            }
        }
        )
        .subscribe();

    return () => {
        channel.unsubscribe();
    };
    }, []);

    return selectedUserQuery.data !== null ? (
        <div className="w-full h-screen flex flex-col">
            <Person
                index={selectedUserIndex}
                isActive={false}
                name={selectedUserQuery.data?.email?.split("@")?.[0]}
                onChatScreen={true}
                onlineAt={presence?.[selectedUserId]?.[0]?.onlineAt}
                userId={selectedUserQuery.data?.id}
            />
            {/* Chat Area */}
            <div className="w-full flex-1 flex flex-col p-4 gap-2">
                {getAllMessagesQuery.data?.map(message => (
                    <Message
                        key= {message.id}
                        message={message.message}
                        isFromMe={message.receiver === selectedUserId}
                   />
                ))}
            </div>
            <div className="flex">
                <input className="p-3 w-full border-2 border-light-blue-600"
                placeholder="메시지를 입력하세요." onChange={(e) => setMessage(e.target.value)} />
                <Button className="min-w-20 p-3 bg-light-blue-600 text-white" color="light-blue"
                onClick={() => sendMessageMutation.mutate()} >
                    {sendMessageMutation.isPending? <Spinner /> : <span>전송</span> }
                </Button>
            </div>
        </div>
    ): <div className="w-full"></div>;
}