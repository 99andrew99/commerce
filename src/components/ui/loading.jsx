import { Watch } from "react-loader-spinner";

export const LoadingSpinner = () => {
    return (
        <Watch
            visible={true}
            height="50"
            width="50"
            radius="48"
            color="white"
            ariaLabel="watch-loading"
            wrapperStyle={{}}
            wrapperClass=""
        />
    );
};
