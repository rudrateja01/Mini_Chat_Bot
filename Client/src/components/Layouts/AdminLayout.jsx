import React from 'react';
import { NavLink } from 'react-router-dom';
import './layout.css';
import { Outlet } from "react-router-dom";
import logo from "../../assets/logos/logo.png";

import { Icon } from '@iconify/react';
import homeIcon from '@iconify/icons-mdi/home';
import chatIcon from '@iconify/icons-mdi/chat';
import analyticsIcon from '@iconify/icons-mdi/chart-bar';
import botIcon from '@iconify/icons-mdi/robot';
import groupIcon from '@iconify/icons-mdi/account-group';
import settingsIcon from '@iconify/icons-mdi/cog';

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <img src={logo} alt="logo" />
        <nav>
          <NavLink to="/admin" end>
            <Icon icon={homeIcon} className="sidebar-icon" />
            <p>Dashboard</p>
          </NavLink>

          <NavLink to="/admin/contact-center">
            <Icon icon={chatIcon} className="sidebar-icon" />
            <p>Contact Center</p>
          </NavLink>

          <NavLink to="/admin/analytics">
            <Icon icon={analyticsIcon} className="sidebar-icon" />
            <p>Analytics</p>
          </NavLink>

          <NavLink to="/admin/chat-bot">
            <Icon icon={botIcon} className="sidebar-icon" />
            <p>Chat Bot</p>
          </NavLink>

          <NavLink to="/admin/team">
            <Icon icon={groupIcon} className="sidebar-icon" />
            <p>Team</p>
          </NavLink>

          <NavLink to="/admin/settings">
            <Icon icon={settingsIcon} className="sidebar-icon" />
            <p>Settings</p>
          </NavLink>
        </nav>
      </aside>

      <div className="main-area">

        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
