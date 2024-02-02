import Saleitem from "@/components/Saleitem";
import { db } from "@/firebase";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function Salemain() {
    const { currentUser } = useAuth();
    const [items, setItems] = useState([]);
    const navigate = useNavigate();
    // console.log("판매 메인", currentUser?.uid);

    const moveToRegisterItem = () => {
        navigate("/registeritem");
    };

    useEffect(() => {
        if (currentUser?.uid) {
            const q = query(
                collection(db, "sale"),
                where("uid", "==", currentUser?.uid),
                orderBy("createdAt", "desc")
            );
            getDocs(q).then((querySnapshot) => {
                // console.log(
                //     "쿼리로 불러옴",
                //     querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
                // );
                const documents = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    firstImg: doc.data().file.split(",")[0],
                    ...doc.data(),
                }));
                // console.log("도큐먼트", documents[0].file.split(",")[0]);
                setItems(documents);
            });
        }
    }, [currentUser]);

    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-row w-5/6 h-16 justify-between items-center">
                <div className="font-bold text-xl">판매 메인 페이지</div>
                <Button onClick={moveToRegisterItem}>상품등록</Button>
            </div>
            <div className="grid grid-cols-4 w-4/5 ">
                {items.map((item) => (
                    <Saleitem key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
}

export default Salemain;
