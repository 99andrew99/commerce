function Saleitem({ item }) {
    // console.log("이동", item);
    return (
        <div className="flex flex-col w-48 h-72 justify-between cursor-pointer m-2 mt-10 rounded-md p-1 hover:shadow-custom">
            <div className="border-solid border border-black rounded-md w-full h-44 overflow-hidden">
                <img
                    src={item.firstImg}
                    className="w-full h-full transition-transform duration-100 hover:scale-110"
                />
            </div>
            <div className="text-sm text-gray-500 no-underline">
                {item.category}
            </div>
            <div className="">{item.name}</div>
            <div className="no-underline text-black">
                {new Intl.NumberFormat("ko-KR").format(item.cost)} 원
            </div>
        </div>
    );
}

export default Saleitem;
