import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { CollectionProvider } from './context/Collection.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename="/api-testing-web">
    <CollectionProvider>
      <App />
    </CollectionProvider>
  </BrowserRouter>
)
