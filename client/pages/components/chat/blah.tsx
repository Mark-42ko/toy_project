import styled from "styled-components";
import { useEffect, useState, useRef } from "react";
import ChatBox from "./chatBox";
import { io } from "socket.io-client";
import { PlusCircle } from "@styled-icons/bootstrap/PlusCircle";
import ChatBar from "./chatBar";
import Spinner from "./spinner";

type Props = {
  roomData: any;
  setRerendering: Function;
  rerendering: number;
  setChatRoom: Function;
  setChatRoomsRender: Function;
};

const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;
const AI_URI = process.env.NEXT_PUBLIC_AI_URI;
const socket = io(`${SERVER_URI}/chat`);

export default function Blah(props: Props) {
  const [inputData, setInputData] = useState<string>("");
  const [updateData, setUpdateData] = useState<any>();
  const [check, setCheck] = useState<number>(0);
  const [files, setFiles] = useState<File[]>([]);
  const [spinner, setSpinner] = useState<boolean>(false);
  const ref = useRef<HTMLInputElement>(null);
  const userData = JSON.parse(sessionStorage.getItem("userData") as string);
  const accessToken = JSON.parse(sessionStorage.getItem("userToken") as string);

  const chatUser: string[] = [];
  for (let i = 0; i < props.roomData.user.length; i++) {
    if (
      props.roomData.user[i].name !== userData.username &&
      props.roomData.user[i].name !== "챗봇"
    ) {
      chatUser.push(props.roomData.user[i].email);
    }
  }

  useEffect(() => {
    setSpinner(false);
    socket.emit("join-room", props.roomData._id, () => {});
    const messageHandler = (chat: any) => {
      if (chat.roomName) {
        if (chat.name === "챗봇") {
          props.setRerendering(Math.random());
          setTimeout(() => {
            setSpinner(false);
          }, 100);
        } else {
          props.setRerendering(Math.random());
        }
      }
    };
    socket.on("message", messageHandler);
    return () => {
      socket.off("message", messageHandler);
    };
  }, [props.roomData._id]);

  useEffect(() => {
    const blah = document.getElementById("blah");
    blah?.scrollIntoView({ behavior: "auto", block: "end", inline: "end" });
    props.setChatRoomsRender(Math.random());
  }, [updateData, props.rerendering]);

  useEffect(() => {
    !(async function () {
      const result = await fetch(`${SERVER_URI}/blah/room?id=${props.roomData._id}`, {
        method: "GET",
        headers: {
          Authorization: `bearer ${accessToken}`,
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000",
        },
      });
      const json = await result.json();
      if (json.data._id === props.roomData._id) {
        setUpdateData(json.data);
      }
    })();
  }, [props.roomData, props.rerendering]);

  const inputButtonHandle = async () => {
    if (inputData === "") {
      alert("메시지를 입력해주세요.");
    } else {
      if (files.length !== 0) {
        const formData = new FormData();
        files.forEach((one) => {
          formData.append("file", one);
        });
        const response = await fetch(`${SERVER_URI}/blah/upload`, {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `bearer ${accessToken}`,
            "Access-Control-Allow-Origin": "http://localhost:3000",
          },
        });
        const json = await response.json();
        await fetch(`${SERVER_URI}/blah/chatAdd`, {
          method: "Post",
          body: JSON.stringify({
            _id: props.roomData._id,
            blah: {
              name: userData.username,
              profile: userData.filename,
              comments: json.fileOriginName,
              date: new Date(),
              counts: chatUser,
              filePath: json.filePath,
              filename: json.filename,
              filesize: json.filesize,
            },
          }),
          headers: {
            Authorization: `bearer ${accessToken}`,
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": "http://localhost:3000",
          },
        });
        const data = {
          roomName: props.roomData._id,
          message: inputData,
        };
        socket.emit("message", data, (chat: any) => {
          props.setRerendering(Math.random());
          setUpdateData(chat);
          setInputData("");
          setCheck(chat.blah.length);
          setFiles([]);
        });
      } else {
        await fetch(`${SERVER_URI}/blah/chatAdd`, {
          method: "Post",
          body: JSON.stringify({
            _id: props.roomData._id,
            blah: {
              name: userData.username,
              profile: userData.filename,
              comments: inputData,
              date: new Date(),
              counts: chatUser,
            },
          }),
          headers: {
            Authorization: `bearer ${accessToken}`,
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": "http://localhost:3000",
          },
        });
        setInputData("");
        const data = {
          roomName: props.roomData._id,
          message: inputData,
        };
        socket.emit("message", data, (chat: any) => {
          setUpdateData(chat);
          setCheck(chat.blah.length);
        });
        if (props.roomData.user.find((one: any) => one.name === "챗봇")) {
          if (props.roomData.user.length === 2) {
            setSpinner(true);
            await fetch(`${AI_URI}`, {
              method: "POST",
              body: JSON.stringify({
                roomName: props.roomData._id,
                userName: userData.username,
                message: inputData,
                counts: [userData.userId],
                socketUrl: `${SERVER_URI}/chat`,
              }),
              headers: {
                "Content-type": "application/json",
              },
            });
          } else {
            if (inputData.startsWith("챗봇")) {
              await fetch(`${AI_URI}`, {
                method: "POST",
                body: JSON.stringify({
                  roomName: props.roomData._id,
                  userName: userData.username,
                  counts: chatUser,
                  message: inputData,
                  socketUrl: `${SERVER_URI}/chat`,
                }),
                headers: {
                  "Content-type": "application/json",
                },
              });
            }
          }
        }
      }
    }
  };

  const fileAddButtonHandle: React.ChangeEventHandler<HTMLInputElement> = (evt) => {
    if (evt.target.files) {
      const t = Array.from(evt.target.files!);
      setFiles([...files, ...t]);
      if (t[0]) {
        setInputData(`${t[0].name}를 보내시겠습니까?`);
      }
    }
  };

  return (
    <Container>
      <ChatBarContainer>
        <ChatBar
          roomData={props.roomData}
          setRerendering={props.setRerendering}
          setChatRoom={props.setChatRoom}
        />
        <Line />
      </ChatBarContainer>
      <BlahContainer>
        {updateData &&
          updateData.blah.map((one: any, idx: number) => (
            <ChatBox
              chatData={one}
              key={one.date}
              _id={props.roomData._id}
              idx={idx}
              check={check}
              roomData={props.roomData}
              setRerendering={props.setRerendering}
              rerendering={props.rerendering}
            />
          ))}
        {spinner && <Spinner />}
        <div id="blah"></div>
      </BlahContainer>
      <InputContainer>
        {props.roomData.status === "종료됨" ? (
          <InputBox disabled />
        ) : (
          <InputBox
            onChange={(evt) => setInputData(evt.currentTarget.value)}
            value={inputData}
            onKeyPress={(e) => e.key === "Enter" && inputButtonHandle()}
          />
        )}
        <FileAddButton onClick={() => ref.current?.click()}>
          <PlusCircle />
        </FileAddButton>
        <FileInput
          type="file"
          ref={ref}
          style={{ display: "none" }}
          onChange={(e) => {
            fileAddButtonHandle(e);
            e.target.value = "";
          }}
        />
        <SendButton type="button" onClick={inputButtonHandle}>
          보내기
        </SendButton>
      </InputContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  width: 70%;
  height: calc(100vh - 48px);
  margin: 24px 24px 24px 0px;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 1);
