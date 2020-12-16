import React, { ReactText, useState } from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import './App.scss';
import {
  Page,
  PageSection,
  PageSectionVariants,
  Tabs,
  Tab,
  TabTitleText,
} from '@patternfly/react-core';
import { initialWorkers } from './InitialData';
import WorkersDiagram from './WorkersDiagram';

const App: React.FC = () => {
  const [activeTabKey, setActiveTabKey] = useState<ReactText>(0);

  const handleTabClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    eventKey: number | string
  ) => {
    setActiveTabKey(eventKey);
  };

  return (
    <div className="App">
      <Page>
        <PageSection isFilled variant={PageSectionVariants.light}>
          <Tabs activeKey={activeTabKey} onSelect={handleTabClick} mountOnEnter>
            <Tab
              eventKey={0}
              title={<TabTitleText>Workers diagram</TabTitleText>}
            >
              <WorkersDiagram initialWorkers={initialWorkers} />
            </Tab>
            <Tab eventKey={1} title={<TabTitleText>Containers</TabTitleText>}>
              Containers
            </Tab>
          </Tabs>
        </PageSection>
      </Page>
    </div>
  );
};

export default App;
