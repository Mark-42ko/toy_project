import Image from "next/image";
import styled, { keyframes } from "styled-components";

export default function Spinner() {
  return (
    <Container>
      <Image
        src={"/images/aibot.jpeg"}
        alt="프로필이미지"
        width={65}
        height={65}
        style={{ borderRadius: "50%" }}
      />
      <InnerContainer>
        <NameTag>챗봇</NameTag>
        <TextBox>
          <Spinners />
        </TextBox>
      </InnerContainer>
    </Container>
  );
}

const rotation = keyframes`
    from{
      transform: rotate(0deg);
    }

    to{
      transform: rotate(360deg);
    }
    
    `;

const Spinners = styled.div`
  height: 30px;
  width: 30px;
  border: 1px solid #f8049c;
  border-radius: 50%;
  border-top: none;
  border-right: none;

  animation: ${rotation} 1s linear infinite;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 15px;
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
  border-radius: 0px 10px 10px 10px;
  background-color: rgba(52, 51, 67, 1);
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
