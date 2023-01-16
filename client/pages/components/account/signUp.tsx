import styled from "styled-components";
import { useState, useRef } from "react";
import { hash } from "bcryptjs";
import { Back } from "@styled-icons/entypo/Back";
import Image from "next/image";

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
  const [files, setFiles] = useState<File[]>([]);
  const [emailErr, setEmailErr] = useState<string>();
  const [passwordErr, setPasswordErr] = useState<string>();
  const [rePasswordErr, setRePasswordErr] = useState<string>();
  const [nameErr, setNameErr] = useState<string>();
  const [imgFile, setImgFile] = useState<any>();
  const ref = useRef<HTMLInputElement>(null);

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
          const formData = new FormData();
          files.forEach((one) => {
            formData.append("file", one);
          });
          const response = await fetch(`${SERVER_URI}/account/upload`, {
            method: "POST",
            body: formData,
            headers: {
              "Access-Control-Allow-Origin": "http://localhost:3000",
            },
          });
          const json = await response.json();
          await fetch(`${SERVER_URI}/account/signUp`, {
            method: "POST",
            body: JSON.stringify({
              email: email,
              password: hashPassword,
              name: name,
              phoneNumber: phoneNumber,
              filename: json.filename ? json.filename : undefined,
            }),
            headers: {
              "Content-type": "application/json",
              "Access-Control-Allow-Origin": "http://localhost:3000",
            },
          });
          const result = await fetch(`${SERVER_URI}/account/emailCheck?email=aibot@aibot.com`, {
            method: "GET",
            headers: {
              "Access-Control-Allow-Origin": "http://localhost:3000",
            },
          });
          const jsons = await result.json();
          console.log(jsons.data);
          await fetch(`${SERVER_URI}/people/addAI`, {
            method: "POST",
            body: JSON.stringify({
              user: name,
              friend: {
                email: jsons.data.email,
                name: jsons.data.name,
                phoneNumber: jsons.data.phoneNumber,
                filename: jsons.data.filename,
              },
            }),
            headers: {
              "Content-type": "application/json",
              "Access-Control-Allow-Origin": "http://localhost:3000",
            },
          });
          const user = [
            {
              email: email,
              name: name,
              phoneNumber: phoneNumber,
              filename: json.filename ? json.filename : undefined,
            },
            {
              email: jsons.data.email,
              name: jsons.data.name,
              phoneNumber: jsons.data.phoneNumber,
              filename: jsons.data.filename,
            },
          ];
          await fetch(`${SERVER_URI}/blah/createAI`, {
            method: "POST",
            body: JSON.stringify({
              user: user,
              blah: [],
              status: "대화중",
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

  const fileAddButtonHandle: React.ChangeEventHandler<HTMLInputElement> = (evt) => {
    if (evt.target.files) {
      const file = evt.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImgFile(reader.result);
      };
      const t = Array.from(evt.target.files!);
      setFiles([...files, ...t]);
    }
  };

  return (
    <Container>
      <TitleContainer>
        <CloseButton onClick={props.signUpModalHandle}>
          <Back />
        </CloseButton>
        <TitleText>회원가입</TitleText>
        <div style={{ width: "40px" }} />
      </TitleContainer>
      <BodyContainer>
        <MidleContainer>
          <TextArea>
            <b>프로필 이미지</b>
          </TextArea>
          {imgFile ? (
            <>
              <Image
                src={imgFile}
                alt={"프로필 이미지"}
                style={{ cursor: "pointer", borderRadius: "8px" }}
                width={150}
                height={150}
                onClick={() => ref.current?.click()}
              />
              <FileInput
                type="file"
                ref={ref}
                style={{ display: "none" }}
                onChange={(e) => {
                  fileAddButtonHandle(e);
                  e.target.value = "";
                }}
              />
            </>
          ) : (
            <>
              <FileAddButton onClick={() => ref.current?.click()}>
                <b>업로드</b>
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
            </>
          )}
        </MidleContainer>
        <MidleContainer>
          <InnerContainer>
            <TextArea>아이디 : </TextArea>
            <TextInput
              placeholder="example@google.com"
              type={"email"}
              onChange={(evt) => setEmail(evt.currentTarget.value)}
            />
          </InnerContainer>
          <ErrMsgArea>{emailErr}</ErrMsgArea>
          <InnerContainer>
            <TextArea>비밀번호 : </TextArea>
            <TextInput
              placeholder="특수문자 포함 8자 이상"
              type={"password"}
              onChange={(evt) => setPassword(evt.currentTarget.value)}
            />
          </InnerContainer>
          <ErrMsgArea>{passwordErr}</ErrMsgArea>
          <InnerContainer>
            <TextArea>비밀번호 확인 : </TextArea>
            <TextInput
              type={"password"}
              onChange={(evt) => setRePassword(evt.currentTarget.value)}
            />
          </InnerContainer>
          <ErrMsgArea>{rePasswordErr}</ErrMsgArea>
          <InnerContainer>
            <TextArea>이름 : </TextArea>
            <TextInput type={"text"} onChange={(evt) => setName(evt.currentTarget.value)} />
          </InnerContainer>
          <ErrMsgArea>{nameErr}</ErrMsgArea>
          <InnerContainer>
            <TextArea>연락처 : </TextArea>
            <NumberInput type={"text"} value={phoneNumber} onChange={handleInput} maxLength={13} />
          </InnerContainer>
        </MidleContainer>
      </BodyContainer>
      <SiginButton onClick={signUpHandle}>
        <b>회원가입</b>
      </SiginButton>
    </Container>
  );
}

const Container = styled.div`
  border: none;
  border-radius: 8px;
  padding: 1em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  gap: 1rem;
`;

const TitleContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

const BodyContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction: row;
  gap: 1.4rem;
`;

const MidleContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction: column;
  gap: 0.6rem;
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

const TextInput = styled.input``;

const SiginButton = styled.button`
  width: 230px;
  border: none;
  font-size: 1.2rem;
  background: #5858fa;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  margin-top: 20px;
  cursor: pointer;
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

const FileAddButton = styled.div`
  width: 150px;
  height: 150px;
  border: none;
  border-radius: 8px;
  background-image: url("/images/defaultGuest.jpg");
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  cursor: pointer;
`;

const FileInput = styled.input``;

