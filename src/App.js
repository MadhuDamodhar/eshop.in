import { BrowserRouter, Routes, Route } from "react-router-dom";
import Store from "./Components/Store/Store";
import UserSignUp from "./Components/UserSignUp/UserSignUp";
import UserSignIn from "./Components/UserSingIn/UserSignIn";
import AdminDashBoard from "./Components/AdminDashBoard/AdminDashBoard";
import UserDashBoard from './Components/UserDashboard/UserDashboard'
import "./App.css";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Store />} />
          <Route path="/UserSignUp" element={<UserSignUp />} />
          <Route path="/UserSignIn" element={<UserSignIn />} />
          <Route path="/AdminDashBoard" element={<AdminDashBoard />} />
          <Route path="/UserDashBoard" element={<UserDashBoard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
