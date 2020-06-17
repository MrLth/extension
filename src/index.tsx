import * as React from "react";
import * as ReactDOM from "react-dom";
// import { Provider } from 'react-redux';

// import store from './store';
import Popup from './components/popup'





// ReactDOM.render(
//     <div className="popup-wrapper">
//         <Provider store={store}>
//             <Popup />
//         </Provider>
//     </div>,
//     document.getElementById("example")
// );

ReactDOM.render(
    <div className="popup-wrapper">
        {/* <Provider store={store}> */}
            <Popup />
        {/* </Provider> */}
    </div>,
    document.getElementById("example")
);