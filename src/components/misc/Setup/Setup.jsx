import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import setupBranding from './setupBranding';

const Setup = ({ baseConfig, branding }) => {
  useEffect(() => {
    setupBranding(branding.styles);
  }, [branding]);

  useEffect(() => {
    document.title = `${baseConfig.name} | WebConf Hub`;
  }, [baseConfig]);

  return null;
};

const mapStateToProps = state => {
  return {
    baseConfig: { ...state.config.baseConfig },
    branding: { ...state.config.branding },
  };
};

export default connect(mapStateToProps)(Setup);
