import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Category() {
    const { categoryName } = useParams();

    return <div>{categoryName}</div>;
}

export default Category;