`;

const ChatBarContainer = styled.div`
  height: 76px;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Line = styled.div`
  width: 100%;
  height: 4px;
  background-color: rgba(233, 232, 240, 1);
`;

const BlahContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  background-color: rgba(255, 255, 255, 1);

  width: calc(100% - 48px);
  height: calc(100vh - 300px);
  overflow-y: scroll;
  padding: 24px 24px 24px 24px;
  border-radius: 4px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 1);
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 1);
    border-radius: 4px;
  }
`;

const InputContainer = styled.div`
  width: calc(100% - 48px);
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  height: 72px;
  margin-bottom: 24px;
  background-color: rgba(244, 243, 251, 1);
  border-radius: 10px;
`;

const InputBox = styled.input`
  width: calc(100% - 48px);
  height: 40px;
  border-radius: 4px;
  word-break: break-all;
  border: none;
  background-color: rgba(244, 243, 251, 1);
  padding-left: 24px;
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 21px;
  :focus {
    outline: none;
  }
`;

const SendButton = styled.button`
  width: 80px;
  height: 40px;
  border-radius: 10px;
  border: none;
  background: rgba(255, 81, 0, 1);
  color: rgba(255, 255, 255, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  cursor: pointer;
  &:active {
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 10px;
  }
`;

const FileAddButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 4px;
  background: rgba(244, 243, 251, 1);
  color: rgba(255, 81, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const FileInput = styled.input``;

export const hexToRGBA = (hex: string): string => {
  if (!hex.startsWith("#") || hex.length !== 7) {
    return hex;
  }

  const parsing = (h: string, start: number, end: number): number =>
    parseInt(h.slice(start, end), 10);

  const tempHex = hex.slice(1);

  const r = parsing(tempHex, 0, 2);
  const g = parsing(tempHex, 2, 4);
  const b = parsing(tempHex, 4, 6);

  return `rgba(${r}, ${g}, ${b}, 1)`;
};
