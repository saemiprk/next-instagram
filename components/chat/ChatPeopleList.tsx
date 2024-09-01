"use client";

import { presenceState, selectedUserIdState, selectedUserIndexState } from "utils/recoil/atoms";
import Person from "./Person";
import { useRecoilState } from "recoil";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "actions/chatActions";
import { createBrowserSupabaseClient } from "utils/supabase/client";
import { useEffect } from "react";

export default function ChatPeopleList({ loggedInUser }){
    const [selectedUserId, setSelectedUserId] = useRecoilState(selectedUserIdState);
    const [selectedUserIndex, setSelectedUserIndex] = useRecoilState(selectedUserIndexState);
    const [presence, setPresence] = useRecoilState(presenceState);

    const getAllUsersQuery = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
          const allUsers = await getAllUsers();
          return allUsers.filter((user) => user.id !== loggedInUser.id);
        },
    });

    const supabase = createBrowserSupabaseClient();

    useEffect(() => {
        const channel = supabase.channel("online_users", {
            config: {
                presence:{
                    key: loggedInUser.id
                }
            }
        });

        channel.on("presence", { event: "sync" }, () => {
            const newState = channel.presenceState();
            const newStateObj = JSON.parse(JSON.stringify(newState));
            setPresence(newStateObj);
        });

        channel.subscribe(async status => {
            if(status !== "SUBSCRIBED"){
                return;
            }

            const newPresenceStatus = await channel.track({
                onlineAt: new Date().toISOString(),
            });

            console.log(newPresenceStatus);
        });

        return () => {
            channel.unsubscribe();
        }
    }, []);

    return (
        <div className="h-screen min-w-60 flex flex-col bg-gray-50">
            {getAllUsersQuery.data?.map((user, index) => (
                <Person
                onClick={() => {
                    setSelectedUserId(user.id);
                    setSelectedUserIndex(index);
                }}
                key={index}
                index={index}
                isActive={selectedUserId === user.id}
                name={user.email.split("@")[0]}
                onChatScreen={false}
                onlineAt={presence?.[user.id]?.[0]?.onlineAt}
                userId={user.id}
                />
            ))}
        </div>
    )
}