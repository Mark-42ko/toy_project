import styled from "styled-components";
import TabButton from "./tabButton";

type TabList = [{ title: string }, { title: string }];

const tabList: TabList = [{ title: "진행중" }, { title: "종료됨" }];

type Props = {
  tabHandle: string;
  setTabHandle: Function;
};

export default function TabBar(props: Props) {
  return (
    <TabContainer>
      {tabList.map((one) => (
        <TabButton
          title={one.title}
          key={one.title}
          tabHandle={props.tabHandle}
          setTabHandle={props.setTabHandle}
        />
      ))}
    </TabContainer>
  );
}

const TabContainer = styled.div`
  background-color: rgba(244, 243, 251, 1);
  border: 1px solid rgba(223, 222, 236, 1);
  border-radius: 10px;
  width: 148px;
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;
