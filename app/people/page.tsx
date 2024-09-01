import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Instagram People",
    description: "Instagram People",
};

export default function PeoplePage(){
    return (
        <div className="w-full h-scree flex justify-center items-center">
            People Page
        </div>
    )
}