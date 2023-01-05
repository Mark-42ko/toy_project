import styled from 'styled-components';
import { useState } from 'react';

export default function AddBlahCard () {
    const [ select, setSelect ] = useState<boolean>(false);
    
    return(
        <Container choose={select} onClick={()=>setSelect(!select)}>
            <ProfileContainer>
                <ProfileImg />
                <NameTag><b>홍길동</b></NameTag>
            </ProfileContainer>
        </Container>
    );
}

type ButtonProps = {
    choose: boolean
};

const Container = styled.button`
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    border: 1px solid;
    border-radius: 1rem;
    border-color: #D8D8D8;
    background: ${(props: ButtonProps) => props.choose === true ? "#F2F2F2" : "#FFFFFF"};
`;

const ProfileContainer = styled.div`
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: 1.5rem;
    width: 100%;
`;

const ProfileImg = styled.div`
    background-image: url('/images/defaultGuest.jpg');
    background-size: cover;
    width: 65px;
    height: 65px;
    border: none;
    border-radius: 20px;
`;

const NameTag = styled.div`
    font-size: 1.4rem;
`;
