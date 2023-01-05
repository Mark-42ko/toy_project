import styled from 'styled-components';
import { useState } from 'react';

type Props = {
    friendData: {
        email: string;
        name: string;
        phoneNumber: string;
    };
    setSelectFriend: Function;
    selectFriend: any;
};

export default function AddBlahCard (props: Props) {
    const [ select, setSelect ] = useState<boolean>(false);

    const clickHandle = () => {
        setSelect(!select);
        if(select === true) {
            props.setSelectFriend([...props.selectFriend, props.friendData]);
        } else {
            // for(var i = 0; i < props.selectFriend.length; i++){ 
            //     if (props.selectFriend[i] === props.friendData) { 
            //       props.selectFriend.splice(i, 1); 
            //       i--; 
            //     }
            // }
            const data = [...props.selectFriend].filter((one) => one !== props.friendData);
            props.setSelectFriend(data);
        }
    };

    return(
        <Container choose={select} onClick={clickHandle}>
            <ProfileContainer>
                <ProfileImg />
                <NameTag><b>{props.friendData.name}</b></NameTag>
            </ProfileContainer>
        </Container>
    );
}

type ButtonProps = {
    choose: boolean
};

const Container = styled.button`
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    border: 1px solid;
    border-radius: 1rem;
    border-color: #D8D8D8;
    background: ${(props: ButtonProps) => props.choose === true ? "#F2F2F2" : "#FFFFFF"};
`;

const ProfileContainer = styled.div`
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: 1.5rem;
    width: 100%;
`;

const ProfileImg = styled.div`
    background-image: url('/images/defaultGuest.jpg');
    background-size: cover;
    width: 65px;
    height: 65px;
    border: none;
    border-radius: 20px;
`;

const NameTag = styled.div`
    font-size: 1.4rem;
`;
