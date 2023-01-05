import styled from 'styled-components';
import { PhoneIphone } from '@styled-icons/material/PhoneIphone';
import { EmailOutline } from '@styled-icons/evaicons-outline/EmailOutline';

export default function UserCard () {
    return(
        <Container>
            <ProfileContainer>
                <ProfileImg />
                <NameTag><b>홍길동</b></NameTag>
            </ProfileContainer>
            <InfoContainer>
                <PhoneIphone style={{width: "30px", height: "30px"}}/>
                <InfoText>010-0000-0000</InfoText>
            </InfoContainer>
            <InfoContainer>
                <EmailOutline style={{width: "30px", height: "30px"}}/>
                <InfoText>example@google.com</InfoText>
            </InfoContainer>
            <InfoContainer>
                <InfoText>추가정보...</InfoText>
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
    width: 100%;
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