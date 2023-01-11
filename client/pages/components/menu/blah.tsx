import styled from "styled-components";
import { Send } from "@styled-icons/ionicons-sharp/Send";
import { useEffect, useState, useRef } from "react";
import ChatBox from "./chatBox";
import { io } from "socket.io-client";
import { PlusCircle } from "@styled-icons/bootstrap/PlusCircle";

type Props = {
  roomData: any;
};

interface IChat {
  username: string;
  message: string;
}

const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;
const socket = io(`${SERVER_URI}/chat`);

export default function Blah(props: Props) {
  const [inputData, setInputData] = useState<string>("");
  const [updateData, setUpdateData] = useState<any>();
  const [chats, setChats] = useState<IChat>();
  const [check, setCheck] = useState<number>(0);
  const [files, setFiles] = useState<File[]>([]);
  const ref = useRef<HTMLInputElement>(null);
  const userData = JSON.parse(localStorage.getItem("userData") as string);
  const accessToken = JSON.parse(localStorage.getItem("userToken") as string);

  const chatUser: string[] = [];

  for (let i = 0; i < props.roomData.user.length; i++) {
    if (props.roomData.user[i] !== userData.username) {
      chatUser.push(props.roomData.user[i].email);
    }
  }

  useEffect(() => {
    const messageHandler = (chat: IChat) => setChats(chat);
    socket.on("message", messageHandler);
    return () => {
      socket.off("message", messageHandler);
    };
  }, []);

  useEffect(() => {
    const blah = document.getElementById("blah");
    blah?.scrollIntoView({ behavior: "auto", block: "end", inline: "end" });
  }, [updateData]);

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
      setUpdateData(json.data);
    })();
  }, [chats, props.roomData]);

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
          _id: props.roomData._id,
          username: userData.username,
        };
        socket.emit("message", data, (chat: any) => {
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
        const data = {
          _id: props.roomData._id,
          username: userData.username,
        };
        socket.emit("message", data, (chat: any) => {
          setUpdateData(chat);
          setInputData("");
          setCheck(chat.blah.length);
        });
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
      <BlahContainer>
        {updateData &&
          updateData.blah.map((one: any, idx: number) => (
            <ChatBox
              chatData={one}
              key={one.date}
              _id={props.roomData._id}
              idx={idx}
              check={check}
              chats={chats}
              roomData={props.roomData}
            />
          ))}
        <div id="blah"></div>
      </BlahContainer>
      <InputContainer>
        <InputBox onChange={(evt) => setInputData(evt.currentTarget.value)} value={inputData} />
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
          <Send />
        </SendButton>
      </InputContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  width: 65%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 16px;
`;

const BlahContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  background-color: #e6e0f8;

  width: calc(100% - 32px);
  height: 80vh;
  overflow-y: scroll;
  padding: 1rem 1rem 0 1rem;
  border-radius: 8px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    border-radius: 8px;
    background: #e6e0f8;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
  }
`;

const InputBox = styled.input`
  border-radius: 8px;
  padding: 0 1rem;
  word-break: break-all;
  box-sizing: border-box;
  height: 40px;
  border: 1px solid black;
  flex: 1;
`;

const SendButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  box-sizing: border-box;
  padding: 0.6rem;
  background: #b8d60c;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const InputContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  gap: 0.5rem;
  height: 40px;
`;

const FileAddButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #3030b9;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const FileInput = styled.input``;

export const hexToRGBA = (hex: string): string => {
  // #e6e0f8
  if (!hex.startsWith("#") || hex.length !== 7) {
    return hex;
  }

  const parsing = (h: string, start: number, end: number): number =>
    parseInt(h.slice(start, end), 10);

  const tempHex = hex.slice(1);

  // e6 e0 f8
  const r = parsing(tempHex, 0, 2);
  const g = parsing(tempHex, 2, 4);
  const b = parsing(tempHex, 4, 6);

  // alpha = 투명도 opacity의 반대 의미
  return `rgba(${r}, ${g}, ${b}, 1)`;
};
