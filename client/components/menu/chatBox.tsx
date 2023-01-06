import styled from 'styled-components';
import { useEffect } from 'react';

type Props = {
    chatData: any;
    updateHandle: boolean
};

export default function ChatBox(props: Props) {
    const profileButtonHandle = () => {
        console.log("profile")
    };

    useEffect(()=> {
    },[props.updateHandle]);

    return(
        <Container>
            <ProfileButton onClick={profileButtonHandle}/>
            <InnerContainer>
                <NameTag><b>{props.chatData.name}</b></NameTag>
                <TextBox>{props.chatData.comments}</TextBox>
            </InnerContainer>
            <MinInfoContainer>
                <CountCheck>1</CountCheck>
                <TimeLine>오후 12:00</TimeLine>
            </MinInfoContainer>
        </Container>
    )
}

const Container = styled.div`\
    width: 50%;
    display: felx;
    gap: 1rem;
    padding: 1rem;
    position: sticky;
`;

const ProfileButton = styled.button`
    background-image: url('/images/defaultGuest.jpg');
    background-size: cover;
    width: 65px;
    height: 65px;
    border: none;
    border-radius: 20px;
`;

const InnerContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
`;

const NameTag = styled.span`
    font-size: 1.3rem;
`;

const TextBox = styled.label`
    width: 95%;
    font-size: 1.4rem;
    display: flex;
    align-items: center;
    background-color: #FFFFFF;
    border: none;
    border-radius: 1rem;
    padding: 1rem;
    word-break: break-all;
`;

const MinInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: end;
    margin-left: 1rem;
`;

const CountCheck = styled.label`
    color: #FFFF00;
`;

const TimeLine = styled.label`
`;
// justify-content: center;
//     flex-direction: column;