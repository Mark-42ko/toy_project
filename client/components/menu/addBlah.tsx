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
    const [ friendData, setFriendeData ] = useState<any>();
    const [ selectFriend, setSelectFriend ] = useState<any>([]);
    const [ accessCheck, setAccessCheck ] = useState<boolean>(false);

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
            setFriendeData(json);
        }();
    },[]);

    const addHandle = async () => {
        const result = await fetch(`${SERVER_URI}/blah/findOne`, {
            method: "POST",
            body: JSON.stringify({
                user: [...selectFriend, { email: ctx?.userData?.userId, name: ctx?.userData?.username, phoneNumber: ctx?.userData?.userPhoneNumber}],
                blah: []
            }),
            headers: {
                "Authorization": `bearer ${ctx?.accessToken}`,
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "http://localhost:3000"
            }
        });
        const jsons = await result.json();
        console.log(jsons.data);
        const data = jsons.data.duplicationData.find((one: string | null) => one === null);
        console.log(data);
        console.log(jsons.data.duplicationData.length);
        if( data === null) {
            console.log('생성완료');
        } else {
            if( selectFriend.length +1 === jsons.data.counts ){
                console.log('새로만드실?');
            } else {
                if ( jsons.data.duplicationData.length === 1) {
                    console.log('혼자서는 생성할 수 없습니다.');
                } else{
                    console.log('생성완료');
                }
            }
        }
        // if(jsons) {

        // }
        // const reponse = await fetch(`${SERVER_URI}/blah/create`, {
        //     method: "POST",
        //     body: JSON.stringify({
        //         user: [...selectFriend, { email: ctx?.userData?.userId, name: ctx?.userData?.username, phoneNumber: ctx?.userData?.userPhoneNumber}],
        //         blah: []
        //     }),
        //     headers: {
        //         "Authorization": `bearer ${ctx?.accessToken}`,
        //         "Content-type": "application/json",
        //         "Access-Control-Allow-Origin": "http://localhost:3000"
        //     }
        // });
        // const json = await reponse.json();
        // props.setOpen(!open);
    };

    return (
        <Container>
            <CloseButton onClick={() => props.setOpen(!props.open)}>x</CloseButton>
            <Title>대화상대를 선택해주세요.</Title>
            { friendData && friendData[0].friend.map((one: any) => <AddBlahCard key={one.email} friendData={one} setSelectFriend={setSelectFriend} selectFriend={selectFriend} />)}
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
