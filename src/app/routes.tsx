import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { LecturesPage } from "./pages/LecturesPage";
import { QuizzesPage } from "./pages/QuizzesPage";
import { StreakRewardsPage } from "./pages/StreakRewardsPage";
import { CoursePage } from "./pages/CoursePage";
import { StorePage } from "./pages/StorePage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "lectures",
        element: <LecturesPage />,
      },
      {
        path: "lectures/:courseId",
        element: <CoursePage />,
      },
      {
        path: "quizzes",
        element: <QuizzesPage />,
      },
      {
        path: "streak-rewards",
        element: <StreakRewardsPage />,
      },
      {
        path: "store",
        element: <StorePage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);