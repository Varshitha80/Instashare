import {BrowserRouter,Route, Routes} from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import ProtectedRoute from './components/ProtectedRoute'
import Userprofile from './components/Userprofile'
import Myprofile from './components/Myprofile'
import Notfound from './components/Notfound'
import Createuserprofile from './components/Createuserprofile'
import Updateprofile from './components/Updateprofile'
import Updatestory from './components/Updatestory'
import Updatepost from './components/Updatepost'
import './App.css'


const App = () => (
  <BrowserRouter>
  <Routes>
    <Route path="/register" element={<Signup />} />
    <Route path="/login" element={<Login />} />
    <Route path="/create-user-profile" element={<ProtectedRoute element={Createuserprofile} />} />
    <Route path="/" element={<ProtectedRoute element={Home} />} />
    <Route path="/users/:id" element={<ProtectedRoute element={Userprofile} />} />
    <Route path="/my-profile" element={<ProtectedRoute element={Myprofile} />} />
    <Route path="/update-profile" element={<ProtectedRoute element={Updateprofile} />} />
    <Route path="/update-story" element={<ProtectedRoute element={Updatestory} />} />
    <Route path="/update-post" element={<ProtectedRoute element={Updatepost} />} />
    <Route path="*" element={<Notfound />} />
  </Routes>
</BrowserRouter>

)

export default App