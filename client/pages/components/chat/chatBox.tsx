import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import styled from "styled-components";
import { FileEarmarkArrowDown } from "@styled-icons/bootstrap/FileEarmarkArrowDown";
import Image from "next/image";

type Props = {
  chatData: any;
  _id: string;
  idx: number;
  check: number;
  roomData: any;
  setRerendering: Function;
  rerendering: number;
};

const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;
const socket = io(`${SERVER_URI}/chat`);

export default function ChatBox(props: Props) {
  const [counting, setCounting] = useState<number | undefined>();
  const dataDate = new Date(props.chatData.date).toLocaleString("ko-kr").split(" ");
  const dataTime = dataDate[4].split(":");
  const [chats, setChats] = useState<any>();
  const [imageFileUrl, setImageFileUrl] = useState<string>();
  const [profile, setProfile] = useState<string>();

  const userData = JSON.parse(sessionStorage.getItem("userData") as string);
  const accessToken = JSON.parse(sessionStorage.getItem("userToken") as string);

  const urlRegex =
    /(((http(s)?:\/\/)\S+(\.[^(\n|\t|\s,)]+)+)|((http(s)?:\/\/)?(([a-zA-z\-_]+[0-9]*)|([0-9]*[a-zA-z\-_]+)){2,}(\.[^(\n|\t|\s,)]+)+))+/gi;
  const timeStamp = `${dataDate[3]} ${dataTime[0]}:${dataTime[1]}`;

  const check = props.chatData.name === userData.username ? true : false;

  let extension;
  if (props.chatData.filename) {
    extension = props.chatData.filename.split(".")[props.chatData.filename.split(".").length - 1];
  }
  const data = {
    _id: props._id,
    idx: props.idx,
    email: userData.userId,
  };

  useEffect(() => {
    socket.emit("join-room", props.roomData._id, () => {});
    const messageHandler = (chat: any) => {
      setChats(Math.random());
      props.setRerendering(Math.random());
    };
    socket.on("chat", messageHandler);
    return () => {
      socket.off("chat", messageHandler);
    };
  }, []);

  useEffect(() => {
    socket.emit("chat", data, (chat: any) => {
      setChats(Math.random());
    });
  }, []);

  useEffect(() => {
    !(async function () {
      const result = await fetch(`${SERVER_URI}/blah/room?id=${props._id}`, {
        method: "GET",
        headers: {
          Authorization: `bearer ${accessToken}`,
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000",
        },
      });
      const json = await result.json();
      json.data.blah[props.idx] && setCounting(await json.data.blah[props.idx].counts.length);
    })();
  }, [chats, props.rerendering]);

  useEffect(() => {
    !(async function () {
      if (props.chatData.profile) {
        const extension =
          props.chatData.profile.split(".")[props.chatData.profile.split(".").length - 1];
        if (
          extension === "jpg" ||
          extension === "jpeg" ||
          extension === "png" ||
          extension === "gif" ||
          extension === "webp"
        ) {
          const result = await fetch(
            `${SERVER_URI}/blah/download?filename=${props.chatData.profile}`,
            {
              method: "GET",
              headers: {
                Authorization: `bearer ${accessToken}`,
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "http://localhost:3000",
              },
            },
          );
          const file = await result.blob();
          const downloadUrl = window.URL.createObjectURL(file);
          setProfile(downloadUrl);
        }
      }
    })();
  }, []);

  useEffect(() => {
    !(async function () {
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
                Authorization: `bearer ${accessToken}`,
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
  }, []);

  const downloadHandle = async () => {
    const result = await fetch(`${SERVER_URI}/blah/download?filename=${props.chatData.filename}`, {
      method: "GET",
      headers: {
        Authorization: `bearer ${accessToken}`,
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

  const linkClickHandle = () => {
    let url = props.chatData.comments;
    if (
      !props.chatData.comments.includes("http://") &&
      !props.chatData.comments.includes("https://")
    ) {
      url = `http://${props.chatData.comments}`;
    }
    const anchorElement = document.createElement("a");
    document.body.appendChild(anchorElement);
    anchorElement.href = url;
    anchorElement.target = "_blank";

    anchorElement.click();

    document.body.removeChild(anchorElement);
  };

  return (
    <Container check={check}>
      {props.chatData.name === "알림" ? (
        <SystemMsg>
          <b>{props.chatData.comments}</b>
        </SystemMsg>
      ) : check ? (
        <ProfileContainer>
          <MinInfoContainer check={check}>
            {counting !== 0 && <CountCheck>{counting}</CountCheck>}
            <TimeLine>{timeStamp}</TimeLine>
          </MinInfoContainer>
          {props.chatData.filename ? (
            <FileButton
              onClick={downloadHandle}
              type={"submit"}
              title="이미지 다운로드하기"
              check={check}
            >
              {(extension === "jpg" ||
                extension === "jpeg" ||
                extension === "png" ||
                extension === "gif") &&
                (imageFileUrl ? (
                  <Image src={imageFileUrl} width={200} height={200} alt="url" />
                ) : (
                  <ImgLoading></ImgLoading>
                ))}
              <ImgInfoDiv>
                <FileEarmarkArrowDown
                  height={35}
                  width={25}
                  style={{ color: "rgba(255, 255, 255, 1)" }}
                />
                <FileInfoText>{props.chatData.comments}</FileInfoText>
              </ImgInfoDiv>
            </FileButton>
          ) : (
            <InnerContainer>
              {urlRegex.test(props.chatData.comments) ? (
                <LinkText check={check} onClick={linkClickHandle}>
                  <u>{props.chatData.comments}</u>
                </LinkText>
              ) : (
                <TextBox check={check}>{props.chatData.comments}</TextBox>
              )}
            </InnerContainer>
          )}
        </ProfileContainer>
      ) : (
        <ProfileContainer>
          {profile ? (
            props.chatData.name === "챗봇" ? (
              <Image
                src={profile}
                alt="프로필이미지"
                width={65}
                height={65}
                style={{ borderRadius: "50%", border: "3px solid rgba(0,0,255,1)" }}
              />
            ) : (
              <Image
                src={profile}
                alt="프로필이미지"
                width={65}
                height={65}
                style={{ borderRadius: "50%" }}
              />
            )
          ) : (
            <ProfileDiv />
          )}
          <InnerContainer>
            <NameTag>{props.chatData.name}</NameTag>
            {props.chatData.filename ? (
              <FileButton
                onClick={downloadHandle}
                type={"submit"}
                title="이미지 다운로드하기"
                check={check}
              >
                {(extension === "jpg" ||
                  extension === "jpeg" ||
                  extension === "png" ||
                  extension === "gif") &&
                  (imageFileUrl ? (
                    <Image src={imageFileUrl} width={200} height={200} alt="이미지 다운로드하기" />
                  ) : (
                    <ImgLoading></ImgLoading>
                  ))}
                <ImgInfoDiv>
                  <FileEarmarkArrowDown
                    height={35}
                    width={25}
                    style={{ color: "rgba(255, 255, 255, 1)" }}
                  />
                  <FileInfoText>{props.chatData.comments}</FileInfoText>
                </ImgInfoDiv>
              </FileButton>
            ) : (
              <InnerContainer>
                {urlRegex.test(props.chatData.comments) ? (
                  <LinkText check={check} onClick={linkClickHandle}>
                    <u>{props.chatData.comments}</u>
                  </LinkText>
                ) : props.chatData.name === "챗봇" ? (
                  <TextBox check={check} style={{ border: "3px solid rgba(0,0,255,1)" }}>
                    {props.chatData.comments}
                  </TextBox>
                ) : (
                  <TextBox check={check}>{props.chatData.comments}</TextBox>
                )}
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
  display: flex;
  width: 100%;
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
  border-radius: 50%;
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const NameTag = styled.span`
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 21px;
`;

const TextBox = styled.span`
  display: flex;
  align-items: center;
  border-radius: ${(props: CheckProps) =>
    props.check === true ? "10px 0px 10px 10px" : "0px 10px 10px 10px"};
  background-color: ${(props: CheckProps) =>
    props.check === true ? "rgba(255, 81, 0, 1)" : "rgba(52, 51, 67, 1)"};
  border: none;
  padding: 1rem;
  word-break: break-all;
  max-width: 450px;
  color: rgba(255, 255, 255, 1);

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
`;

const MinInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: ${(props: CheckProps) => (props.check === true ? "end" : "start")};
`;

const CountCheck = styled.label`
  color: rgba(153, 151, 172, 1);

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
`;

const TimeLine = styled.label`
  color: rgba(153, 151, 172, 1);

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
`;

const FileButton = styled.button`
  display: flex;
  flex-direction: column;
  border: none;
  background-color: ${(props: CheckProps) =>
    props.check === true ? "rgba(255, 81, 0, 1)" : "rgba(52, 51, 67, 1)"};
  border-radius: ${(props: CheckProps) =>
    props.check === true ? "10px 0px 10px 10px" : "0px 10px 10px 10px"};
  align-items: center;
  padding: 1rem;
  gap: 1rem;
  cursor: pointer;
`;

const ImgInfoDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: 100%;
`;

const FileInfoText = styled.span`
  display: flex;
  align-items: center;
  border: none;
  padding: 1rem;
  word-break: break-all;
  color: rgba(255, 255, 255, 1);

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 19px;
`;

const ImgLoading = styled.div`
  width: 200px;
  height: 200px;
  background-color: rgba(255, 255, 255, 1);
`;

const LinkText = styled.button`
  color: rgba(46, 100, 254, 1);
  display: flex;
  display: flex;
  align-items: center;
  background-color: ${(props: CheckProps) =>
    props.check === true ? "rgba(255, 81, 0, 1)" : "rgba(52, 51, 67, 1)"};
  border: none;
  border-radius: ${(props: CheckProps) =>
    props.check === true ? "10px 0px 10px 10px" : "0px 10px 10px 10px"};
  padding: 1rem;
  word-break: break-all;

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 19px;
`;

const SystemMsg = styled.span`
  width: 100%;
  display: flex;
  justify-content: center;
  font-size: 1rem;
`;
