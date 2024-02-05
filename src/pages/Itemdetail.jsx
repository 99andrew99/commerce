import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    collection,
    query,
    where,
    getDocs,
    orderBy,
    doc,
    getDoc,
} from "firebase/firestore";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { db } from "@/firebase";
import { LoadingSpinner } from "@/components/ui/loading";
import { useAuth } from "@/context/AuthContext";
import ItemDetailInformation from "@/components/ItemDetailInformation";
import { Button } from "@/components/ui/button";

function Itemdetail() {
    const { currentUser } = useAuth();
    const { itemId } = useParams();
    const [item, setItem] = useState(null);

    const navigate = useNavigate();

    const moveToModify = () => {
        navigate(`/itemmodify/${item.id}`);
    };

    async function fetchItem() {
        const docRef = doc(db, "sale", itemId);

        await getDoc(docRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    console.log(
                        "아이템 상태 페이지 getDoc 상품 존재: ",
                        docSnap.data()
                    );
                    setItem(docSnap.data());
                } else {
                    console.log("아이템 상태 페이지 getDoc 상품 존재 에러");
                }
            })
            .catch((error) => {
                console.log(
                    "아이템 상태 페이지 getDoc 상품 존재 에러 : ",
                    error
                );
            });
    }

    useEffect(() => {
        fetchItem();
    }, [itemId]);

    const carouselItems =
        item &&
        item.file.split(",").map((url, index) => (
            <CarouselItem key={index}>
                <img
                    className="w-96 h-96 p-2"
                    src={url.trim()}
                    alt={`Slide ${index + 1}`}
                />
            </CarouselItem>
        ));

    return item ? (
        item.uid == currentUser.uid ? (
            // 판매자 본인임
            <div className="flex justify-center  w-full h-screen">
                <div className="flex w-full h-96 justify-center">
                    <Carousel className="relative border border-black mr-5">
                        <CarouselContent className="w-96 h-96">
                            {carouselItems}
                            {carouselItems}
                        </CarouselContent>
                        <CarouselPrevious className="absolute left-2" />
                        <CarouselNext className="absolute right-2" />
                    </Carousel>
                    <div className="w-80 h-96 flex flex-col justify-between">
                        <ItemDetailInformation item={item} />
                        <Button onClick={moveToModify}>상품 수정하기</Button>
                    </div>
                </div>
            </div>
        ) : (
            // 구매자임
            <div>구매자임</div>
        )
    ) : (
        <LoadingSpinner />
    );
}

export default Itemdetail;
