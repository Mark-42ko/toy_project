import styled from 'styled-components';
import { PhoneIphone } from '@styled-icons/material/PhoneIphone';
import { EmailOutline } from '@styled-icons/evaicons-outline/EmailOutline';
import { useContext } from 'react';
import { GlobalContext } from 'pages/_app';

type Props = {
    userData: any;
};

export default function UserCard (props: Props) {
    const ctx = useContext(GlobalContext);

    return(
        <Container>
            <ProfileContainer>
                <ProfileImg />
                <NameTag><b>{
                    props.userData.name === ctx?.userData?.username ? "나" : props.userData.name
                }</b></NameTag>
            </ProfileContainer>
            <InfoContainer>
                <PhoneIphone style={{width: "30px", height: "30px"}}/>
                <InfoText>{props.userData.phoneNumber}</InfoText>
            </InfoContainer>
            <InfoContainer>
                <EmailOutline style={{width: "30px", height: "30px"}}/>
                <InfoText>{props.userData.email}</InfoText>
            </InfoContainer>
        </Container>
    );
}

const Container = styled.div`
    margin-top: 1rem;
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    border: 1px solid;
    border-radius: 1rem;
    border-color: #D8D8D8;
`;

const ProfileContainer = styled.div`
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: 1.5rem;
    width: 100%;
    margin-bottom: 1.5rem;
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

const InfoContainer = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    gap: 1rem;
`;

const InfoText = styled.span`
`;