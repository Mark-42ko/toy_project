import styled from "styled-components";
import AddPartner from "./addPartner";
import { useState } from "react";
import { io } from "socket.io-client";

type Props = {
  data: string | undefined;
  roomData: any;
  setRerendering: Function;
  setChatRoom: Function;
};
const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;
const socket = io(`${SERVER_URI}/chat`);

export default function ChatBarButton(props: Props) {
  const userData = JSON.parse(sessionStorage.getItem("userData") as string);
  const accessToken = JSON.parse(sessionStorage.getItem("userToken") as string);
  const [open, setOpen] = useState<boolean>(false);

  const buttonHandle = async () => {
    if (props.data === "초대하기") {
      setOpen(!open);
    } else {
      let status;
      let systemComments;
      status = props.data!.slice(0, 2) + "됨";
      systemComments = `${userData.username}님이 ${props.data!.slice(0, 2)}하였습니다.`;
      await fetch(`${SERVER_URI}/blah/chatAdd`, {
        method: "Post",
        body: JSON.stringify({
          _id: props.roomData._id,
          blah: {
            name: "알림",
            profile: "",
            comments: systemComments,
            date: new Date(),
            counts: [],
          },
        }),
        headers: {
          Authorization: `bearer ${accessToken}`,
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000",
        },
      });

      await fetch(`${SERVER_URI}/blah/statusChange`, {
        method: "Post",
        body: JSON.stringify({
          _id: props.roomData._id,
          status: status,
        }),
        headers: {
          Authorization: `bearer ${accessToken}`,
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000",
        },
      });
      props.setChatRoom(null);
      props.setRerendering(Math.random());
      const data = {
        roomName: props.roomData._id,
        message: "종료됨",
      };
      socket.emit("message", data, (chat: any) => {
        props.setRerendering(Math.random());
      });
    }
  };

  return (
    <>
      <ButtonContainer onClick={buttonHandle}>
        <Text>
          <b>{props.data}</b>
        </Text>
      </ButtonContainer>
      {open ? (
        <ModalBackdrop>
          <AddPartner
            setOpen={setOpen}
            open={open}
            roomData={props.roomData}
            setRerendering={props.setRerendering}
          />
        </ModalBackdrop>
      ) : null}
    </>
  );
}

const ButtonContainer = styled.div`
  width: 80px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 81, 0, 1);
  border: none;
  border-radius: 10px;
  cursor: pointer;
`;

const Text = styled.span`
  color: rgba(255, 255, 255, 1);
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 17px;
`;

const ModalBackdrop = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  left: 0;
  bottom: 0;

  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
`;
