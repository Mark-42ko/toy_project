import { GlobalContext } from 'pages/_app';
import { useContext } from 'react';
import styled from 'styled-components';

type Props = {
    chatData: any;
};

export default function ChatBox(props: Props) {
    const profileButtonHandle = () => {
        console.log("profile")
    };

    const ctx = useContext(GlobalContext);
    const check = props.chatData.name === ctx?.userData?.username ? true : false;
    return(
        <Container check={check}>
            { check ?
                <ProfileContainer>
                    <MinInfoContainer check={check}>
                        <CountCheck>1</CountCheck>
                        <TimeLine>오후 12:00</TimeLine>
                    </MinInfoContainer>
                    <InnerContainer>
                        <TextBox check={check}>{props.chatData.comments}</TextBox>
                    </InnerContainer>
                </ProfileContainer>
            :
                <ProfileContainer>
                    <ProfileButton onClick={profileButtonHandle}/>
                    <InnerContainer>
                        <NameTag><b>{props.chatData.name}</b></NameTag>
                        <TextBox check={check}>{props.chatData.comments}</TextBox>
                    </InnerContainer>
                    <MinInfoContainer check={check}>
                        <CountCheck>1</CountCheck>
                        <TimeLine>오후 12:00</TimeLine>
                    </MinInfoContainer>
                </ProfileContainer>
            }
        </Container>
    )
}

type CheckProps = {
    check: boolean;
};

const Container = styled.div`
    width: 90%;
    display: felx;
    position: sticky;
    justify-content: ${(props: CheckProps) => props.check === true ? "end" : "start"};
`;

const ProfileContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 1rem;
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
    background-color: ${(props:CheckProps) => props.check === true ? "#F4FA58" : "#FFFFFF"};
    border: none;
    border-radius: 1rem;
    padding: 1rem;
    word-break: break-all;
`;

const MinInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: end;
    align-items: ${(props: CheckProps) => props.check === true ? "end" : "start"};
    margin-left: 1rem;
`;

const CountCheck = styled.label`
    color: #FFFF00;
`;

const TimeLine = styled.label`
`;
// justify-content: center;
//     flex-direction: column;