import { Outlet, Link } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const Root = () => {
  return (
    <>
      <AuthProvider>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to={"/"} className={navigationMenuTriggerStyle()}>
                Home
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to={"/about"} className={navigationMenuTriggerStyle()}>
                About
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <Outlet />
      </AuthProvider>
    </>
  );
};

export default Root;
