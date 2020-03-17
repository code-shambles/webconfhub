import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import './AdBar.less';

const ROTATION_SPEED = 1000 * 60 * 3; // 3 minutes

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
          logo: sponsor.logo,
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
  const [a7nClass, setA7nClass] = useState('wch-a7n-fade-out');

  // useEffect(() => {
  //   let rotationTimer;

  //   return () => {
  //     clearTimeout(rotationTimer);
  //   };
  // }, [currentAdIndex]);

  useEffect(() => {
    let a7nOutTimer = null;
    let a7nInTimer = null;
    let rotationTimer = null;

    setA7nClass('wch-a7n-fade-in');

    a7nInTimer = setTimeout(() => {
      setA7nClass('');
      rotationTimer = window.setTimeout(() => {
        setA7nClass('wch-a7n-fade-out');
        a7nOutTimer = setTimeout(() => {
          setCurrentAdIndex(
            currentAdIndex + 1 === ads.length ? 0 : currentAdIndex + 1
          );
        }, 800);
      }, ROTATION_SPEED);
    }, 800);

    return () => {
      clearTimeout(a7nOutTimer);
      clearTimeout(a7nInTimer);
      clearTimeout(rotationTimer);
    };
  }, [currentAdIndex]);

  return (
    <aside className={`wch-adbar ${a7nClass}`}>
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
