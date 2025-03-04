import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginView from "./views/LoginView";
import RegisterView from "./views/RegisterView";
import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout";
import LinkTreeView from "./views/LinkTreeView";
import ProfileView from "./views/ProfileView";
import HandleView from "./views/HandleView";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        //authentication
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<LoginView />} />
          <Route path="/auth/register" element={<RegisterView />} />
        </Route>
        //dashboard
        <Route path="/admin" element={<AppLayout />}>
          <Route index={true} element={<LinkTreeView />} /> //index is to
          inherit the father parth
          <Route path="profile" element={<ProfileView />} /> //no need to add
          "/" to anidate the bcz if we put "/profile" is an absolute path
        </Route>
        <Route path="/:handle" element={<AuthLayout />}>
          <Route element={<HandleView />} index={true} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
