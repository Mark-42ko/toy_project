import styled from 'styled-components';
import UserCard from './userCard';

type Props = {
    blahData: any;
};

export default function UserInfo (props: Props) {
    return(
        <Container>
            <TitleText>참여자(100)</TitleText>
            <UserCard />
        </Container>
    );
}

const Container = styled.div`
    padding-left: 1rem;
    width: 25%;
`;

const TitleText = styled.span`
    font-size: 1.5rem;
`;