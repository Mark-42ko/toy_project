import styled from 'styled-components';
import Mail from './mail';
import { useState } from 'react';
import People from './people';

type Props = {
    navController:string
}

export default function MenuPage(props: Props) {
    const [blahData, setBlahData] = useState<any>(null);

    return (
        <>
            <MenuContainer>
                { props.navController === "people" && 
                    <People />
                }
                { props.navController === "mailInBox" && 
                    <Mail blahData={blahData} setBlahData={setBlahData} /> 
                }
                { props.navController === "ListUl" && null }
                { props.navController === "Award" && null }
                { props.navController === "Robot" && null }
                { props.navController === "send" && null }
            </MenuContainer>
            
        </>
    );
}

const MenuContainer = styled.div`
    width: 100%;
    height: 100%;
    padding: 0em 2em;
`;