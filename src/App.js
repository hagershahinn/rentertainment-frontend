import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Films from './pages/Films';
import FilmDetails from './pages/FilmDetails';
import ActorDetails from './pages/ActorDetails';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/films" element={<Films />} />
          <Route path="/films/:id" element={<FilmDetails />} />
          <Route path="/actors/:id" element={<ActorDetails />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
