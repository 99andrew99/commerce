import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { auth } from "../firebase";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
} from "@/components/ui/menubar";

function Header() {
    const navigate = useNavigate();

    const onLogOutClick = () => {
        signOut(auth);
    };

    const moveToHome = () => {
        navigate("/");
    };

    const moveToSale = () => {
        navigate("/sale");
    };

    const moveToCart = () => {
        // navigate("/registeritem");
    };

    const { currentUser } = useAuth();
    console.log("홈페이지", currentUser);

    return (
        <div className=" w-screen h-28 border-b border-black">
            <div className="flex flex-row w-full h-3/5 items-center place-content-between">
                <div
                    className="font-bold text-xl hover:text-neutral-600 cursor-pointer ml-4"
                    onClick={moveToHome}
                >
                    CHO-COMMERCE
                </div>
                <div className="flex flex-row">
                    <Input
                        placeholder="검색할 상품 이름을 입력하세요."
                        className="w-80"
                    />
                    <Button className="ml-1">검색</Button>
                </div>

                <div className="flex flex-row h-full">
                    <div
                        className="flex flex-col justify-center items-center mr-6 cursor-pointer"
                        onClick={moveToSale}
                    >
                        <img
                            src="/img/saleIcon.png"
                            style={{ width: "40px", height: "40px" }}
                        />
                        <p className="text-xs">판매하기</p>
                    </div>
                    <div className="flex flex-col justify-center items-center mr-6 cursor-pointer">
                        <img
                            src="/img/mypageIcon.png"
                            style={{ width: "40px", height: "40px" }}
                        />
                        <p className="text-xs">마이페이지</p>
                    </div>
                    <div
                        className="flex flex-col justify-center items-center mr-6 cursor-pointer"
                        onClick={moveToCart}
                    >
                        <img
                            src="/img/cartIcon.png"
                            style={{ width: "40px", height: "40px" }}
                        />
                        <p className="text-xs">장바구니</p>
                    </div>
                    <div
                        className="flex flex-col justify-center items-center mr-6 cursor-pointer"
                        onClick={onLogOutClick}
                    >
                        <img
                            src="/img/logoutIcon.png"
                            style={{ width: "40px", height: "40px" }}
                        />
                        <p className="text-xs">로그아웃</p>
                    </div>
                </div>
            </div>

            <div className="w-16 border-black border rounded-md cursor-pointer ml-4">
                <Menubar>
                    <MenubarMenu>
                        <MenubarTrigger>메뉴</MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem>식품</MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem>생필품</MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem>패션</MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem>취미</MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem>뷰티</MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem>디지털</MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem>건강</MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem>스포츠</MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
            </div>
        </div>
    );
}

export default Header;
