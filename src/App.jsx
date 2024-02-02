import { useEffect } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useNavigate,
} from "react-router-dom";
import withAuthProtection from "./components/withAuthProtection";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import RegisterItem from "./pages/RegisterItem";
import Sale from "./pages/Sale";

//로그인 상태 아니면 로그인 창으로 이동
const ProtectedHome = withAuthProtection(Home);
const ProtectedRegisterItem = withAuthProtection(RegisterItem);
const ProtectedSale = withAuthProtection(Sale);

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                    path="/"
                    element={
                        <Layout>
                            <ProtectedHome />
                        </Layout>
                    }
                />
                <Route
                    path="/sale"
                    element={
                        <Layout>
                            <ProtectedSale />
                        </Layout>
                    }
                />
                <Route
                    path="/registeritem"
                    element={
                        <Layout>
                            <ProtectedRegisterItem />
                        </Layout>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
