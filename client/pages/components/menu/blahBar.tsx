import styled from "styled-components";
import { ThreeDotsVertical } from "@styled-icons/bootstrap/ThreeDotsVertical";
import BlahBarButton from "./blahBarButton";

type Props = {
  roomData: any;
  setRerendering: Function;
};

export default function BlahBar(props: Props) {
  const menuHandle = () => {};

  const proceeding = ["초대하기", "보류하기", "종료하기"];

  const withheld = ["다시 진행하기", "종료하기"];

  return (
    <Container>
      {props.roomData.status === "진행중" && (
        <ButtonContainer>
          {proceeding.map((one) => (
            <BlahBarButton
              data={one}
              roomData={props.roomData}
              setRerendering={props.setRerendering}
              key={one}
            />
          ))}
        </ButtonContainer>
      )}
      {props.roomData.status === "보류됨" && (
        <ButtonContainer>
          {withheld.map((one) => (
            <BlahBarButton
              setRerendering={props.setRerendering}
              data={one}
              roomData={props.roomData}
              key={one}
            />
          ))}
        </ButtonContainer>
      )}
      {props.roomData.status === "종료됨" && <div />}
      <Button onClick={menuHandle}>
        <ThreeDotsVertical style={{ color: "#A4A4A4" }} />
      </Button>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 7vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 1.1rem;
  justify-content: space-between;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
`;

const Button = styled.button`
  border: none;
  background: #ffffff;
  cursor: pointer;

  svg {
    width: 30px;
    height: 30px;
  }
`;
