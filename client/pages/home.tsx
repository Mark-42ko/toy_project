import MenuPage from "./components/menu/menuPage";
import Nav from "./components/nav/nav";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [navController, setNavController] = useState<string>("mail");
  const router = useRouter();

  // sessionstorage 에 값이 없으면 localstorage 값 삭제 시키고
  useEffect((): any => {
    if (!sessionStorage.getItem("userData") || !sessionStorage.getItem("userToken")) {
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
