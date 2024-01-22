import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './components/Home';
import Game from './components/Game';
import Join from './components/Join';
import { SocketProvider } from './components/SocketContext';
function App() {
  
  return (
    <BrowserRouter>
      <SocketProvider>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/join/:id' element={<Join />} />
          <Route path='/game/:id' element={<Game />} />
        </Routes>
      </SocketProvider>
    </BrowserRouter>
  )
}

export default App
