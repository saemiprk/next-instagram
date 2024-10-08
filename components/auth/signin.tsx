import { Button } from "@material-tailwind/react";
import { Input } from "@material-tailwind/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react"
import { createBrowserSupabaseClient } from "utils/supabase/client";

export default function SignIn({setView}){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const supabase = createBrowserSupabaseClient();
    const signInMutation = useMutation({
        mutationFn: async () => {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if(data){
                console.log(data);
            }

            if(error){
                alert(error.message);
            }
        }
    });

    return (
        <div className="flex flex-col gap-4">
            <div className="pt-10 pb-6 px-10 w-full flex flex-col items-center justify-center max-w-lg border border-gray-400 bg-white gap-2">
                <img src={'/images/inflearngram.png'} className="w-60 mb-6" />
                <Input value={email} onChange={(e) => setEmail(e.target.value)} label="email" type="email" className="w-full rounded-sm" />
                <Input value={password} onChange={(e) => setPassword(e.target.value)} label="password" type="password" className="w-full rounded-sm" />
                <Button onClick={() => signInMutation.mutate()} loading={signInMutation.isPending} disabled={signInMutation.isPending} color='light-blue' className="w-full text-md py-1">Login</Button>
            </div>
            <div className="flex items-center justify-center py-4 w-full text-center max-w-lg border border-gray-400 bg-white">
                아직 계정이 없으신가요? <Button className="text-light-blue-600 font-bold bg-transparent shadow-none p-0" onClick={() => {setView("SIGNUP")}}>가입하기</Button>
            </div>
        </div>
    )
}