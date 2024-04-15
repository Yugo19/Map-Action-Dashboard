// Routes.js

import React from 'react';
import {Row, Container} from "react-bootstrap"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/views/dashboard';
import Incident from './components/views/Incident';
import Historique from './components/views/Historique';
import DataExport from './components/views/DataExport';
import Parametres from './components/views/Parametres';
import FAQ from './components/views/FAQ';
import HelpOnline from './components/views/help';
import GlobalView from './components/views/globalView';
import Analyze from './components/views/analyze';
import Colaboration from './components/views/colaboration';
import Colaborate from './components/views/askCollaboration';
import Login from './components/login';
import NotificationsComponent from './components/Notification/Notification';

const Root = () => {
  const renderNotFound = (
    <div className="content" style={{ backgroundColor: "#fff" }}>
      <Container>
        <Row>
          <h2>Page introuvable</h2>
        </Row>
      </Container>
    </div>
  );
  return (
      <Routes>
        <Route exact path="/" element={<Dashboard/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/incident" element={<Incident/>} />
        <Route path="/historique" element={<Historique/>} />
        <Route path="/export" element={<DataExport/>} />
        <Route path="/parametres" element={<Parametres/>} />
        <Route path="/faq" element={<FAQ/>} />
        <Route path="/help" element={<HelpOnline/>} />
        <Route path="/incident_view/:incidentId" element={<GlobalView/>} />
        <Route path="/analyze/:incidentId" element={<Analyze/>} />
        <Route path="/colaboration" element={<Colaboration/>} />
        <Route path='/askCollaboration/:incidentId' element={<Colaborate/>}/>
        <Route path="/notifications" component={NotificationsComponent} />
        <Route path="*" element={<renderNotFound />} />
        {/* <Route path="/" element={<Login/>}/> */}
      </Routes>
  );
};

export default Root;
