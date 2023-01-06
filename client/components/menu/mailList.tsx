import styled from 'styled-components';
import { useState, useEffect } from 'react';

type Props = {
    tabHandle: string;
    roomData: any;
    choose: boolean;
    setChoose: Function;
};

export default function MailList (props: Props) {
    const nameTag = props.roomData[0].user.length === 2 ? props.roomData[0].user[1].name : props.roomData[0].user[1].name + ' 외' + (props.roomData[0].user.length-1) + ' 명';
    const clickHandle = () => {
        props.setChoose(true);
    };

    return (
        <ButtonContainer choose={props.choose} onClick={clickHandle}>
            <ImgDiv />
            <SmallContainer>
                <div>
                    <NameTag><b>{nameTag}</b></NameTag>
                </div>
                <LastOrder>안녕하세요</LastOrder>
            </SmallContainer>
        </ButtonContainer>
    );
}

type ButtonProps = {
    choose:boolean;
};

const ButtonContainer = styled.button`
    width: 100%;
    height: 70px;
    display: flex;
    flex-direction: row;
    margin-top: 15px;
    border: none;
    border-radius: 30px;
    background: #FFFFFF;
    align-items: center;
    background: ${(props:ButtonProps) => props.choose === true ? "#F2F2F2" : "#FFFFFF"};
`;

const ImgDiv = styled.div`
    background-image: url('/images/defaultGuest.jpg');
    background-size: cover;
    width: 65px;
    height: 60px;
    border: none;
    border-radius: 20px
`;

const SmallContainer = styled.div`
    width: 80%;
    height: 50px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: start;
    padding-left: 15px;
`

const NameTag = styled.a`
    font-size: 1rem;
`;

const LastOrder = styled.a`
    font-size: 0.7rem;
`;
