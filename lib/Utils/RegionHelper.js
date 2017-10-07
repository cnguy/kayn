import regions from '../Enums/regions';
import platformIDs from '../Enums/platform-ids';

const asPlatformID = regionAbbr =>
  platformIDs[
    Object.keys(regions).filter(key => regions[key] === regionAbbr)[0]
  ];

const RegionHelper = {
  asPlatformID,
};

export default RegionHelper;
