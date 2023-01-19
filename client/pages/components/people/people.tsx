import styled from "styled-components";
import ConnectionList from "./connectionList";
import { useState } from "react";

const connection = [
  { status: "온라인" },
  { status: "오프라인" },
  // { status: "보낸요청" },
  // { status: "받은요청" },
];

export default function People() {
  const [open, setOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const userData = JSON.parse(sessionStorage.getItem("userData") as string);
  const accessToken = JSON.parse(sessionStorage.getItem("userToken") as string);
  const emailRegex =
    /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;

  const addHandle = async () => {
    if (!emailRegex.test(email)) {
      alert("이메일 형식이 아닙니다");
    } else {
      const response = await fetch(`${SERVER_URI}/account/emailCheck?email=${email}`, {
        method: "GET",
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:3000",
        },
      });
      const json = await response.json();
      if (!json.data) {
        alert("없는 계정입니다");
      } else {
        if (json.data.email === userData.userId) {
          alert("자기 자신은 추가할 수 없습니다");
        } else {
          const result = await fetch(`${SERVER_URI}/people/add`, {
            method: "POST",
            body: JSON.stringify({
              user: userData.username,
              friend: {
                email: email,
                name: json.data.name,
                phoneNumber: json.data.phoneNumber,
                filename: json.data.filename,
              },
            }),
            headers: {
              Authorization: `bearer ${accessToken}`,
              "Content-type": "application/json",
              "Access-Control-Allow-Origin": "http://localhost:3000",
            },
          });
          const rstJson = await result.json();
          if (rstJson.statusCode === 401) {
            alert("이미 추가된 이메일입니다");
          } else {
            setEmail("");
            alert("추가완료");
          }
        }
      }
    }
  };

  return (
    <Container>
      <TitleText>친구목록</TitleText>
      <InputContainer>
        <EmailInput
          placeholder="이메일을 입력해주세요."
          type={"email"}
          onChange={(evt) => setEmail(evt.currentTarget.value)}
          value={email}
        />
        <AddFriendButton onClick={addHandle}>친구추가</AddFriendButton>
      </InputContainer>
      <InnerContainer>
        {connection.map((one) => (
          <ConnectionList key={one.status} tag={one.status} open={open} />
        ))}
      </InnerContainer>
    </Container>
  );
}

const Container = styled.div`
  width: 380px;
  height: calc(100vh - 76px);
  margin: 24px 24px 24px 24px;
  padding: 14px 14px 14px 14px;
  display: flex;
  flex-direction: column;
  background-color: rgba(255, 255, 255, 1);
  border: none;
  border-radius: 20px;
`;

const TitleText = styled.div`
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 700;
  font-size: 22px;
  line-height: 26px;
  margin-top: 10px;
  margin-left: 24px;
  margin-bottom: 30px;
`;

const InputContainer = styled.div`
  width: 400px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const AddFriendButton = styled.button`
  width: 68px;
  height: 22px;
  border: none;
  background: rgba(255, 255, 255, 1);
  color: rgba(255, 81, 0, 1);
  margin-left: 8px;

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;

  cursor: pointer;

  &:active {
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
  }
`;

const EmailInput = styled.input`
  width: 270px;
  height: 32px;
  padding-left: 12px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(223, 222, 236, 1);
  border-radius: 8px;
  margin-left: 24px;

  color: rgba(153, 151, 172, 1);
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
`;

const InnerContainer = styled.div`
  margin-top: 23px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 31px;
`;
