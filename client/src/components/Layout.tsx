import { Outlet } from "react-router-dom";
import  NavBar from "./ui/NavBar";

function Layout(): JSX.Element {
    return (
      <>
        <NavBar />
        <main className="bg-gray-50 min-h-screen">
          <Outlet />
        </main>
      </>
    );
}

export default Layout;