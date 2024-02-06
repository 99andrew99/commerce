import { useAuth } from "@/context/AuthContext";
import { auth, db } from "../firebase";
import { getAuth, signOut } from "firebase/auth";
import {
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import Saleitem from "@/components/Saleitem";
import { LoadingSpinner } from "@/components/ui/loading";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    const [temp, setTemp] = useState();
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    async function fetchLatestItemsByCategory(category) {
        // 카테고리별로 최신 4개 상품을 가져오는 쿼리 생성

        const q = query(
            collection(db, "sale"),
            where("category", "==", category),
            orderBy("createdAt", "desc"), // 생성일 기준 내림차순 정렬
            limit(4) // 4개 제한
        );
        let tempItems = [];
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const item = {
                firstImg: data.file.split(",")[0],
                ...data,
            };
            tempItems.push(item);
        });

        // console.log("아이템: ", items);
        return tempItems;
    }
    const categories = [
        "식품",
        "생필품",
        "패션",
        "취미",
        "뷰티",
        "디지털",
        "건강",
        "스포츠",
    ];

    const [categoryItems, setCategoryItems] = useState({});

    useEffect(() => {
        const fetchPromises = categories.map(async (category) => {
            const latestItems = await fetchLatestItemsByCategory(category);
            return { category, items: latestItems };
        });

        Promise.all(fetchPromises).then((results) => {
            const newCategoryItems = results.reduce((acc, curr) => {
                acc[curr.category] = curr.items;
                return acc;
            }, {});
            setCategoryItems(newCategoryItems);
            setIsLoading(false);
        });
    }, []);

    // useEffect(() => {
    //     async function fetchData() {
    //         const t = await fetchLatestItemsByCategory("식품");
    //         setIsLoading(false);
    //         console.log(items);
    //     }

    //     fetchData();
    // }, []);

    const moveToCategory = (categoryName) => {
        navigate(`/category/${categoryName}`);
    };

    return isLoading ? (
        <div className="fixed top-0 bg-black w-screen h-screen flex flex-col justify-center items-center">
            <LoadingSpinner className={"bg-white z-20"} />
            <div className="text-white mt-4">로딩중...</div>
        </div>
    ) : (
        <div>
            {Object.entries(categoryItems).map(([category, items]) => (
                <div key={category} className="flex flex-col ml-10 mt-10">
                    <div className="flex flex-row items-center w-28 justify-between">
                        <div className="text-2xl font-semibold">{category}</div>
                        <p
                            onClick={() => {
                                moveToCategory(category);
                            }}
                            className="text-sm border-b border-black cursor-pointer hover:text-gray-600"
                        >
                            더보기
                        </p>
                    </div>

                    <div className="grid grid-cols-4 w-4/5  ml-32">
                        {items.map((item, index) => (
                            <Saleitem key={index} item={item} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Home;
