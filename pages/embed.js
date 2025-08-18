const MOPO_AGENT_LOADED_FLAG = 'MOPO_AgentLoaded';
        
if (!window.top[MOPO_AGENT_LOADED_FLAG]) {
          window.top[MOPO_AGENT_LOADED_FLAG] = true;
          console.log("Initializing MOPO agent for the first time.");
          

const MAX_WIDTH = 620;
const IFRAME_ID = "mopo-iframe";
const AGENT_URL = "https://devagent.mopo.life";
let lastReceivedWidth = null;

const getEmbeddedNavigateToParameter = () => {
  let embedScript =
    document.querySelector("#mopo_agent_embed_script") ||
    document.querySelector("#agent_embed_script");

  try {
    const scriptUrl = new URL(embedScript.src);
    const navTo = scriptUrl.searchParams.get("navigateTo");

    return navTo || "";
  } catch (err) {
    console.error("[DEBUG] Error parsing URL:", err);
    return "";
  }
};

const getEmbeddedUrlParameter = () => {
  let embedScript =
    document.querySelector("#mopo_agent_embed_script") ||
    document.querySelector("#agent_embed_script");
  if (!embedScript || !embedScript.src) return "";

  const embedSrc = embedScript.src;

  const url = embedSrc.includes("url=")
    ? embedSrc.substring(embedSrc.indexOf("url=") + 4)
    : "";
  return url;
};

const getPartner = () => {
  const embedScript =
    document.querySelector("#mopo_agent_embed_script") ||
    document.querySelector("#agent_embed_script");
  if (!embedScript || !embedScript.src) return "";

  const embedSrc = embedScript.src ?? "";
  const windowSrc = document.location.href ?? "";
  const partner = isActOnPartner(embedSrc + windowSrc)
    ? "act-on.com"
    : "mopo.life";

  return partner;
};

const isActOnPartner = (urlString) => {
  return urlString.includes("ninja") || urlString.includes("actonsoftware");
};

function safeURIDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch (_) {
    return "";
  }
}

function getAllCookies() {
  let cookies = document.cookie.split("; ");
  let cookieObject = {};

  cookies.forEach((cookie) => {
    let [name, value] = cookie.split("=");
    cookieObject[safeURIDecode(name)] = safeURIDecode(value);
  });

  return cookieObject;
}

const hubspotutk = getAllCookies().hubspotutk || "none";
const munchkin = getAllCookies()._mkto_trk || "none";
const mauticid = getAllCookies().mtc_id || "none";
const klaviyoid = getAllCookies().__kla_id || "none";

function getCookieValue(prefix) {
  const cookies = document.cookie.split("; ");
  const regex = new RegExp("^" + prefix + "(.*)?$", "i");
  const cookie = cookies.find((row) => regex.test(row.split("=")[0].trim()));
  return cookie ? safeURIDecode(cookie.split("=")[1]) : "none";
}

const pardotVisitorCookie = getCookieValue("visitor_id");

function getActOnUserID() {
  const decodedCookie = safeURIDecode(document.cookie);
  const cookies = decodedCookie.split(";");

  // Assuming the Act-On cookie name starts with 'wp' followed by digits
  const actOnCookie = cookies.find(function (cookie) {
    return cookie.trim().startsWith("wp");
  });

  if (!actOnCookie) {
    return "none";
  }

  const cookieValue = actOnCookie.split("=")[1].trim();
  const cookieWithoutQuotes = cookieValue.replace(/"/g, "");

  return cookieWithoutQuotes;
}

var actOnUserID = getActOnUserID();

const iFrameSrcUrl = new URL(AGENT_URL);

iFrameSrcUrl.searchParams.append("url", getEmbeddedUrlParameter());
const navigateTo = getEmbeddedNavigateToParameter();

iFrameSrcUrl.searchParams.append("navigateTo", navigateTo);
iFrameSrcUrl.searchParams.append("partner", getPartner());
iFrameSrcUrl.searchParams.append("sourceUrl", document.location.href);
iFrameSrcUrl.searchParams.append("hubspotutk", hubspotutk);
iFrameSrcUrl.searchParams.append("beacon", actOnUserID);
iFrameSrcUrl.searchParams.append("munchkin", munchkin);
iFrameSrcUrl.searchParams.append("pardot", pardotVisitorCookie);
iFrameSrcUrl.searchParams.append("mauticid", mauticid);
iFrameSrcUrl.searchParams.append("klaviyoid", klaviyoid);

const iFrameSrcUrlString = iFrameSrcUrl.toString();

document.write("<!--MOPOAGENT-->");
document.write(
  `<iframe id="${IFRAME_ID}" style="position:fixed;bottom:0;left:0;z-index:9999;border:none;" 
    src="${iFrameSrcUrlString}" allow="autoplay; microphone *;"></iframe>`,
);

const getIframeElement = () => document.getElementById(IFRAME_ID);

const setIframeDimensions = (height, width) => {
  const iframe = getIframeElement();
  if (!iframe) return;

  // Use `min` to prevent the height from exceeding the height of the screen. Necessary for mobile.
  iframe.style.height = `min(100%,${height}px)`;
  iframe.style.width = `${width}px`;
};

const updateWidthOnResize = () => {
  const iframe = getIframeElement();

  if (iframe && window?.innerWidth && window?.innerWidth <= MAX_WIDTH)
    iframe.style.width = "100%";
};

const computeDesiredWidth = (receivedWidth, windowWidth) => {
  if (receivedWidth >= MAX_WIDTH || windowWidth >= MAX_WIDTH) return MAX_WIDTH;
  if (windowWidth < MAX_WIDTH) return windowWidth;
  return receivedWidth;
};

const handleIframeMessage = (event) => {
  // Optional: Verify origin for security
  // if (event.origin !== 'http://expected.origin.com') return;

  if (event.data === "applyRight") {
    setBottomRightPosition();
    return;
  }

  // Handle dimensions
  const { height, width } = event.data;
  if (height && width) {
    lastReceivedWidth = computeDesiredWidth(width, window.innerWidth);
    setIframeDimensions(height, lastReceivedWidth);
  }
};

const setBottomRightPosition = () => {
  const iframe = getIframeElement();
  if (!iframe) return;

  iframe.style.right = "0";
  iframe.style.left = "unset";
};

const sendSearchTermToIframe = (searchTerm) => {
  const iframe = getIframeElement();
  if (!iframe) return;

  iframe.contentWindow.postMessage(
    { type: "MOPO_AGENT_INPUT", searchTerm },
    "*",
  );
};

window.addEventListener("message", handleIframeMessage, false);
window.addEventListener("resize", updateWidthOnResize);


} else {
  console.log("MOPO Agent already loaded. Preventing recursion.");
}
