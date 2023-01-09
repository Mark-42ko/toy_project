import { useState } from "react";
import styled from "styled-components";

type Props = {
  tabHandle: string;
  roomData: any;
  choose: boolean;
  setChoose: Function;
  setChatRoom: Function;
};

export default function MailList(props: Props) {
  const nameTag =
    props.roomData.user.length === 2
      ? props.roomData.user[1].name
      : props.roomData.user[1].name + " 외" + (props.roomData.user.length - 1) + " 명";
  const [select, setSelect] = useState<boolean>(false);

  const clickHandle = () => {
    setSelect(true);
    props.setChoose(true);
    props.setChatRoom(props.roomData);
  };

  return (
    <ButtonContainer select={select} onClick={clickHandle}>
      <ImgDiv />
      <SmallContainer>
        <div>
          <NameTag>
            <b>{nameTag}</b>
          </NameTag>
        </div>
        <LastOrder>안녕하세요</LastOrder>
      </SmallContainer>
    </ButtonContainer>
  );
}

type ButtonProps = {
  select: boolean;
};

const ButtonContainer = styled.button`
  width: 100%;
  height: 70px;
  display: flex;
  flex-direction: row;
  margin-top: 15px;
  border: none;
  border-radius: 30px;
  background: #ffffff;
  align-items: center;
  background: ${(props: ButtonProps) => (props.select === true ? "#F2F2F2" : "#FFFFFF")};
`;

const ImgDiv = styled.div`
  background-image: url("/images/defaultGuest.jpg");
  background-size: cover;
  width: 65px;
  height: 60px;
  border: none;
  border-radius: 20px;
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
  font-size: 0.7rem;
`;
