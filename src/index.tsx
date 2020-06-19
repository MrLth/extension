import * as React from "react";
import * as ReactDOM from "react-dom";

import Popup from './view/Popup'
import Record from './view/Record'
import { RecordProvider } from "./store/record";
import Bookmark from "./view/Bookmark";


ReactDOM.render(
    <div className="content-wrapper">
        <RecordProvider>
            <div className="bookmark-wrapper">
                <Bookmark/>
            </div>
            <div className="popup-wrapper">
                <Popup />
            </div>
            <div className="record-wrapper">
                <Record />
            </div>
        </RecordProvider>
    </div>,
    document.getElementById("example")
);