import { GlobalContext } from 'pages/_app';
import { useState, useContext } from 'react';
import styled from 'styled-components';

type Props = {
    open: boolean;
    setOpen: Function;
};

export default function AddPeople (props: Props) {
    const [ email, setEmail ] = useState<string>("");
    const [ emailErrMsg, setEmailErrMsg ] = useState<string>();
    const emailRegex = /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;
    const ctx = useContext(GlobalContext);

    const addHandle = async () => {
        if(!emailRegex.test(email)) {
            setEmailErrMsg("이메일 형식이 아닙니다.");
        } else {
            const response = await fetch(`${SERVER_URI}/account/emailCheck?email=${email}`, {
                method: "GET",
                headers: {
                    "Access-Control-Allow-Origin": "http://localhost:3000"
                }
            });
            const json = await response.json();
            if(!json.data) {
                setEmailErrMsg("없는 계정입니다.");
            } else {
                if(json.data.email === ctx?.userData?.userId) {
                    setEmailErrMsg("자기 자신은 추가할 수 없습니다.");
                } else {
                    const result = await fetch(`${SERVER_URI}/people/add`, {
                        method: "POST",
                        body: JSON.stringify({
                            user: ctx?.userData?.username,
                            peopleEmail: email,
                            name: json.data.name
                        }),
                        headers: {
                            "Authorization": `bearer ${ctx?.accessToken}`,
                            "Content-type": "application/json",
                            "Access-Control-Allow-Origin": "http://localhost:3000"
                        }
                    });
                    const rstJson = await result.json();
                    if(rstJson.statusCode === 401) {
                        setEmailErrMsg("이미 추가된 이메일입니다.")
                    } else {
                        props.setOpen(!props.open);
                        alert("추가완료.")
                    }
                }
            }
        }
    };

    return (
        <Container>
            <CloseButton onClick={() => props.setOpen(!props.open)}>x</CloseButton>
            <Title>이메일을 입력해주세요.</Title>
            <EmailInput type={"email"} onChange={(evt) => setEmail(evt.currentTarget.value)}/>
            { emailErrMsg && <ErrMsg>{emailErrMsg}</ErrMsg> }
            <AddButton onClick={addHandle}><b>추가하기</b></AddButton>
        </Container>
    );
}

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: #FFFFFF;
    border: none;
    border-radius: 1rem;
    gap: 1.5rem;
    width: 30%;
    min-width: 400px;
    padding: 1rem;
    position: sticky;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 0;
    right: 0;
    border-radius: 50px;
    width: 2rem;
    height: 2rem;
`;

const Title = styled.span`
    font-size: 1.4rem;
`;

const EmailInput = styled.input`
    width: 80%;
`;

const AddButton = styled.button`
    border: none;
    background: #8181F7;
    width: 50%;
    height: 40px;
    border-radius: 1rem;
    font-size: 1.3rem;
    color: #FFFFFF
`;

const ErrMsg = styled.span`
    font-size: 1rem;
    color: #FF0000;
`;