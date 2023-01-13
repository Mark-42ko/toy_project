import styled from "styled-components";
import ConnectionList from "./connectionList";
import { useState } from "react";
import AddPeople from "./addPeople";

const connection = [
  { status: "온라인" },
  { status: "오프라인" },
  { status: "보낸요청" },
  { status: "받은요청" },
];

export default function People() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Container>
      <AddButton onClick={() => setOpen(!open)}>
        <b>친구추가</b>
      </AddButton>
      {open ? (
        <ModalBackdrop>
          <AddPeople setOpen={setOpen} open={open} />
        </ModalBackdrop>
      ) : null}
      <InnerContainer>
        {connection.map((one) => (
          <ConnectionList key={one.status} tag={one.status} open={open} />
        ))}
      </InnerContainer>
    </Container>
  );
}

const Container = styled.div`
  width: 300px;
  padding: 1em;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InnerContainer = styled.div`
  width: 100%;
`;

const AddButton = styled.button`
  width: 100%;
  border: none;
  padding: 0.5rem;
  background: rgba(112, 200, 255, 1);
  font-size: 2rem;
  border-radius: 4px;
  color: rgba(255, 255, 255, 1);
  cursor: pointer;
  &:active {
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
  }
`;

const ModalBackdrop = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  right: 0;
  top: 0;
  display: flex;
  flex-flow: row wrep;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
`;
