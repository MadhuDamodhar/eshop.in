import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
class Toastify{
  // Success toast with a custom message
  showSuccessMessage = (message) => {
    toast.success(message, {
      position: 'bottom-center',
      className: 'black-white-toast',  // Apply custom class
    });
  };

  // Error toast with a custom message
  showErrorMessage = (message) => {
    toast.error(message, {
      position: 'bottom-center',
      className: 'black-white-toast',  // Apply custom class
    });
  };
} export default new Toastify();