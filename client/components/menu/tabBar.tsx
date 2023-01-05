import styled from 'styled-components';
import TabButton from './tabButton';

type TabList = [
    { title: string; },
    { title: string; },
    { title: string; }
];

const tabList:TabList = [ { title: "진행중" }, { title: "보류됨" }, { title: "종료됨" }];

type Props = {
    tabHandle: string;
    setTabHandle: Function;
}

export default function TabBar(props: Props) {
    return (
        <TabContainer>
            { tabList.map((one) => <TabButton title={one.title} key={one.title} tabHandle={props.tabHandle} setTabHandle={props.setTabHandle}/>) }
        </TabContainer>
    );
}

const TabContainer = styled.div`
    background-color: #F2F2F2;
    width: 100%;
    height: 45px;
    border: none;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    alignItems: center;
    justify-content: space-around;
    padding: 0.2em
`;