import React from 'react';
import { Outlet } from 'react-router-dom';

function MainLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default React.memo(MainLayout, () => false);
