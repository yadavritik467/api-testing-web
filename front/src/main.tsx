import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { CollectionProvider } from "./context/Collection.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <CollectionProvider>
      <App />
    </CollectionProvider>
  </BrowserRouter>
);
