import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import React from "react";
import { RouterProvider, createBrowserRouter, Outlet, redirect } from 'react-router-dom';
import Welcome, {action as authAction, loader as authLoader} from "./page/Welcome.js";
import {action as logoutAction} from './page/Logout.js';
import RootLayout from "./components/Root.js";
import StyleTransfer, {action as saveBackgroundAssetAction} from './page/StyleTransfer.js';
import PoseTransfer, {action as savePoseAssetAction} from './page/PoseTransfer.js';
import CreateNew from './page/CreateNew.js';
import Train from './page/Train.js';
import {loader as isTrainedLoader} from './components/Panel.js';
import AssetList, {loader as assetsLoader} from './components/AssetList.js';
import AssetDetail, {loader as assetDetailLoder} from './components/AssetDetail.js';
import InitialPage from './page/InitialPage.js';
import PageNotFound from "./components/PageNotFound.js";
import WebtoonPage from './page/WebtoonPage.js';

import { NotiProvider } from './store/noti_context.js';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: false,
      retry: 1,
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 5,
    },
  },
});

 
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    // errorElement: <ErrorPage />,
    children: [
      { index: true,
        element: <InitialPage />,
      },
      {
        path:':webtoonName',
        element: <WebtoonPage />,
        id:'webtoonRoot',
        loader: isTrainedLoader,
        children:[
          {
            path: 'assets',
            element: <Outlet />,
            children:[
              {
                index: true, 
                element: <AssetList />,
                loader: assetsLoader,
              },
              {
                path:':assetName',
                element:<AssetDetail />,
                loader: assetDetailLoder,
              }
            ]
          },
          {
            path: 'createNew',
            element: <Outlet />,
            children:[
              { index: true, element: <CreateNew /> },
              {
                path: 'styleTransfer',
                element: <StyleTransfer />,
              },
              {
                path: 'poseTransfer',
                element: <PoseTransfer />,
              },
    
            ]
          },
          {
            path: 'train',
            element: <Train />,
          },

        ]
      },
      {
        path: 'logout',
        action: logoutAction,
      }
    ],
  },
  {
    path: '/auth',
    element: <Welcome />,
    // errorElement: <ErrorPage />,
    action: authAction,
    loader: authLoader,
  },
  {
    path:'*',
    element: <PageNotFound />,
  }
]);

function App() {
  return <QueryClientProvider client={queryClient}>
    <NotiProvider>
      <RouterProvider router={router} />
      <ReactQueryDevtools />
    </NotiProvider>
    </QueryClientProvider>;
}

export default App;
