import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import './AdBar.less';

const ROTATION_SPEED = 10000;

const shuffleAds = ads => {
  let currentIndex = ads.length;
  let temporaryValue;
  let randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = ads[currentIndex];
    ads[currentIndex] = ads[randomIndex];
    ads[randomIndex] = temporaryValue;
  }
  return ads;
};

const prepareAds = sponsors => {
  const ads = [];

  sponsors.forEach(sponsor => {
    if (sponsor.ads) {
      sponsor.ads.forEach(ad => {
        ads.push({
          company: sponsor.company,
          logo: sponsor.company.logo,
          ...ad,
        });
      });
    }
  });

  return shuffleAds(ads);
};

const renderAdd = ad => {
  return (
    <a href={ad.href} target="_blank">
      <img src={ad.logo} alt={`${ad.company} logo`} />
      <article>
        <strong>{ad.company}</strong> have a <strong>job offer!</strong>
        <br />
        <h2>
          <i className="lni lni-briefcase"></i>
          {ad.text}
          <i className="lni lni-arrow-top-right"></i>
        </h2>
      </article>
    </a>
  );
};

const AdBar = ({ sponsors }) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [ads, setAds] = useState(prepareAds(sponsors));

  useEffect(() => {
    window.setTimeout(() => {
      let nextIndex = currentAdIndex + 1;
      if (nextIndex >= ads.length) nextIndex = 0;
      setCurrentAdIndex(nextIndex);
    }, ROTATION_SPEED);
  }, [currentAdIndex]);

  return (
    <aside className="wch-adbar">
      <header>
        Sponsor <i className="lni lni-star"></i>
      </header>
      {renderAdd(ads[currentAdIndex])}
    </aside>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    sponsors: [...state.config.sponsors],
  };
};

export default connect(mapStateToProps)(AdBar);
