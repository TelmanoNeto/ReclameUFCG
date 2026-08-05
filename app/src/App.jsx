import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { AppProvider } from './AppContext.jsx';
import Layout from './components/Layout.jsx';
import Feed from './pages/Feed.jsx';
import Trending from './pages/Trending.jsx';
import PostDetail from './pages/PostDetail.jsx';
import CreatePost from './pages/CreatePost.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Profile from './pages/Profile.jsx';
import Regras from './pages/Regras.jsx';
import VerificarEmail from './pages/VerificarEmail.jsx';
import Moderacao from './pages/Moderacao.jsx';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Feed />} />
            <Route path="/em-alta" element={<Trending />} />
            <Route path="/relato/:id" element={<PostDetail />} />
            <Route path="/novo" element={<CreatePost />} />
            <Route path="/entrar" element={<Login />} />
            <Route path="/cadastro" element={<Signup />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/regras" element={<Regras />} />
            <Route path="/verificar" element={<VerificarEmail />} />
            <Route path="/moderacao" element={<Moderacao />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
