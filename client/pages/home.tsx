import MenuPage from '@components/menu/menuPage';
import Nav from '@components/nav/nav';
import { useState } from 'react';

export default function Home() {
    const [navController, setNavController] = useState<string>("people");

    return (
        <div style={{display:"flex", flexDirection:"row"}}>
            <Nav navController={navController} setNavController={setNavController}/>
            <MenuPage navController={navController}/>
        </div>
    );
}