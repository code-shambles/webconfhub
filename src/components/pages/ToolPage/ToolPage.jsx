import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { AccessLinkGenerator } from '../../';

import './ToolPage.less';

const ToolPage = () => {
  return (
    <main id="wch-tools" className="wch-main">
      <AccessLinkGenerator />
    </main>
  );
};

export default withRouter(ToolPage);
