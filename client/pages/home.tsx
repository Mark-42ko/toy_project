import MenuPage from "./components/menu/menuPage";
import Nav from "./components/nav/nav";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [navController, setNavController] = useState<string>("mail");
  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem("userData") || !localStorage.getItem("userToken")) {
      router.push("/account/signIn");
    }
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <Nav navController={navController} setNavController={setNavController} />
      <MenuPage navController={navController} />
    </div>
  );
}
