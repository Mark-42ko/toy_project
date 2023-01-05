import styled from 'styled-components';
import { useState, useEffect } from 'react';

type Props = {
    data: { text: string; icon: JSX.Element };
    navController: string;
    setNavController: Function;
};

export default function Button(props:Props) {
    const [ choose, setChoose ] = useState<boolean>(false);   // 버튼 누름 상태 확인용 hook

    useEffect(()=>{
        props.data.text === "people" && setChoose(true);    // default 선택값인 people 버튼 누름 상태
        props.navController !== props.data.text && setChoose(false);    // 버튼 누름 상태 1개만 활성화
    },[props.navController]);

    const chooseHandler = () => {
        props.setNavController(props.data.text);    // nav 값 전달
        setChoose(true);
    };
    
    return (
        <Buttons choose={choose} onClick={chooseHandler}>{props.data.icon}</Buttons>
    );
}

type ButtonProps = {
    choose:boolean;
};

const Buttons = styled.button`
    border: none;
    width: 50px;
    height: 50px;
    background: ${(props:ButtonProps) => props.choose === true ? "#FFFFFF" : "#F2F2F2"};
`;