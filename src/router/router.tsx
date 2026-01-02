import { createBrowserRouter } from "react-router";
import Layout from "../layouts/Layout.tsx";
import Home from "../pages/Home.tsx";
import SignIn from "../pages/(auth)/SignIn.tsx";
import SignUp from "../pages/(auth)/SignUp.tsx";
import VideoUpload from "../pages/videos/VideoUpload.tsx";
import ProfileEdit from "../pages/users/ProfileEdit.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { path: "", element: <Home /> },
            { path: "sign-in", element: <SignIn /> },
            { path: "sign-up", element: <SignUp /> },
            { path: "users", children: [{ path: "edit", element: <ProfileEdit /> }] },

            //    경로 : /videos/upload > Upload
            //          /videos/:id    > Detail
            { path: "videos", children: [{ path: "upload", element: <VideoUpload /> }] },
        ],
    },
]);

export default router;
