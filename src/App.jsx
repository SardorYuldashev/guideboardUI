import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Layout from './Pages/Layout';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Profile from './Pages/Profile';
import Users from './Pages/Users';
import UserAdd from './Pages/UserAdd';
import UserShow from './Pages/UserShow';
import UserEdit from './Pages/UserEdit';
import UserEditMe from './Pages/UserEditMe';
import GuideAdd from './Pages/GuideAdd';
import GuideShow from './Pages/GuideShow';
import GuideEdit from './Pages/GuideEdit';
import UserPassword from './Pages/UserPassword';
import TaskSend from './Pages/TaskSend';
import TaskAdd from './Pages/TaskAdd';
import TasksMy from './Pages/TasksMy';
import TaskShow from './Pages/TaskShow';
import TasksAll from './Pages/TasksAll';
import NotFound from './Pages/NotFound';
import CommentEdit from './Pages/CommentEdit';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='/' element={<Dashboard />} />
          <Route path='/guides/add' element={<GuideAdd />} />
          <Route path='/guides/edit/:id' element={<GuideEdit />} />
          <Route path='/guides/:id' element={<GuideShow />} />
          <Route path='/users' element={<Users />} />
          <Route path='/users/add' element={<UserAdd />} />
          <Route path='/users/password/:id' element={<UserPassword />} />
          <Route path='/users/edit/me' element={<UserEditMe />} />
          <Route path='/users/edit/:id' element={<UserEdit />} />
          <Route path='/users/:id' element={<UserShow />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/tasks' element={<TasksAll />} />
          <Route path='/tasks/my' element={<TasksMy />} />
          <Route path='/tasks/add' element={<TaskAdd />} />
          <Route path='/tasks/add/:id' element={<TaskSend />} />
          <Route path='/tasks/:id' element={<TaskShow />} />
          <Route path='/comment/:id' element={<CommentEdit />} />
        </Route>

        <Route path='/home' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;