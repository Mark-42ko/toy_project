import styled from "styled-components";
import { useRouter } from "next/router";
import { useState, useContext, useEffect } from "react";
import SignUp from "../components/account/signUp";
import { GlobalContext } from "pages/_app";
import { ChatQuoteFill } from "@styled-icons/bootstrap/ChatQuoteFill";
import Image from "next/image";

export default function SignInPage() {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;
  const ctx = useContext(GlobalContext);

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("userData") as string);
    const accessToken = JSON.parse(sessionStorage.getItem("userToken") as string);
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
      await fetch(`${SERVER_URI}/online/create`, {
        method: "POST",
        body: JSON.stringify({
          email: jsons.userId,
          name: jsons.username,
          phoneNumber: jsons.userPhoneNumber,
          filename: jsons.filename,
        }),
        headers: {
          Authorization: `bearer ${json.access_token}`,
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:3000",
        },
      });
      sessionStorage.setItem("userToken", JSON.stringify(json.access_token));
      sessionStorage.setItem("userData", JSON.stringify(jsons));
      router.push("/");
    } else {
      alert("아이디 및 비밀번호를 확인해주세요.");
    }
  };

  const signUpModalHandle = () => {
    setOpen(!open);
  };

  return (
    <BigContainer>
      <LogoBar />
      <Image
        src={"/images/Vector.png"}
        alt={"로고 이미지"}
        width={17}
        height={20}
        style={{
          position: "absolute",
          left: "104px",
          top: "13px",
          color: "rgba(255, 81, 0, 1)",
        }}
      />
      <LogoText>채널톡</LogoText>
      <Container>
        <TitleText>로그인</TitleText>
        <MiddleContainer>
          <InnerContainer>
            <TextArea>아이디</TextArea>
            <TextInput type={"email"} onChange={(evt) => setEmail(evt.currentTarget.value)} />
          </InnerContainer>
          <InnerContainer>
            <TextArea>비밀번호</TextArea>
            <TextInput type={"password"} onChange={(evt) => setPassword(evt.currentTarget.value)} />
          </InnerContainer>
        </MiddleContainer>
        <SecondMiddleContainer>
          <SiginButton onClick={signInHandle}>
            <b>로그인</b>
          </SiginButton>
          {/* <SiginButton onClick={() => signIn('google')}><Google style={{ width: 30, height:30, color:"white" }} /><b>구글로그인</b></SiginButton> */}
          <SignUpContainer>
            <TextArea>계정이 없으신가요?</TextArea>
            <SignUpButton onClick={signUpModalHandle}>가입하기</SignUpButton>
            {open ? (
              <ModalBackdrop>
                <SignUp signUpModalHandle={signUpModalHandle} />
              </ModalBackdrop>
            ) : null}
          </SignUpContainer>
        </SecondMiddleContainer>
      </Container>
    </BigContainer>
  );
}

const BigContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const LogoBar = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(52, 51, 67, 1);
`;

const LogoText = styled.span`
  position: absolute;
  width: 47px;
  height: 21px;
  left: 125px;
  top: 13px;

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 21px;

  color: #ffffff;
`;

const Container = styled.div`
  width: 320px;
  height: 342px;
  min-width: 320px;
  min-height: 342px;
  border: none;
  background-color: rgba(233, 232, 240, 1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const TitleText = styled.span`
  width: 100%;
  color: rgba(52, 51, 67, 1);

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 800;
  font-size: 24px;
  line-height: 29px;
`;

const MiddleContainer = styled.div`
  width: 100%;
  height: 146px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const SecondMiddleContainer = styled.div`
  width: 100%;
  height: 89px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const InnerContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const TextArea = styled.span`
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  color: rgba(144, 143, 159, 1);
`;

const TextInput = styled.input`
  width: 305px;
  height: 48px;
  font-size: 1.4rem;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(223, 222, 236, 1);
  border-radius: 8px;

  padding-left: 12px;

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: rgba(52, 51, 67, 1);
`;

const SiginButton = styled.button`
  width: 320px;
  height: 64px;

  background: rgba(255, 81, 0, 1);
  border: 1px solid rgba(223, 222, 236, 1);
  border-radius: 8px;

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 800;
  font-size: 24px;
  line-height: 29px;
  color: rgba(255, 255, 255, 1);

  cursor: pointer;
`;

const SignUpContainer = styled.div`
  width: 172px;
  height: 17px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const SignUpButton = styled.button`
  border: none;
  background: rgba(233, 232, 240, 1);
  color: rgba(255, 81, 0, 1);
  width: 64px;
  height: 17px;

  text-decoration: underline;
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;

  cursor: pointer;
`;

const ModalBackdrop = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  right: 0;
  top: 0;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
`;
