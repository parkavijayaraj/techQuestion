export const getBrowserInfo = () => {
  const ua = navigator.userAgent;
  const vendor = navigator.vendor;

  const isEdge = ua.indexOf("Edg") > -1;
  const isOpera = ua.indexOf("OPR") > -1 || ua.indexOf("Opera") > -1;
  const isChrome = /Chrome/.test(ua) && /Google Inc/.test(vendor) && !isEdge && !isOpera;

  // Extract version
  const match = ua.match(/Chrome\/(\d+)/);
  const version = match ? match[1] : "Unknown";

  return {
    isChrome,
    name: isEdge ? "Edge" : isOpera ? "Opera" : isChrome ? "Chrome" : "Other",
    version
  };
};
