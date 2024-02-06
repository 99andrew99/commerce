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
import Salemain from "./pages/Salemain";
import Itemdetail from "./pages/Itemdetail";
import ItemModify from "./pages/ItemModify";
import Category from "./pages/Category";

const ProtectedHome = withAuthProtection(Home);
const ProtectedRegisterItem = withAuthProtection(RegisterItem);
const ProtectedSalemain = withAuthProtection(Salemain);
const ProtectedItemdetail = withAuthProtection(Itemdetail);
const ProtectedItemModify = withAuthProtection(ItemModify);
const ProtectedCategory = withAuthProtection(Category);

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
                <Route
                    path="/sale"
                    element={
                        <Layout>
                            <ProtectedSalemain />
                        </Layout>
                    }
                />
                <Route
                    path="/itemdetail/:itemId"
                    element={
                        <Layout>
                            <ProtectedItemdetail />
                        </Layout>
                    }
                />
                <Route
                    path="/itemmodify/:itemId"
                    element={
                        <Layout>
                            <ProtectedItemModify />
                        </Layout>
                    }
                />
                <Route
                    path="/category/:categoryName"
                    element={
                        <Layout>
                            <ProtectedCategory />
                        </Layout>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
