export const fadeInOut = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 0,
  },
};
export const slideLeft = {
  initial: {
    x: "-100%",
  },
  in: {
    x: "0%",
  },
  out: {
    x: "-100%",
  },
};
export const slideRight = {
  initial: {
    x: "100%",
  },
  in: {
    x: "0%",
  },
  out: {
    x: "100%",
  },
};
export const slideRightFade = {
  initial: {
    x: "100%",
  },
  in: {
    x: "0%",
  },
  out: {
    opacity: 0,
  },
};
export const slideRightStill = {
  initial: {
    x: "100%",
  },
  in: {
    x: "0%",
  },
  out: {},
};

export const slideBottom = {
  initial: {
    y: "100%",
  },
  in: {
    y: "0%",
  },
  out: {
    y: "100%",
    opacity: 0,
  },
};

export const fadeInOutFunc = (config = {}) => {
  const trans = { ...fadeInOut };
  Object.keys(config).map((k) => {
    trans[k] = { ...trans[k], ...config[k] };
  });
  return trans;
};
export const slideRightFunc = (config = {}) => {
  const trans = { ...slideRight };
  Object.keys(config).map((k) => {
    trans[k] = { ...trans[k], ...config[k] };
  });
  return trans;
};
export const slideLeftFunc = (config = {}) => {
  const trans = { ...slideLeft };
  Object.keys(config).map((k) => {
    trans[k] = { ...trans[k], ...config[k] };
  });
  return trans;
};
