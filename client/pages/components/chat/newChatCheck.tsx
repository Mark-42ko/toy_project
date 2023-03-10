import styled from "styled-components";

type Props = {
  setNewBlahCheck: Function;
  newBlahCheck: boolean;
  selectFriend: any;
  setOpen: Function;
  open: boolean;
};

export default function NewChatCheck(props: Props) {
  const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;
  const accessToken = JSON.parse(sessionStorage.getItem("userToken") as string);

  const yesButtonHandle = async () => {
    await fetch(`${SERVER_URI}/blah/create`, {
      method: "POST",
      body: JSON.stringify({
        user: props.selectFriend,
        blah: [],
        status: "진행중",
      }),
      headers: {
        Authorization: `bearer ${accessToken}`,
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000",
      },
    });
    alert("생성완료");
    props.setOpen(!props.open);
  };
  return (
    <Container>
      <div>
        <Title>대화방이 이미 존재합니다.</Title>
        <Title>새로만드시겠습니까?</Title>
      </div>
      <InnerContainer>
        <YesButton onClick={yesButtonHandle}>만들기</YesButton>
        <NoButton onClick={() => props.setNewBlahCheck(!props.newBlahCheck)}>취소</NoButton>
      </InnerContainer>
    </Container>
  );
}

const Container = styled.div`
  width: 80%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const InnerContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  align-items: center;
`;

const Title = styled.span`
  width: 100%;
  color: #0000ff;
  font-size: 1.4rem;
  display: flex;
  justify-content: center;
`;

const YesButton = styled.span`
  width: 40%;
  height: 2.5rem;
  background: #0000ff;
  color: #ffffff;
  border: none;
  border-radius: 1rem;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NoButton = styled.span`
  width: 40%;
  height: 2.5rem;
  background: #a4a4a4;
  color: #ffffff;
  border: none;
  border-radius: 1rem;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;
