import React from 'react';
import { FiMapPin, FiPhoneCall } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import './TopBar.css';

function TopBar() {
  return (
    <div className="topbar">
      <div className="topbar__item topbar__item--contact">
        <span className="topbar__icon">
          <FiPhoneCall />
        </span>
        <span>+00 1234 567 890</span>
      </div>

      <div className="topbar__promo">
        <span className="topbar__promo-badge">
          <HiSparkles />
          Limited Deal
        </span>
        <p>Get 50% off on selected items. Shop now before tonight.</p>
      </div>

      <div className="topbar__item topbar__item--location">
        <span className="topbar__icon">
          <FiMapPin />
        </span>
        <span>English / India</span>
      </div>
    </div>
  );
}

export default TopBar;
