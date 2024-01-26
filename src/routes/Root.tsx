import { Outlet, Link } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";

const Root = () => {
  return (
    <>
      <AuthProvider>
        <nav>
          <ul>
            <li>
              <Link to={"/"}>Home</Link>
            </li>
            <li>
              <Link to={"/about"}>About</Link>
            </li>
          </ul>
        </nav>
        <main>
          <Outlet />
        </main>
      </AuthProvider>
    </>
  );
};

export default Root;
