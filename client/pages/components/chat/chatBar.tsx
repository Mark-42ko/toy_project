import styled from "styled-components";
import { ThreeDotsVertical } from "@styled-icons/bootstrap/ThreeDotsVertical";
import ChatBarButton from "./chatBarButton";

type Props = {
  roomData: any;
  setRerendering: Function;
};

export default function ChatBar(props: Props) {
  const menuHandle = () => {};

  const proceeding = ["초대하기", "종료하기"];

  return (
    <Container>
      {props.roomData.status === "대화중" && (
        <ButtonContainer>
          {proceeding.map((one) => (
            <ChatBarButton
              data={one}
              roomData={props.roomData}
              setRerendering={props.setRerendering}
              key={one}
            />
          ))}
        </ButtonContainer>
      )}
      {props.roomData.status === "완료된 대화" && <div />}
      <Button onClick={menuHandle}>
        <ThreeDotsVertical />
      </Button>
    </Container>
  );
}

const Container = styled.div`
  width: 98%;
  height: 7vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1rem 0rem 0.5rem 1rem;
  justify-content: space-between;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
`;

const Button = styled.button`
  border: none;
  background: rgba(0, 0, 0, 0);
  cursor: pointer;

  svg {
    color: rgba(82, 163, 255, 1);
    width: 40px;
    height: 40px;
  }
`;
