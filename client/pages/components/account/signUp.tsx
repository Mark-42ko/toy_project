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
          await fetch(`${SERVER_URI}/people/addAI`, {
            method: "POST",
            body: JSON.stringify({
              user: name,
              friend: {
                email: jsons.data.email,
                name: jsons.data.name,
                phoneNumber: jsons.data.phoneNumber,
                filename: jsons.data.filename,
                date: new Date(),
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
        <TitleText>회원가입</TitleText>
        <CloseButton onClick={props.signUpModalHandle}>
          <Back />
        </CloseButton>
      </TitleContainer>
      <MiddleContainer>
        <div>
          <TextArea>이미지</TextArea>
          <ImageContainer>
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
                  이미지를 등록해주세요.
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
            <TextArea>*png, jpg ...</TextArea>
          </ImageContainer>
        </div>
        <InnerContainer>
          <InputContainer>
            <TextArea>이름</TextArea>
            <ErrMsgArea>{nameErr}</ErrMsgArea>
          </InputContainer>
          <TextInput type={"text"} onChange={(evt) => setName(evt.currentTarget.value)} />
        </InnerContainer>
        <InnerContainer>
          <TextArea>연락처</TextArea>
          <NumberInput type={"text"} value={phoneNumber} onChange={handleInput} maxLength={13} />
        </InnerContainer>
        <InnerContainer>
          <InputContainer>
            <TextArea>이메일</TextArea>
            <ErrMsgArea>{emailErr}</ErrMsgArea>
          </InputContainer>
          <TextInput
            placeholder="example@google.com"
            type={"email"}
            onChange={(evt) => setEmail(evt.currentTarget.value)}
          />
        </InnerContainer>
        <InnerContainer>
          <InputContainer>
            <TextArea>비밀번호</TextArea>
            <ErrMsgArea>{passwordErr}</ErrMsgArea>
          </InputContainer>
          <TextInput
            placeholder="특수문자 포함 8자 이상"
            type={"password"}
            onChange={(evt) => setPassword(evt.currentTarget.value)}
          />
        </InnerContainer>
        <InnerContainer>
          <InputContainer>
            <TextArea>비밀번호 확인</TextArea>
            <ErrMsgArea>{rePasswordErr}</ErrMsgArea>
          </InputContainer>
          <TextInput type={"password"} onChange={(evt) => setRePassword(evt.currentTarget.value)} />
        </InnerContainer>
      </MiddleContainer>
      <SiginButton onClick={signUpHandle}>회원가입</SiginButton>
    </Container>
  );
}

const Container = styled.div`
  width: 325px;
  height: 700px;
  border: none;
  border-radius: 8px;
  padding: 1em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: rgba(255, 255, 255, 1);
`;

const TitleContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

const ImageContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const CloseButton = styled.button`
  border: none;
  background: rgba(255, 255, 255, 1);
  cursor: pointer;
  svg {
    width: 30px;
    height: 30px;
  }
`;

const TitleText = styled.h1`
  width: 83px;
  height: 29px;
  color: rgba(52, 51, 67, 1);

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 800;
  font-size: 24px;
  line-height: 29px;
`;

const MiddleContainer = styled.div`
  height: 520px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const InnerContainer = styled.div`
  height: 69px;
  display: flex;
  flex-direction: column;
`;

const TextArea = styled.span`
  color: rgba(144, 143, 159, 1);

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
`;

const ErrMsgArea = styled.span`
  color: rgba(255, 0, 0, 1);
  margin-left: 8px;
  font-size: 0.7rem;
`;

const TextInput = styled.input`
  width: 305px;
  height: 48px;

  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(223, 222, 236, 1);
  border-radius: 8px;
  color: rgba(52, 51, 67, 1);
  padding-left: 12px;

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
`;

const SiginButton = styled.button`
  width: 320px;
  height: 64px;

  background: rgba(255, 81, 0, 1);
  border: 1px solid rgba(223, 222, 236, 1);
  border-radius: 8px;

  color: rgba(255, 255, 255, 1);
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 800;
  font-size: 24px;
  line-height: 29px;

  cursor: pointer;
`;

const NumberInput = styled.input`
  width: 305px;
  height: 48px;

  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(223, 222, 236, 1);
  border-radius: 8px;
  color: rgba(52, 51, 67, 1);
  padding-left: 12px;

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;

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
  width: 96px;
  height: 96px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(223, 222, 236, 1);
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 9px;

  color: rgba(223, 222, 236, 1);
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  text-align: center;

  cursor: pointer;
`;

const FileInput = styled.input``;
