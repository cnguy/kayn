import regions from '../Enums/regions';
import platformIDs from '../Enums/platform-ids';

const asPlatformID = regionAbbr =>
  platformIDs[
    Object.keys(regions).filter(key => regions[key] === regionAbbr)[0]
  ];

const isValidRegion = val =>
  Object.keys(regions).some(key => regions[key] === val);

const RegionHelper = {
  asPlatformID,
  isValidRegion,
};

export default RegionHelper;
