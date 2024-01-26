import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const withAuthProtection = (WrappedComponent) => {
    return function ProtectedComponent(props) {
        const { currentUser } = useAuth();
        const navigate = useNavigate();

        useEffect(() => {
            if (!currentUser) {
                navigate("/login");
            }
        }, [currentUser, navigate]);

        return <WrappedComponent {...props} />;
    };
};

export default withAuthProtection;
