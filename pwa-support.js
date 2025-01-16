const serviceWorker = navigator.serviceWorker;
if (serviceWorker) {
  serviceWorker.register("/service-worker.js")
    .catch((e) => console.log("Failed to Register the ServiceWorker.", e));
};
