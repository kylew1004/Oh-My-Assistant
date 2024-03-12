import React, { useState } from "react";
import { RouterProvider, createBrowserRouter, Outlet } from 'react-router-dom';
import {tokenLoader, checkAuthLoader} from './util/auth';
import Welcome, {action as authAction, loader as authLoader} from "./page/Welcome.js";
import {action as logoutAction} from './page/Logout.js';
import Assets, {loader as assetsLoader} from './page/Assets.js';
import RootLayout, {loader as rootLoader, action as rootAction} from "./components/Root.js";
import StyleTransfer, {action as saveBackgroundAssetAction} from './page/StyleTransfer.js';
import PoseTransfer, {action as savePoseAssetAction} from './page/PoseTransfer.js';
import CreateNew from './page/CreateNew.js';
import Train from './page/Train.js';
import Panel from './components/Panel.js';

 
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    // errorElement: <ErrorPage />,
    id:'root',
    // loader: tokenLoader,
    loader: rootLoader,
    action: rootAction,
    children: [
      { index: true, element: <p>no webtoon selected</p> },
      {
        path:':webtoonName',
        element: <>
          <Panel />
          <Outlet />
        </>,
        children:[
          // { index: true, element: <Assets /> },
          {
            path: 'assets',
            element: <Assets />,
            loader: assetsLoader,
          },
          {
            path: 'createNew',
            element: <Outlet />,
            // action: authAction,
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
            // action: authAction,
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
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
