import { useState } from "react";
import styled from "styled-components";
import { Back } from "@styled-icons/entypo/Back";

type Props = {
  open: boolean;
  setOpen: Function;
};

export default function AddPeople(props: Props) {
  const [email, setEmail] = useState<string>("");
  const [emailErrMsg, setEmailErrMsg] = useState<string>();
  const userData = JSON.parse(sessionStorage.getItem("userData") as string);
  const accessToken = JSON.parse(sessionStorage.getItem("userToken") as string);
  const emailRegex =
    /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;

  const addHandle = async () => {
    if (!emailRegex.test(email)) {
      setEmailErrMsg("이메일 형식이 아닙니다");
    } else {
      const response = await fetch(`${SERVER_URI}/account/emailCheck?email=${email}`, {
        method: "GET",
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:3000",
        },
      });
      const json = await response.json();
      if (!json.data) {
        setEmailErrMsg("없는 계정입니다");
      } else {
        if (json.data.email === userData.userId) {
          setEmailErrMsg("자기 자신은 추가할 수 없습니다");
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
            setEmailErrMsg("이미 추가된 이메일입니다");
          } else {
            props.setOpen(!props.open);
            alert("추가완료");
          }
        }
      }
    }
  };

  return (
    <Container>
      <TitleContainer>
        <CloseButton onClick={() => props.setOpen(!props.open)}>
          <Back />
        </CloseButton>
        <Title>
          <b>이메일을 입력해주세요</b>
        </Title>
        <div style={{ width: "40px" }} />
      </TitleContainer>
      {emailErrMsg && (
        <ErrMsg>
          <b>{emailErrMsg}</b>
        </ErrMsg>
      )}
      <EmailInput type={"email"} onChange={(evt) => setEmail(evt.currentTarget.value)} />
      <AddButton onClick={addHandle}>
        <b>추가하기</b>
      </AddButton>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: rgba(255, 255, 255, 1);
  border: none;
  border-radius: 4px;
  gap: 1.5rem;
  width: 20%;
  min-width: 400px;
  padding: 1.5rem;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
`;

const CloseButton = styled.button`
  border: none;
  background: rgba(255, 255, 255, 1);
  cursor: pointer;
  svg {
    width: 30px;
    height: 30px;
  }
  &:active {
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
  }
`;

const Title = styled.span`
  font-size: 1.5rem;
`;

const EmailInput = styled.input`
  padding: 0.7rem;
  width: 80%;
  border: 1px solid;
  border-radius: 4px;
  font-size: 1.5rem;
`;

const AddButton = styled.button`
  border: none;
  background: rgba(112, 200, 255, 1);
  width: 50%;
  border-radius: 4px;
  padding: 0.5rem;
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 1);
  cursor: pointer;
  &:active {
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
  }
`;

const ErrMsg = styled.span`
  font-size: 1rem;
  color: rgba(255, 0, 0, 1);
`;
