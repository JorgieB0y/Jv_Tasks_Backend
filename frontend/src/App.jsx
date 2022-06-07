import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./index.css";
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword.jsx' 
import CreateNewPassword from './pages/CreateNewPassword.jsx' 
import ConfirmAccount from './pages/ConfirmAccount';
import { AuthProvider } from './context/AuthProvider';
import { ProjectsProvider } from './context/ProjectsProvider';
import Projects from './pages/Projects';
import NewCollaborator from './pages/NewCollaborator';
import SecuredRoute from './layouts/SecuredRoute';
import NewProject from './pages/NewProject.jsx';
import Project from './pages/Project';
import EditProject from './pages/EditProject';

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <ProjectsProvider>
          <Routes>
            <Route path='/' element={<AuthLayout />}>
              <Route index element={<Login />} />
              <Route path='register' element={<Register />} />
              <Route path='Forgot-Password' element={<ForgotPassword />} />
              <Route path='Forgot-Password/:token' element={<CreateNewPassword />} />
              <Route path='confirm/:id' element={<ConfirmAccount />} />
            </Route>

            <Route path='/projects' element={<SecuredRoute />} >
              <Route index element={<Projects />} />
              <Route path='create-project' element={<NewProject />} />
              <Route path='add-collaborator/:id' element={<NewCollaborator />} />
              <Route path=':id' element={<Project />} />
              <Route path='edit/:id' element={<EditProject />} />
            </Route>
          </Routes>
        </ProjectsProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
