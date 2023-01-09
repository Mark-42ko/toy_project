import styled from "styled-components";
import { useState } from "react";
import { hash } from "bcryptjs";

type Props = {
  signUpModalHandle: () => void;
};

export default function SignUp(props: Props) {
  const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rePassword, setRePassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>();

  const [emailErr, setEmailErr] = useState<string>();
  const [passwordErr, setPasswordErr] = useState<string>();
  const [rePasswordErr, setRePasswordErr] = useState<string>();
  const [nameErr, setNameErr] = useState<string>();

  const nameRegex = /^[가-힣a-zA-Z]+$/;
  const emailRegex =
    /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;

  const handleInput = (evt: any) => {
    const value = evt.currentTarget.value
      .replace(/[^0-9]/g, "")
      .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3")
      .replace(/(\-{1,2})$/g, "");
    setPhoneNumber(value);
  };

  const signUpHandle = async () => {
    if (!emailRegex.test(email)) {
      setEmailErr("올바른 이메일 형식이 아닙니다.");
    } else {
      setEmailErr("");
    }
    if (!passwordRegex.test(password)) {
      setPasswordErr("숫자+영문자+특수문자 조합으로 8자리 이상 입력해주세요.");
    } else {
      setPasswordErr("");
    }
    if (password !== rePassword) {
      setRePasswordErr("비밀번호가 일치하지 않습니다.");
    } else {
      setRePasswordErr("");
    }
    if (!nameRegex.test(name) || name?.length < 1) {
      setNameErr("올바른 이름을 입력해주세요.");
    } else {
      setNameErr("");
    }

    if (emailErr === "" && passwordErr === "" && rePasswordErr === "" && nameErr === "") {
      const response = await fetch(`${SERVER_URI}/account/emailCheck?email=${email}`, {
        method: "GET",
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:3000",
        },
      });
      const json = await response.json();

      if (json.data) {
        setEmailErr("중복된 아이디입니다.");
      } else {
        const hashPassword = await hash(password, 12);
        try {
          await fetch(`${SERVER_URI}/account/signUp`, {
            method: "POST",
            body: JSON.stringify({
              email: email,
              password: hashPassword,
              name: name,
              phoneNumber: phoneNumber,
            }),
            headers: {
              "Content-type": "application/json",
              "Access-Control-Allow-Origin": "http://localhost:3000",
            },
          });
        } catch (err) {
          console.log(err);
        }
        props.signUpModalHandle();
        alert("회원가입이 완료되었습니다.");
      }
    }
  };

  return (
    <Container>
      <TitleText>회원가입</TitleText>
      <CloseButton onClick={props.signUpModalHandle}>X</CloseButton>
      <InnerContainer>
        <TextArea>아이디 : </TextArea>
        <TextInput
          placeholder="example@google.com"
          type={"email"}
          onChange={(evt) => setEmail(evt.currentTarget.value)}
        />
      </InnerContainer>
      <ErrMsgArea>{emailErr}</ErrMsgArea>
      <InnerContainer style={{ marginTop: 10 }}>
        <TextArea>비밀번호 : </TextArea>
        <TextInput
          placeholder="특수문자 포함 8자 이상"
          type={"password"}
          onChange={(evt) => setPassword(evt.currentTarget.value)}
        />
      </InnerContainer>
      <ErrMsgArea>{passwordErr}</ErrMsgArea>
      <InnerContainer style={{ marginTop: 10 }}>
        <TextArea>비밀번호 확인 : </TextArea>
        <TextInput type={"password"} onChange={(evt) => setRePassword(evt.currentTarget.value)} />
      </InnerContainer>
      <ErrMsgArea>{rePasswordErr}</ErrMsgArea>
      <InnerContainer style={{ marginTop: 10 }}>
        <TextArea>이름 : </TextArea>
        <TextInput type={"text"} onChange={(evt) => setName(evt.currentTarget.value)} />
      </InnerContainer>
      <ErrMsgArea>{nameErr}</ErrMsgArea>
      <InnerContainer style={{ marginTop: 10 }}>
        <TextArea>연락처 : </TextArea>
        <NumberInput type={"text"} value={phoneNumber} onChange={handleInput} maxLength={13} />
      </InnerContainer>
      <SiginButton onClick={signUpHandle}>
        <b>회원가입</b>
      </SiginButton>
    </Container>
  );
}

const Container = styled.div`
  width: 30%;
  hight: 50%;
  min-width: 300px;
  min-height: 300px;
  border: none;
  border-radius: 20px;
  padding: 2em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  position: sticky;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50px;
  background: #5858fa;
`;

const TitleText = styled.h1`
  font-size: 2rem;
`;

const InnerContainer = styled.div`
  width: 300px;
  display: flex;
  justify-content: space-between;
`;

const TextArea = styled.span``;

const ErrMsgArea = styled.span`
  color: red;
  font-size: 0.7rem;
`;

const TextInput = styled.input`
  width: 170px;
`;

const SiginButton = styled.button`
  width: 230px;
  border: none;
  font-size: 1.2rem;
  background: #5858fa;
  margin-top: 15px;
  border: none;
  border-radius: 10px;
`;

const NumberInput = styled.input`
  width: 170px;
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;
