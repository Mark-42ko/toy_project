import { GlobalContext } from 'pages/_app';
import { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import AddBlahCard from './addBlahCard';

type Props = {
    open: boolean;
    setOpen: Function;
};

export default function AddBlah (props: Props) {
    const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;
    const ctx = useContext(GlobalContext);
    const [ peopleData, setPeopleData ] = useState<any>();

    useEffect(()=>{
        !async function () {
            const reponse = await fetch(`${SERVER_URI}/people?email=${ctx?.userData?.userId}`, {
                method: "GET",
                headers: {
                    "Authorization": `bearer ${ctx?.accessToken}`,
                    "Content-type": "application/json",
                    "Access-Control-Allow-Origin": "http://localhost:3000"
                }
            });
            const json = await reponse.json();
            setPeopleData(json);
        }();
    },[]);

    const addHandle = async () => {

    };

    return (
        <Container>
            <CloseButton onClick={() => props.setOpen(!props.open)}>x</CloseButton>
            <Title>대화상대를 선택해주세요.</Title>
            {/* { peopleData && peopleData.map((one) => <AddBlahCard key={one._id}/>)} */}
            <AddButton onClick={addHandle}><b>대화하기</b></AddButton>
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

const AddButton = styled.button`
    border: none;
    background: #8181F7;
    width: 50%;
    height: 40px;
    border-radius: 1rem;
    font-size: 1.3rem;
    color: #FFFFFF
`;
