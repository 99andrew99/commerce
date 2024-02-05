import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useEffect, useState } from "react";

function ItemDetailInformation({ item }) {
    const [userName, setUserName] = useState();

    useEffect(() => {
        if (item) {
            const docRef = doc(db, "users", item.uid);
            getDoc(docRef)
                .then((docSnap) => {
                    if (docSnap.exists()) {
                        setUserName(docSnap.data().nickname);
                        // console.log(userName);
                    } else {
                        console.log("판매자 이름 찾는 에러");
                    }
                })
                .catch((error) => {
                    console.log("판매자 이름 찾는 에러 : ", error);
                });
        }
    }, [item]);

    return (
        <div className="w-80 h-3/5  flex flex-col justify-between">
            <div className="text-sm ">{item.category}</div>
            <div className="text-lg font-semibold">상품명: {item.name}</div>
            <div className="text-lg font-semibold">금액: {item.cost}</div>
            <div className="text-lg font-semibold">평점: 5</div>
            <div className="text-lg font-semibold">남은 수량: {item.stock}</div>
            <div className="text-lg font-semibold">판매자: {userName}</div>
        </div>
    );
}

export default ItemDetailInformation;
