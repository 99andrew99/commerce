import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LoadingSpinner } from "./ui/loading";

const withAuthProtection = (WrappedComponent) => {
    return function ProtectedComponent(props) {
        const { currentUser } = useAuth();
        const navigate = useNavigate();
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
            const timer = setTimeout(() => {
                if (!currentUser) {
                    navigate("/login");
                } else {
                    setIsLoading(false);
                }
            }, 1000);
            return () => clearTimeout(timer);
        }, [currentUser, navigate]);

        if (isLoading) {
            return (
                <div className="fixed top-0 bg-black w-screen h-screen flex flex-col justify-center items-center">
                    <LoadingSpinner className={"bg-white z-20"} />
                    <div className="text-white mt-4">Loading...</div>
                </div>
            ); // 로딩 인디케이터 표시
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAuthProtection;
