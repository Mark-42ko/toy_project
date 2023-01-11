import { useState } from "react";
import { useEffect } from "react";
import styled from "styled-components";

type Props = {
  tabHandle: string;
  roomData: any;
  setChatRoom: Function;
  chatRoom: any;
};

export default function MailList(props: Props) {
  const [check, setCheck] = useState<boolean>(false);
  const nameTag =
    props.roomData.user.length === 2
      ? props.roomData.user[1].name
      : props.roomData.user[1].name + " 외" + (props.roomData.user.length - 1) + " 명";
  let lastOder;
  if (props.roomData.blah[0]) {
    if (props.roomData.blah[props.roomData.blah.length - 1].comments) {
      lastOder = props.roomData.blah[props.roomData.blah.length - 1].comments;
    } else {
      lastOder = "";
    }
  }

  useEffect(() => {
    props.roomData !== props.chatRoom && setCheck(false);
  }, [props.chatRoom, lastOder]);

  const clickHandle = () => {
    setCheck(true);
    props.setChatRoom(props.roomData);
  };

  return (
    <ButtonContainer selected={check} onClick={clickHandle}>
      <ImgDiv />
      <SmallContainer>
        <div>
          <NameTag>
            <b>{nameTag}</b>
          </NameTag>
        </div>
        <LastOrder>{lastOder}</LastOrder>
      </SmallContainer>
    </ButtonContainer>
  );
}

type ButtonProps = {
  selected: boolean;
};

const ButtonContainer = styled.button<ButtonProps>`
  width: 100%;
  height: 70px;
  display: flex;
  flex-direction: row;
  margin-top: 15px;
  border: none;
  border-radius: 8px;
  align-items: center;
  background: ${({ selected }) => (selected ? "#F2F2F2" : "#fff")};
  cursor: pointer;
`;

const ImgDiv = styled.div`
  background-image: url("/images/defaultGuest.jpg");
  background-size: cover;
  width: 65px;
  height: 60px;
  border: none;
  border-radius: 10px;
`;

const SmallContainer = styled.div`
  width: 80%;
  height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: start;
  padding-left: 15px;
`;

const NameTag = styled.a`
  font-size: 1rem;
`;

const LastOrder = styled.a`
  font-size: 1rem;
`;
