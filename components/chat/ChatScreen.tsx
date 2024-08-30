import { Button } from "@material-tailwind/react";
import Person from "./Person";
import Message from "./Message";
import { useRecoilValue } from "recoil";
import { selectedIndexState } from "utils/recoil/atoms";

export default function ChatScreen(){
    const selectedIndex = useRecoilValue(selectedIndexState);

    return selectedIndex !== null ? (
        <div className="w-full h-screen flex flex-col">
            <Person
            index={selectedIndex}
            isActive={false}
            name={'Kim'}
            OnChatScreen={false}
            onlineAt={new Date().toISOString()}
            userId={"dkjska"}
            />
            {/* Chat Area */}
            <div className="w-full flex-1 flex flex-col p-4 gap-2">
                <Message isFromMe={true} message={"안녕하세요."} />
                <Message isFromMe={false} message={"반갑습니다."} />
                <Message isFromMe={true} message={"안녕하세요."} />
                <Message isFromMe={false} message={"반갑습니다."} />
                <Message isFromMe={true} message={"안녕하세요."} />
                <Message isFromMe={false} message={"반갑습니다."} />
                <Message isFromMe={true} message={"안녕하세요."} />
                <Message isFromMe={false} message={"반갑습니다."} />
            </div>
            <div className="flex">
                <input className="p-3 w-full border-2 border-light-blue-600"
                placeholder="메시지를 입력하세요." />
                <Button className="min-w-20 p-3 bg-light-blue-600 text-white" color="light-blue"><span>전송</span></Button>
            </div>
        </div>
    ): <div className="w-full"></div>;
}