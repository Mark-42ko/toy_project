import { GlobalContext } from "pages/_app";
import { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import styled from "styled-components";
import { FileEarmarkArrowDown } from "@styled-icons/bootstrap/FileEarmarkArrowDown";

type Props = {
  chatData: any;
  _id: string;
  idx: number;
  check: number;
  chats: any;
  roomData: any;
};

const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;
const socket = io(`${SERVER_URI}/chat`);

export default function ChatBox(props: Props) {
  const [counting, setCounting] = useState<number | undefined>();
  const dataDate = new Date(props.chatData.date).toLocaleString("ko-kr").split(" ");
  const dataTime = dataDate[4].split(":");
  const [chats, setChats] = useState<any>();
  const [imageFileUrl, setImageFileUrl] = useState<string>();

  const timeStamp = `${dataDate[3]} ${dataTime[0]}:${dataTime[1]}`;

  const ctx = useContext(GlobalContext);
  const check = props.chatData.name === ctx?.userData?.username ? true : false;

  let extension;
  if (props.chatData.filename) {
    extension = props.chatData.filename.split(".")[props.chatData.filename.split(".").length - 1];
  }
  const data = {
    _id: props._id,
    idx: props.idx,
    email: ctx?.userData?.userId,
  };

  useEffect(() => {
    const messageHandler = (chat: any) => {
      return setChats(Math.random());
    };
    socket.on("chat", messageHandler);
    return () => {
      socket.off("chat", messageHandler);
    };
  }, [props.roomData]);

  useEffect(() => {
    socket.emit("chat", data, (chat: any) => {
      setChats(Math.random());
    });
  }, [props.roomData]);

  useEffect(() => {
    !(async function () {
      await fetch(`${SERVER_URI}/blah/updateCount`, {
        method: "POST",
        body: JSON.stringify({
          _id: props._id,
          idx: props.idx,
          email: ctx?.userData?.userId,
        }),
        headers: {
          Authorization: `bearer ${ctx?.accessToken}`,
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000",
        },
      });
    })();
  }, []);

  useEffect(() => {
    !(async function () {
      const result = await fetch(`${SERVER_URI}/blah/room?id=${props._id}`, {
        method: "GET",
        headers: {
          Authorization: `bearer ${ctx?.accessToken}`,
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000",
        },
      });
      const json = await result.json();
      json.data.blah[props.idx] && setCounting(await json.data.blah[props.idx].counts.length);
      if (props.chatData.filename) {
        const extension =
          props.chatData.filename.split(".")[props.chatData.filename.split(".").length - 1];
        if (
          extension === "jpg" ||
          extension === "jpeg" ||
          extension === "png" ||
          extension === "gif"
        ) {
          const result = await fetch(
            `${SERVER_URI}/blah/download?filename=${props.chatData.filename}`,
            {
              method: "GET",
              headers: {
                Authorization: `bearer ${ctx?.accessToken}`,
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "http://localhost:3000",
              },
            },
          );
          const file = await result.blob();
          const downloadUrl = window.URL.createObjectURL(file);
          setImageFileUrl(downloadUrl);
        }
      }
    })();
  }, [chats, props.roomData]);

  const downloadHandle = async () => {
    const result = await fetch(`${SERVER_URI}/blah/download?filename=${props.chatData.filename}`, {
      method: "GET",
      headers: {
        Authorization: `bearer ${ctx?.accessToken}`,
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000",
      },
    });
    const file = await result.blob();
    const downloadUrl = window.URL.createObjectURL(file);

    const anchorElement = document.createElement("a");
    document.body.appendChild(anchorElement);
    anchorElement.download = props.chatData.filename;
    anchorElement.href = downloadUrl;

    anchorElement.click();

    document.body.removeChild(anchorElement);
    window.URL.revokeObjectURL(downloadUrl);
  };

  return (
    <Container check={check}>
      {check ? (
        <ProfileContainer>
          <MinInfoContainer check={check}>
            {counting !== 0 && <CountCheck>{counting}</CountCheck>}
            <TimeLine>{timeStamp}</TimeLine>
          </MinInfoContainer>
          {props.chatData.filename ? (
            <FileButton onClick={downloadHandle} type={"submit"}>
              {(extension === "jpg" ||
                extension === "jpeg" ||
                extension === "png" ||
                extension === "gif") &&
                (imageFileUrl ? (
                  <img src={imageFileUrl} width={200} height={200} />
                ) : (
                  <ImgLoading></ImgLoading>
                ))}
              <ImgInfoDiv>
                <FileEarmarkArrowDown height={50} width={40} />
                <FileInfoText>{props.chatData.comments}</FileInfoText>
              </ImgInfoDiv>
            </FileButton>
          ) : (
            <InnerContainer>
              <TextBox check={check}>{props.chatData.comments}</TextBox>
            </InnerContainer>
          )}
        </ProfileContainer>
      ) : (
        <ProfileContainer>
          <ProfileDiv />
          <InnerContainer>
            <NameTag>
              <b>{props.chatData.name}</b>
            </NameTag>
            {props.chatData.filename ? (
              <FileButton onClick={downloadHandle} type={"submit"}>
                {(extension === "jpg" ||
                  extension === "jpeg" ||
                  extension === "png" ||
                  extension === "gif") &&
                  (imageFileUrl ? (
                    <img src={imageFileUrl} width={200} height={200} />
                  ) : (
                    <ImgLoading></ImgLoading>
                  ))}
                <ImgInfoDiv>
                  <FileEarmarkArrowDown height={50} width={40} />
                  <FileInfoText>{props.chatData.comments}</FileInfoText>
                </ImgInfoDiv>
              </FileButton>
            ) : (
              <InnerContainer>
                <TextBox check={check}>{props.chatData.comments}</TextBox>
              </InnerContainer>
            )}
          </InnerContainer>
          <MinInfoContainer check={check}>
            {counting !== 0 && <CountCheck>{counting}</CountCheck>}
            <TimeLine>{timeStamp}</TimeLine>
          </MinInfoContainer>
        </ProfileContainer>
      )}
    </Container>
  );
}

type CheckProps = {
  check: boolean;
};

const Container = styled.div`
  width: 90%;
  display: flex;
  justify-content: ${(props: CheckProps) => (props.check === true ? "end" : "start")};
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
`;

const ProfileDiv = styled.div`
  background-image: url("/images/defaultGuest.jpg");
  background-size: cover;
  width: 65px;
  height: 65px;
  border: none;
  border-radius: 20px;
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const NameTag = styled.span`
  font-size: 1.3rem;
`;

const TextBox = styled.span`
  display: flex;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  background-color: ${(props: CheckProps) => (props.check === true ? "#F4FA58" : "#FFFFFF")};
  border: none;
  border-radius: 1rem;
  padding: 1rem;
  word-break: break-all;
`;

const MinInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: ${(props: CheckProps) => (props.check === true ? "end" : "start")};
  margin-left: 1rem;
`;

const CountCheck = styled.label`
  color: #ffff00;
`;

const TimeLine = styled.label``;

const FileButton = styled.button`
  display: flex;
  flex-direction: column;
  border: none;
  background: #ffffff;
  border-radius: 1rem;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
`;

const ImgInfoDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: 100%;
`;

const FileInfoText = styled.span`
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border: none;
  border-radius: 1rem;
  padding: 1rem;
  word-break: break-all;
`;

const ImgLoading = styled.div`
  width: 200px;
  height: 200px;
  background-color: #ffffff;
`;
