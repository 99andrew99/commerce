import { useAuth } from "@/context/AuthContext";
import { auth } from "../firebase";
import { getAuth, signOut } from "firebase/auth";
import Header from "@/components/Header";

function Home() {
    return (
        <>
            <Header />
            <div>Home</div>
        </>
    );
}

export default Home;
