import { createBrowserRouter } from "react-router";
import Home from "../pages/home/Home";
import PublicLayout from "../components/layout/PublicLayout";
import DashboardLayout from "../components/layout/DashboardLayout";
import Login from "../pages/login/Login";
import Signup from "../pages/signup/Signup";
import ForgotPassword from "../pages/forgot-password/ForgotPassword";
import Challenges from "../pages/challenge/Challenges";
import ErrorPage from "../pages/error/ErrorPage";
import PrivetRoute from "../pages/privetPage/PrivetRoute";
import ChallengeDetails from "../components/common/ChallengeDetails";
import MyChallenges from "../pages/dashboard/components/MyChallenges";
import PostChallenge from "../pages/dashboard/components/PostChallenge";
import Profile from "../pages/dashboard/components/Profile";
import TrackProgress from "../pages/dashboard/components/TrackProgress";
import MyContributions from "../pages/dashboard/components/MyContributions";
import AddTips from "../pages/dashboard/components/AddTips";
import MyTips from "../pages/dashboard/components/MyTips";
import Tips from "../pages/tips/Tips";
import AddEvent from "../pages/dashboard/components/AddEvent";
import AllEvents from "../components/common/AllEvents";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: PublicLayout,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      { index: true, Component: Home },
      { path: "login", Component: Login },
      { path: "signup", Component: Signup },
      { path: "challenge", Component: Challenges },
      { path: "challenge/:id", Component: ChallengeDetails },
      { path: "forgot-password/:email", Component: ForgotPassword },
      { path: "tips", Component: Tips },
      { path: "allevents", Component: AllEvents },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivetRoute>
        <DashboardLayout />
      </PrivetRoute>
    ),
    children: [
      { path: "profile", Component: Profile },
      // { path: "myactivities", element: <div>i am from activity</div> },
      {
        path: "myactivities",
        Component: MyChallenges,
      },
      {
        path: "myactivities/mytips",
        Component: MyTips,
      },
      {
        path: "myactivities/addtips",
        Component: AddTips,
      },
      {
        path: "myactivities/addevent",
        Component: AddEvent,
      },
      {
        path: "myactivities/trackprogress",
        Component: TrackProgress,
      },
      {
        path: "myactivities/mycontributions",
        Component: MyContributions,
      },
      {
        path: "myactivities/createchallenge",
        Component: PostChallenge,
      },
    ],
  },
]);
