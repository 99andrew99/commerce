function Saleitem({ item }) {
    console.log("이동", item);
    return (
        <div className="flex flex-col w-40 h-48 justify-between cursor-pointer m-2 hover:shadow-xl">
            <img
                src={item.firstImg}
                className="border-solid border border-black w-full h-28"
            />
            <div className="text-sm text-gray-500">{item.category}</div>
            <div>{item.name}</div>
            <div>{new Intl.NumberFormat("ko-KR").format(item.cost)} 원</div>
        </div>
    );
}

export default Saleitem;
