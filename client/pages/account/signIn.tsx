import styled from "styled-components";
import { useRouter } from "next/router";
import { useState, useContext, useEffect } from "react";
import SignUp from "./signUp";
import { GlobalContext } from "pages/_app";
// import { Google } from '@styled-icons/bootstrap/Google';

export default function SignInPage() {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;
  const ctx = useContext(GlobalContext);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") as string);
    const accessToken = JSON.parse(localStorage.getItem("userToken") as string);
    if (userData && accessToken) {
      alert("이미 로그인 되어있습니다. 로그아웃 후 진행해주세요.");
      router.push("/");
    }
  }, []);

  const signInHandle = async () => {
    const response = await fetch(`${SERVER_URI}/auth/login`, {
      method: "POST",
      body: JSON.stringify({
        username: email,
        password: password,
      }),
      headers: {
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000",
      },
    });
    const json = await response.json();
    if (json.access_token) {
      ctx!.setAccessToken!(json.access_token);
      const responses = await fetch(`${SERVER_URI}/auth/profile`, {
        method: "GET",
        headers: {
          Authorization: `bearer ${json.access_token}`,
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000",
        },
      });
      const jsons = await responses.json();
      ctx!.setUserData!(jsons);
      localStorage.setItem("userToken", JSON.stringify(json.access_token));
      localStorage.setItem("userData", JSON.stringify(jsons));
      router.push("/");
    } else {
      alert("아이디 및 비밀번호를 확인해주세요.");
    }
  };

  const signUpModalHandle = () => {
    setOpen(!open);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "90vh",
      }}
    >
      <Container>
        <TitleText>
          <b>채널톡</b>
        </TitleText>
        <div>
          <InnerContainer>
            <TextArea>ID : </TextArea>
            <TextInput type={"email"} onChange={(evt) => setEmail(evt.currentTarget.value)} />
          </InnerContainer>
          <InnerContainer style={{ marginTop: 10 }}>
            <TextArea>PW : </TextArea>
            <TextInput type={"password"} onChange={(evt) => setPassword(evt.currentTarget.value)} />
          </InnerContainer>
        </div>
        <SiginButton onClick={signInHandle}>
          <b>로그인</b>
        </SiginButton>
        {/* <SiginButton onClick={() => signIn('google')}><Google style={{ width: 30, height:30, color:"white" }} /><b>구글로그인</b></SiginButton> */}
        <InnerContainer>
          <TextArea>계정이 없으신가요?</TextArea>
          <SignUpButton onClick={signUpModalHandle}>
            <b>
              <u>회원가입</u>
            </b>
          </SignUpButton>
          {open ? (
            <ModalBackdrop>
              <SignUp signUpModalHandle={signUpModalHandle} />
            </ModalBackdrop>
          ) : null}
        </InnerContainer>
      </Container>
    </div>
  );
}

const Container = styled.div`
  width: 30%;
  hight: 50%;
  min-width: 300px;
  min-height: 300px;
  border: none;
  background-color: #f0f0f0;
  border-radius: 20px;
  padding: 2em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1em;
`;

const InnerContainer = styled.div`
  width: 230px;
  display: flex;
  justify-content: space-between;
`;

const TitleText = styled.h1`
  font-size: 2rem;
`;

const TextArea = styled.span`
  width: 200px;
  hight: 50px;
`;

const TextInput = styled.input`
  width: 170px;
`;

const SiginButton = styled.button`
  width: 230px;
  border: none;
  font-size: 1.2rem;
  background: #5858fa;
  border-radius: 10px;
  align-items: center;
  cursor: pointer;
`;

const SignUpButton = styled.button`
  border: none;
  background: #f0f0f0;
  color: #0000ff;
  width: 100px;
  font-size: 1rem;
  cursor: pointer;
`;

const ModalBackdrop = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  right: 0;
  top: 0;
  display: flex;
  flex-flow: row wrep;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
`;
