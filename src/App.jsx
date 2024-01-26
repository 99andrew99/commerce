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

const ProtectedHome = withAuthProtection(Home);

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/home" element={<ProtectedHome />} />
            </Routes>
        </Router>
    );
}

export default App;
