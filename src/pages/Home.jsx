import { useAuth } from "@/context/AuthContext";
import { auth } from "../firebase";
import { getAuth, signOut } from "firebase/auth";

function Home() {
    const onLogOutClick = () => {
        signOut(auth);
    };

    const { currentUser } = useAuth();
    console.log("홈페이지", currentUser);
    return <div onClick={onLogOutClick}>Home</div>;
}

export default Home;
