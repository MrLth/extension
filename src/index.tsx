// import * as React from "react";
// import { useContext, useEffect } from "react";
// import * as ReactDOM from "react-dom";

// import { recordActionInit } from "store/record/actions";
// import { faviconStorageActionAdd } from "store/bookmark/actions";
// import { RecordProvider, RecordContext } from "./store";

// import Record from './view/Record'
// import Bookmark from "./view/Bookmark";
// import History from './view/History'

// function App() {
//     const { dispatch, faviconStorage, faviconStorageDispatch } = useContext(RecordContext)

//     useEffect(() => {

//         chrome.storage.local.get((storage) => {

//             const urls = storage?.urls || []

//             dispatch(recordActionInit(Array.from(urls)))

//             const favicons = storage?.favicons || {}

//             faviconStorageDispatch(faviconStorageActionAdd(favicons))
//         })
//     }, [])

//     return (
//         <div className="content-wrapper">
//             <div className="bookmark-wrapper">
//                 <Bookmark />
//             </div>
//             <div className="popup-wrapper">
//                 <Popup />
//             </div>
//             <div className="history-wrapper">
//                 <History />
//             </div>
//             <div className="record-wrapper">
//                 <Record />
//             </div>
//         </div>
//     )
// }

// ReactDOM.render(
//     <RecordProvider>
//         <App />
//     </RecordProvider>
//     ,
//     document.getElementById("example")
// );

// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', function () {
//         navigator.serviceWorker.register('./sw.js')
//             .then(function (registration) {
//                 // 注册成功
//                 // console.log('ServiceWorker registration successful with scope: ', registration.scope);
//             })
//             .catch(function (err) {
//                 // 注册失败
//                 console.log('ServiceWorker registration failed: ', err);
//             });
//     });
// }


// serviceWorker.unregister();
