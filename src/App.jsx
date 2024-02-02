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

const ProtectedHome = withAuthProtection(Home);
const ProtectedRegisterItem = withAuthProtection(RegisterItem);

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
