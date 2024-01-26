import { useAuth } from "@/context/AuthContext";

function Home() {
    const { currentUser } = useAuth();
    console.log("홈페이지", currentUser);
    return <div>Home</div>;
}

export default Home;
