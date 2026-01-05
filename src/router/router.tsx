import { createBrowserRouter } from "react-router";
import Layout from "../layouts/Layout.tsx";
import Home from "../pages/Home.tsx";
import SignIn from "../pages/(auth)/SignIn.tsx";
import SignUp from "../pages/(auth)/SignUp.tsx";
import VideoUpload from "../pages/videos/VideoUpload.tsx";
import ProfileEdit from "../pages/users/ProfileEdit.tsx";
import VideoDetail from "../pages/videos/VideoDetail.tsx";
import NoticeList from "../pages/notices/NoticeList.tsx";
import NoticeCreate from "../pages/notices/NoticeCreate.tsx";
import NoticeDetail from "../pages/notices/NoticeDetail.tsx";
import NoticeEdit from "../pages/notices/NoticeEdit.tsx";

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
            {
                path: "videos",
                children: [
                    { path: "upload", element: <VideoUpload /> },
                    { path: ":id", element: <VideoDetail /> },
                ],
            },
            //      경로 : /notices       > NoticeList
            //             /notices/create  > NoticeCreate
            //             /notices/:id    > NoticeDetail
            //             /notices/:id/edit   > NoticeEdit
            {
                path: "notices",
                children: [
                    { index: true, element: <NoticeList /> },
                    { path: "create", element: <NoticeCreate /> },
                    { path: ":id", element: <NoticeDetail /> },
                    { path: ":id/edit", element: <NoticeEdit /> },
                ],
            },
        ],
    },
]);

export default router;
