const CHANNEL_NAME = "photo-quiz-channel";
const channel = new BroadcastChannel(CHANNEL_NAME);

// ---------------------------------------------------------------------
// Pure in-memory store. No backend, no DB. Lives only as long as the
// browser tabs are open — closing every tab clears everything.
// ---------------------------------------------------------------------
let state = {
  images: [], // { id, name, url (base64 data URL), uploadedAt }
  currentImage: null, // image currently pushed to the Viewer tab
};

const listeners = new Set();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function setState(partial) {
  state = { ...state, ...partial };
  emitChange();
}

// --- cross-tab sync via BroadcastChannel ---
channel.onmessage = (event) => {
  const msg = event.data;

  switch (msg.type) {
    case "NEW_IMAGES": {
      setState({ images: [...msg.images, ...state.images] });
      break;
    }
    case "SELECT_IMAGE": {
      setState({ currentImage: msg.image });
      break;
    }
    case "REQUEST_SYNC": {
      // A tab just opened and is asking if anyone has state to share.
      if (state.images.length > 0 || state.currentImage) {
        channel.postMessage({
          type: "SYNC_STATE",
          images: state.images,
          currentImage: state.currentImage,
        });
      }
      break;
    }
    case "SYNC_STATE": {
      if (msg.images.length > state.images.length) {
        setState({ images: msg.images });
      }
      if (msg.currentImage && !state.currentImage) {
        setState({ currentImage: msg.currentImage });
      }
      break;
    }
    default:
      break;
  }
};

// As soon as this tab loads, ask any already-open tab for its current state.
channel.postMessage({ type: "REQUEST_SYNC" });

export function getState() {
  return state;
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function addImages(newImages) {
  setState({ images: [...newImages, ...state.images] });
  channel.postMessage({ type: "NEW_IMAGES", images: newImages });
}

export function selectImage(image) {
  setState({ currentImage: image });
  channel.postMessage({ type: "SELECT_IMAGE", image });
}