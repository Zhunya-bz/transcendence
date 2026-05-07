import { getCurrentMe } from "@/actions/auth";
import { Avatar } from "./ui/avatar";

export const UserButton = () => {
    const currentUser = getCurrentMe();
    return (
        <Avatar>
            
        </Avatar>
    );
}