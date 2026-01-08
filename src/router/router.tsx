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
import InquiryList from "../pages/inquiries/InquiryList.tsx";
import InquiryCreate from "../pages/inquiries/InquiryCreate.tsx";
import InquiryDetail from "../pages/inquiries/InquiryDetail.tsx";
import InquiryEdit from "../pages/inquiries/InquiryEdit.tsx";
import SearchResults from "../pages/results/SearchResults.tsx";
import Subscriptions from "../pages/channels/Subscriptions.tsx";
import ChannelDetail from "../pages/channels/ChannelDetail.tsx";
import AdminLayout from "../layouts/AdminLayout.tsx";
import AdminDashboard from "../pages/admin/AdminDashboard.tsx";

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
            {
                path: "inquiries",
                children: [
                    { index: true, element: <InquiryList /> },
                    { path: "new", element: <InquiryCreate /> },
                    { path: ":id", element: <InquiryDetail /> },
                    { path: ":id/edit", element: <InquiryEdit /> },
                ],
            },
            { path: "results", element: <SearchResults /> },
            {
                path: "channels",
                children: [
                    { path: "subscriptions", element: <Subscriptions /> },
                    { path: ":id", element: <ChannelDetail /> },
                ],
            },
        ],
    },
    {
        path: "/admin",
        element: <AdminLayout />,
        children: [
            { index: true, element: <AdminDashboard />}
        ]
    }
]);

export default router;
