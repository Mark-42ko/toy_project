import styled from "styled-components";
import UserCard from "./userCard";

type Props = {
  roomData: any;
};

export default function UserInfo(props: Props) {
  return (
    <Container>
      <TitleText>참여자({props.roomData.user.length})</TitleText>
      <InnerContainer>
        {props.roomData.user.map((one: any) => (
          <UserCard userData={one} key={one.name} />
        ))}
      </InnerContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  width: 25%;
  height: 78.5vh;
  gap: 1rem;
  background-color: #575757;
  border-radius: 8px;
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 1rem;
  width: 100%;
  max-height: 100%;
  scrollbar-width: none;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    border-radius: 6px;
    background: #575757;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 6px;
  }
`;

const TitleText = styled.span`
  font-size: 2rem;
  padding-left: 1rem;
  color: #ffffff;
`;
