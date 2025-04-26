import { Toaster } from 'react-hot-toast';
import { AppRouter } from './routes/AppRouter'; // Added curly braces for named import

function App() {
  return (
    <>
      <AppRouter />
      <Toaster position="top-right" />
    </>
  );
}

export default App;