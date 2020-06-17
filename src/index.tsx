import * as React from "react";
import * as ReactDOM from "react-dom";

import Popup from './popup'
import Record from './record'
import { RecordProvider } from "./store/record";





ReactDOM.render(
    <div className="content-wrapper">
        <RecordProvider>
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