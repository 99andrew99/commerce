import Header from "./Header";

const Layout = ({ children }) => {
    return (
        <>
            <Header />
            <div>{children}</div>
        </>
    );
};

export default Layout;
