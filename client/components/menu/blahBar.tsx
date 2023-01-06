import styled from 'styled-components';
import { Search } from '@styled-icons/evaicons-solid/Search';
import { ThreeDotsVertical } from '@styled-icons/bootstrap/ThreeDotsVertical';

type Props = {
    roomData: any;
};

export default function BlahBar (props: Props) {
    const searchHandle = () => {

    };

    const menuHandle = () => {

    };

    return(
        <Container>
            <NameTag><b>{props.roomData[0].user[0].name}</b></NameTag>
            <div>
                <Button onClick={searchHandle}><Search style={{color:"#A4A4A4"}}/></Button>
                <Button onClick={menuHandle}><ThreeDotsVertical style={{color:"#A4A4A4"}}/></Button>
            </div>
        </Container>
    );
}

const Container = styled.div`
    width: 100%;
    height: 7vh;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

const NameTag = styled.h1`
    font-size: 1.5rem;
    padding-left: 20px;
`;

const Button = styled.button`
    width: 50px;
    height: 50px;
    border: none;
    background: #FFFFFF;
`;