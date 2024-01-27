import { Outlet, Link } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
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
              <Link to={"/"}>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to={"/about"}>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  About
                </NavigationMenuLink>
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
