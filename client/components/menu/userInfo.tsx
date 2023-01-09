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
  padding-left: 1rem;
  width: 25%;
`;

const InnerContainer = styled.div`
  padding-left: 1rem;
  width: 100%;
  height: 80%;
  scrollbar-width: none;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.4);
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 6px;
  }
`;

const TitleText = styled.span`
  font-size: 1.5rem;
`;
