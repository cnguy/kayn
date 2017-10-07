const isKeyValid = key => key && typeof key === 'string';
const areLimitsValid = limits =>
  limits &&
  Array.isArray(limits) &&
  limits.every(
    limit => typeof limit.count === 'number' && typeof limit.per === 'number',
  );

const ParameterHelper = {
  isKeyValid,
  areLimitsValid,
};

export default ParameterHelper;
