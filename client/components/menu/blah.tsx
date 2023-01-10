import styled from "styled-components";
import { Send } from "@styled-icons/ionicons-sharp/Send";
import { useContext, useEffect, useState, useRef } from "react";
import ChatBox from "./chatBox";
import { GlobalContext } from "pages/_app";
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

  const ctx = useContext(GlobalContext);

  const chatUser: string[] = [];

  for (let i = 0; i < props.roomData.user.length; i++) {
    if (props.roomData.user[i] !== ctx?.userData?.username) {
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
    // scrollRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
    const blah = document.getElementById("blah");
    blah?.scrollIntoView({ behavior: "auto", block: "end", inline: "end" });
  }, [updateData]);

  useEffect(() => {
    !(async function () {
      const result = await fetch(`${SERVER_URI}/blah/room?id=${props.roomData._id}`, {
        method: "GET",
        headers: {
          Authorization: `bearer ${ctx?.accessToken}`,
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000",
        },
      });
      const json = await result.json();
      setUpdateData(json.data);
    })();
  }, [chats, props.roomData]);

  const inputButtonHandle = async () => {
    console.log(files);
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
            Authorization: `bearer ${ctx?.accessToken}`,
            "Access-Control-Allow-Origin": "http://localhost:3000",
          },
        });
        const json = await response.json();
        console.log(json);
        await fetch(`${SERVER_URI}/blah/chatAdd`, {
          method: "Post",
          body: JSON.stringify({
            _id: props.roomData._id,
            blah: {
              name: ctx?.userData?.username,
              comments: json.fileOriginName,
              date: new Date(),
              counts: chatUser,
              filePath: json.filePath,
              filename: json.filename,
              filesize: json.filesize,
            },
          }),
          headers: {
            Authorization: `bearer ${ctx?.accessToken}`,
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": "http://localhost:3000",
          },
        });
        const data = {
          _id: props.roomData._id,
          username: ctx?.userData?.username,
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
              name: ctx?.userData?.username,
              comments: inputData,
              date: new Date(),
              counts: chatUser,
            },
          }),
          headers: {
            Authorization: `bearer ${ctx?.accessToken}`,
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": "http://localhost:3000",
          },
        });
        const data = {
          _id: props.roomData._id,
          username: ctx?.userData?.username,
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
  gap: 2rem;
`;

const BlahContainer = styled.div`
  display: flex;
  background-color: #e6e0f8;
  width: 100%;
  height: 80vh;
  border: none;
  border-radius: 1rem;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  padding-right: 1.5rem;
  flex-direction: column;
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

const InputBox = styled.input`
  width: 80%;
  height: 3vh;
  border-radius: 3rem;
  padding: 1rem;
  word-break: break-all;
`;

const SendButton = styled.button`
  width: 60px;
  height: 60px;
  border: none;
  border-radius: 50px;
  padding: 0.6rem;
  background: #0000ff;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InputContainer = styled.div`
  width: 100%;
  height: 3vh;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  gap: 0.5rem;
`;

const FileAddButton = styled.button`
  width: 4rem;
  height: 4rem;
  border: none;
  border-radius: 50px;
  background: #0000ff;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FileInput = styled.input``;
