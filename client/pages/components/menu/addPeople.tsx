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
  const userData = JSON.parse(localStorage.getItem("userData") as string);
  const accessToken = JSON.parse(localStorage.getItem("userToken") as string);
  const emailRegex =
    /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;

  const addHandle = async () => {
    if (!emailRegex.test(email)) {
      setEmailErrMsg("이메일 형식이 아닙니다.");
    } else {
      const response = await fetch(`${SERVER_URI}/account/emailCheck?email=${email}`, {
        method: "GET",
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:3000",
        },
      });
      const json = await response.json();
      if (!json.data) {
        setEmailErrMsg("없는 계정입니다.");
      } else {
        if (json.data.email === userData.userId) {
          setEmailErrMsg("자기 자신은 추가할 수 없습니다.");
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
            setEmailErrMsg("이미 추가된 이메일입니다.");
          } else {
            props.setOpen(!props.open);
            alert("추가완료.");
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
        <Title>이메일을 입력해주세요.</Title>
        <div style={{ width: "40px" }} />
      </TitleContainer>
      <EmailInput type={"email"} onChange={(evt) => setEmail(evt.currentTarget.value)} />
      {emailErrMsg && <ErrMsg>{emailErrMsg}</ErrMsg>}
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
  background-color: #ffffff;
  border: none;
  border-radius: 1rem;
  gap: 1.5rem;
  width: 30%;
  min-width: 400px;
  padding: 1rem;
  position: sticky;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
`;

const CloseButton = styled.button`
  border: none;
  background: #ffffff;
  cursor: pointer;
  svg {
    width: 30px;
    height: 30px;
  }
`;

const Title = styled.span`
  font-size: 1.4rem;
`;

const EmailInput = styled.input`
  width: 80%;
`;

const AddButton = styled.button`
  border: none;
  background: #8181f7;
  width: 50%;
  height: 40px;
  border-radius: 8px;
  font-size: 1.3rem;
  color: #ffffff;
  cursor: pointer;
`;

const ErrMsg = styled.span`
  font-size: 1rem;
  color: #ff0000;
`;
