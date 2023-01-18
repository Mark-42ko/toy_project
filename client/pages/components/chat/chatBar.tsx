import styled from "styled-components";
import ChatBarButton from "./chatBarButton";

type Props = {
  roomData: any;
  setRerendering: Function;
  setChatRoom: Function;
};

export default function ChatBar(props: Props) {
  const proceeding = ["초대하기", "종료하기"];

  return (
    <Container>
      <div />
      {props.roomData.status === "진행중" && (
        <ButtonContainer>
          {proceeding.map((one) => (
            <ChatBarButton
              data={one}
              roomData={props.roomData}
              setRerendering={props.setRerendering}
              key={one}
              setChatRoom={props.setChatRoom}
            />
          ))}
        </ButtonContainer>
      )}
      {props.roomData.status === "종료됨" && <div />}
    </Container>
  );
}

const Container = styled.div`
  height: 26px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 24px 24px 22px 32px;
  justify-content: space-between;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;
