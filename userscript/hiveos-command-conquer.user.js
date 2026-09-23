// ==UserScript==
// @name         HiveOS - Command & Conquer UI
// @namespace    https://the.hiveos.farm/
// @version      2.0.0
// @description  Converts the HiveOS web interface into a Command & Conquer / Red Alert inspired command center.
// @author       Zack
// @match        https://the.hiveos.farm/*
// @match        https://*.hiveos.farm/*
// @run-at       document-start
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    const C = {
        red: '#ff3b30',
        redBright: '#ff504c',
        redDark: '#7a0804',
        redDeep: '#350000',

        black: '#050607',
        black2: '#090b0d',
        panel: '#0d1114',
        panel2: '#12171b',
        panel3: '#171d21',

        steel: '#252c31',
        steel2: '#30383e',
        border: '#3c464d',

        yellow: '#ffcc33',
        amber: '#ff9900',

        white: '#e5e8e8',
        gray: '#9aa3a8',
        darkGray: '#566067',

        green: '#67c45b',
        blue: '#35a8ff'
    };

    /*
     * ------------------------------------------------------------
     * GLOBAL HIVEOS COLOR OVERRIDES
     * ------------------------------------------------------------
     *
     * HiveOS uses CSS variables heavily. Override both the newer
     * --hos-color-* system and the older --hos-* variables.
     */

    GM_addStyle(`
    :root {
        /* Base HiveOS backgrounds */
        --hos-color-gray-010: ${C.black2} !important;
        --hos-color-gray-008: #020303 !important;
        --hos-color-gray-013: #07090b !important;
        --hos-color-gray-015: #0a0d10 !important;
        --hos-color-gray-017: ${C.panel} !important;
        --hos-color-gray-021: ${C.panel2} !important;
        --hos-color-gray-024: ${C.steel} !important;

        /* HiveOS red */
        --hos-color-red-005: #160000 !important;
        --hos-color-red-015: ${C.redDeep} !important;
        --hos-color-red-030: rgba(255,59,48,.30) !important;
        --hos-color-red-037: ${C.redDark} !important;
        --hos-color-red-060: ${C.red} !important;
        --hos-color-red-065: ${C.redBright} !important;
        --hos-color-red-070: #ff706a !important;
        --hos-color-red-080: #ff9a95 !important;
        --hos-color-red-090: #ffc4c1 !important;

        /* Orange / yellow */
        --hos-color-deep-orange-020: #401500 !important;
        --hos-color-deep-orange-050: ${C.amber} !important;
        --hos-color-orange-050: ${C.amber} !important;
        --hos-color-orange-060: #ffb84d !important;

        --hos-color-amber-020: #403000 !important;
        --hos-color-amber-050: ${C.yellow} !important;
        --hos-color-amber-060: #ffd966 !important;
        --hos-color-amber-070: #ffe28a !important;
        --hos-color-amber-080: #ffebad !important;

        --hos-color-yellow-020: #403400 !important;
        --hos-color-yellow-050: ${C.yellow} !important;

        /* Green */
        --hos-color-light-green-014: #14200f !important;
        --hos-color-light-green-020: #1d3214 !important;
        --hos-color-light-green-024: #29471b !important;
        --hos-color-light-green-050: ${C.green} !important;
        --hos-color-light-green-080: #b8e7ae !important;

        /* Blue */
        --hos-color-blue-015: #071b29 !important;
        --hos-color-blue-020: #0b2940 !important;
        --hos-color-blue-040: #14547c !important;
        --hos-color-blue-050: ${C.blue} !important;
        --hos-color-blue-060: #70c5ff !important;
        --hos-color-blue-070: #a8ddff !important;

        /* Purple / misc */
        --hos-color-indigo-056: #334c70 !important;
        --hos-color-indigo-066: #5874a8 !important;
        --hos-color-purple-040: #51255c !important;
        --hos-color-purple-060: #b06ac0 !important;

        /* Legacy HiveOS variables */
        --hos-dark-bg: ${C.panel} !important;
        --hos-extra-dark-bg: ${C.black2} !important;
        --hos-xxl-dark-bg: #020303 !important;
        --hos-light-bg: ${C.panel2} !important;
        --hos-extra-light-bg: ${C.panel3} !important;
        --hos-xxl-light-bg: ${C.steel} !important;
        --hos-xxxl-light-bg: ${C.steel2} !important;

        --hos-grey-border: ${C.border} !important;
        --hos-light-grey: ${C.gray} !important;

        --red-color: ${C.red} !important;
        --red-hot-color: ${C.redBright} !important;
        --green-color: ${C.green} !important;
        --blue-color: ${C.blue} !important;
        --orange-color: ${C.amber} !important;
        --yellow-color: ${C.yellow} !important;
    }
    `);


    /*
     * ------------------------------------------------------------
     * MAIN COMMAND CENTER CSS
     * ------------------------------------------------------------
     */

    GM_addStyle(`
    html,
    body {
        background:
        linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px),
                ${C.black} !important;

                background-size: 32px 32px !important;
                color: ${C.white} !important;
    }

    body {
        font-family:
        "Share Tech Mono",
        "Roboto Mono",
        "Consolas",
        "Liberation Mono",
        monospace !important;

        font-size: 13px !important;
    }

    body::before {
        content: "";
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 2147483000;

        background:
        repeating-linear-gradient(
            to bottom,
            rgba(255,255,255,.018) 0px,
                                  rgba(255,255,255,.018) 1px,
                                  transparent 1px,
                                  transparent 4px
        );

        opacity: .28;
    }

    body::after {
        content: "";
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 2147482999;

        box-shadow:
        inset 0 0 140px rgba(0,0,0,.90),
                inset 0 0 30px rgba(255,0,0,.04);
    }

    /*
     * Main application surfaces
     */

    #root,
    #app,
    main,
    [role="main"] {
        background: transparent !important;
        color: ${C.white} !important;
    }

    /*
     * Remove rounded modern-web styling.
     */

    div,
    section,
    article,
    aside,
    nav {
        scrollbar-color: ${C.redDark} ${C.black2};
    }

    * {
        border-radius: 0 !important;
    }

    /*
     * Main content area.
     */

    main,
    [role="main"] {
        position: relative !important;
    }

    /*
     * Panels/cards.
     */

    [class*="card"],
    [class*="Card"],
    [class*="panel"],
    [class*="Panel"],
    [class*="paper"],
    [class*="Paper"] {
        background:
        linear-gradient(
            180deg,
            rgba(255,255,255,.025),
                        rgba(0,0,0,.10)
        ),
        ${C.panel} !important;

        border: 1px solid ${C.border} !important;

        box-shadow:
        inset 0 1px rgba(255,255,255,.035),
                inset 0 -1px rgba(0,0,0,.65),
                0 3px 12px rgba(0,0,0,.40) !important;
    }

    /*
     * Tables
     */

    table {
        background: ${C.panel} !important;
        border-collapse: collapse !important;
        border: 1px solid ${C.border} !important;
    }

    thead,
    th {
        background:
        linear-gradient(
            180deg,
            #222a2f,
            #11161a
        ) !important;

        color: ${C.yellow} !important;
        border-bottom: 1px solid ${C.redDark} !important;
        text-transform: uppercase !important;
        letter-spacing: .05em !important;
    }

    td {
        background: transparent !important;
        color: ${C.white} !important;
        border-bottom: 1px solid rgba(255,255,255,.045) !important;
    }

    tr:hover td {
        background: rgba(255,59,48,.08) !important;
    }

    /*
     * Inputs / selects
     */

    input,
    textarea,
    select {
        background: #080b0d !important;
        color: ${C.white} !important;

        border: 1px solid ${C.border} !important;

        box-shadow:
        inset 0 2px 5px rgba(0,0,0,.7) !important;
    }

    input:focus,
    textarea:focus,
    select:focus {
        border-color: ${C.red} !important;

        outline: 1px solid rgba(255,59,48,.25) !important;

        box-shadow:
        0 0 8px rgba(255,59,48,.15),
                inset 0 2px 5px rgba(0,0,0,.7) !important;
    }

    /*
     * Buttons
     */

    button,
    [role="button"] {
        background:
        linear-gradient(
            180deg,
            #343d43 0%,
            #1c2327 48%,
            #111518 100%
        ) !important;

        color: ${C.white} !important;

        border: 1px solid #4a555c !important;

        box-shadow:
        inset 0 1px rgba(255,255,255,.08),
                inset 0 -2px rgba(0,0,0,.55),
                0 2px 5px rgba(0,0,0,.45) !important;

                text-transform: uppercase !important;
                letter-spacing: .035em !important;
    }

    button:hover,
    [role="button"]:hover {
        color: #fff !important;

        border-color: ${C.red} !important;

        background:
        linear-gradient(
            180deg,
            #4a3434,
            #281516
        ) !important;

        box-shadow:
        0 0 9px rgba(255,59,48,.18),
                inset 0 1px rgba(255,255,255,.08) !important;
    }

    button:active,
    [role="button"]:active {
        background: #170a0a !important;
        box-shadow: inset 0 3px 7px rgba(0,0,0,.75) !important;
    }

    /*
     * Links
     */

    a {
        color: ${C.redBright} !important;
    }

    a:hover {
        color: ${C.yellow} !important;
        text-shadow: 0 0 6px rgba(255,204,51,.25) !important;
    }

    /*
     * Progress bars
     */

    [role="progressbar"] {
        background: #080b0d !important;
        border: 1px solid ${C.border} !important;
    }

    [role="progressbar"] > * {
        background:
        repeating-linear-gradient(
            135deg,
            ${C.redDark},
            ${C.redDark} 8px,
            ${C.red} 8px,
            ${C.red} 16px
        ) !important;

        box-shadow: 0 0 8px rgba(255,59,48,.3) !important;
    }

    /*
     * Alerts / status boxes
     */

    [class*="alert"],
    [class*="Alert"],
    [class*="notification"],
    [class*="Notification"] {
        background: #110809 !important;
        border: 1px solid ${C.redDark} !important;
        color: ${C.white} !important;
    }

    /*
     * Dialogs / modals
     */

    [role="dialog"] {
        background:
        linear-gradient(
            180deg,
            #151b1f,
            #080b0d
        ) !important;

        border: 1px solid ${C.red} !important;

        box-shadow:
        0 0 0 1px rgba(255,59,48,.12),
                0 12px 50px rgba(0,0,0,.85),
                0 0 30px rgba(255,0,0,.08) !important;
    }

    /*
     * Tooltips / menus
     */

    [role="menu"],
    [role="listbox"],
    [class*="menu"],
    [class*="Menu"],
    [class*="popover"],
    [class*="Popover"] {
        background: #0a0d10 !important;
        border: 1px solid ${C.border} !important;
        box-shadow: 0 10px 35px rgba(0,0,0,.8) !important;
    }

    /*
     * Scrollbars
     */

    ::-webkit-scrollbar {
        width: 9px !important;
        height: 9px !important;
    }

    ::-webkit-scrollbar-track {
        background: #050607 !important;
    }

    ::-webkit-scrollbar-thumb {
        background:
        linear-gradient(
            90deg,
            #4a0805,
            ${C.redDark}
        ) !important;

        border: 1px solid #66201c !important;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: ${C.red} !important;
    }
    `);


    /*
     * ------------------------------------------------------------
     * COMMAND CENTER HEADER
     * ------------------------------------------------------------
     */

    function createCommandHeader() {
        if (document.getElementById('cnc-command-header'))
            return;

        const header = document.createElement('div');
        header.id = 'cnc-command-header';

        header.innerHTML = `
        <div class="cnc-logo">
        <span class="cnc-logo-mark">◆</span>
        COMMAND & CONQUER
        </div>

        <div class="cnc-center">
        HIVEOS // COMMAND CENTER
        </div>

        <div class="cnc-status">
        <span class="cnc-light"></span>
        SYSTEM ONLINE
        </div>
        `;

        document.body.appendChild(header);
    }


    GM_addStyle(`
    #cnc-command-header {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;

    height: 30px !important;

    z-index: 2147482000 !important;

    display: flex !important;
    align-items: center !important;

    box-sizing: border-box !important;

    padding: 0 16px !important;

    background:
    linear-gradient(
        180deg,
        #20272b 0%,
        #101518 45%,
        #080b0d 100%
    ) !important;

    border-bottom: 2px solid #3e0805 !important;

    box-shadow:
    0 2px 10px rgba(0,0,0,.7),
                inset 0 1px rgba(255,255,255,.07) !important;

                font-family:
                "Roboto Mono",
                "Consolas",
                monospace !important;

                font-size: 11px !important;

                letter-spacing: .08em !important;

                pointer-events: none !important;
    }

    #cnc-command-header::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -4px;
    height: 2px;

    background:
    linear-gradient(
        90deg,
        transparent,
        ${C.red},
        transparent
    );

    opacity: .5;
    }

    .cnc-logo {
        color: ${C.redBright} !important;
        font-weight: bold !important;
        white-space: nowrap !important;
    }

    .cnc-logo-mark {
        color: ${C.yellow} !important;
        margin-right: 7px !important;
        text-shadow: 0 0 6px rgba(255,204,51,.5) !important;
    }

    .cnc-center {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);

        color: ${C.gray} !important;
        letter-spacing: .16em !important;
    }

    .cnc-status {
        margin-left: auto !important;
        color: ${C.gray} !important;
        white-space: nowrap !important;
    }

    .cnc-light {
        display: inline-block !important;

        width: 7px !important;
        height: 7px !important;

        margin-right: 6px !important;

        border-radius: 50% !important;

        background: ${C.red} !important;

        box-shadow:
        0 0 5px ${C.red},
        0 0 12px rgba(255,59,48,.6) !important;

        animation: cncPulse 1.8s infinite !important;
    }

    @keyframes cncPulse {
        0%, 100% {
            opacity: 1;
        }

        50% {
            opacity: .35;
        }
    }
    `);


    /*
     * ------------------------------------------------------------
     * LEFT COMMAND SIDEBAR
     * ------------------------------------------------------------
     *
     * This is an additional RA3-style command panel. It does not
     * replace HiveOS navigation; it visually sits beside it.
     */

    function createCommandSidebar() {
        if (document.getElementById('cnc-sidebar'))
            return;

        const side = document.createElement('aside');
        side.id = 'cnc-sidebar';

        side.innerHTML = `
        <div class="cnc-side-title">
        <span>◆</span>
        COMMAND
        </div>

        <div class="cnc-side-section">
        <div class="cnc-side-label">SYSTEM</div>

        <div class="cnc-side-item" data-target="Overview">
        <span>◈</span> OVERVIEW
        </div>

        <div class="cnc-side-item" data-target="Flight Sheet">
        <span>▣</span> FLIGHT SHEETS
        </div>

        <div class="cnc-side-item" data-target="Overclocking">
        <span>⚙</span> OVERCLOCKING
        </div>

        <div class="cnc-side-item" data-target="Autofan">
        <span>◉</span> AUTOFAN
        </div>
        </div>

        <div class="cnc-side-section">
        <div class="cnc-side-label">INTELLIGENCE</div>

        <div class="cnc-side-item" data-target="Tuning">
        <span>◇</span> TUNING
        </div>

        <div class="cnc-side-item" data-target="Stats">
        <span>▥</span> STATS
        </div>

        <div class="cnc-side-item" data-target="Activity">
        <span>◆</span> ACTIVITY
        </div>

        <div class="cnc-side-item" data-target="Settings">
        <span>⚙</span> SETTINGS
        </div>
        </div>

        <div class="cnc-side-footer">
        <div class="cnc-side-status">
        <span></span> NETWORK
        </div>

        <div class="cnc-side-status">
        <span></span> MINING
        </div>

        <div class="cnc-side-status">
        <span></span> CORE
        </div>
        </div>
        `;

        document.body.appendChild(side);

        side.querySelectorAll('.cnc-side-item').forEach(item => {
            item.addEventListener('click', () => {
                const target = item.dataset.target.toLowerCase();

                const elements = Array.from(
                    document.querySelectorAll('a, button, [role="button"]')
                );

                const match = elements.find(el => {
                    const text = (el.innerText || el.textContent || '')
                    .trim()
                    .toLowerCase();

                    return text === target ||
                    text.includes(target);
                });

                if (match) {
                    match.click();
                }
            });
        });
    }


    GM_addStyle(`
    #cnc-sidebar {
    position: fixed !important;

    top: 32px !important;
    left: 0 !important;
    bottom: 0 !important;

    width: 210px !important;

    z-index: 1500 !important;

    box-sizing: border-box !important;

    background:
    linear-gradient(
        90deg,
        #090b0d 0%,
        #11171a 65%,
        #080a0c 100%
    ) !important;

    border-right: 2px solid #47100c !important;

    box-shadow:
    5px 0 20px rgba(0,0,0,.55),
                inset -1px 0 rgba(255,255,255,.04) !important;

                padding-top: 8px !important;

                font-family:
                "Roboto Mono",
                "Consolas",
                monospace !important;
    }

    #cnc-sidebar::before {
    content: "";

    position: absolute;

    top: 0;
    right: -2px;

    width: 2px;
    height: 100%;

    background:
    linear-gradient(
        transparent,
        ${C.red},
        transparent
    );

    opacity: .35;
    }

    .cnc-side-title {
        height: 42px !important;

        display: flex !important;
        align-items: center !important;

        padding: 0 16px !important;

        box-sizing: border-box !important;

        color: ${C.redBright} !important;

        font-weight: bold !important;
        font-size: 14px !important;

        letter-spacing: .15em !important;

        border-bottom: 1px solid #35100d !important;

        background:
        linear-gradient(
            180deg,
            rgba(255,59,48,.09),
                        transparent
        ) !important;
    }

    .cnc-side-title span {
        color: ${C.yellow} !important;
        margin-right: 9px !important;
    }

    .cnc-side-section {
        padding: 12px 8px 4px !important;
    }

    .cnc-side-label {
        padding: 4px 8px !important;

        color: #68737a !important;

        font-size: 9px !important;
        letter-spacing: .18em !important;

        border-bottom: 1px solid #22292d !important;

        margin-bottom: 4px !important;
    }

    .cnc-side-item {
        height: 32px !important;

        display: flex !important;
        align-items: center !important;

        padding: 0 10px !important;

        margin: 2px 0 !important;

        box-sizing: border-box !important;

        color: #a8b0b4 !important;

        font-size: 10px !important;
        letter-spacing: .06em !important;

        border-left: 2px solid transparent !important;

        cursor: pointer !important;

        background:
        linear-gradient(
            90deg,
            rgba(255,255,255,.025),
                        transparent
        ) !important;

        transition:
        background .12s,
        color .12s,
        border-color .12s !important;
    }

    .cnc-side-item span {
        width: 24px !important;

        color: #6d777d !important;

        font-size: 12px !important;
    }

    .cnc-side-item:hover {
        color: #fff !important;

        border-left-color: ${C.red} !important;

        background:
        linear-gradient(
            90deg,
            rgba(255,59,48,.18),
                        rgba(255,59,48,.025)
        ) !important;
    }

    .cnc-side-item:hover span {
        color: ${C.yellow} !important;
    }

    .cnc-side-footer {
        position: absolute !important;

        left: 12px !important;
        right: 12px !important;
        bottom: 18px !important;

        border-top: 1px solid #272d31 !important;

        padding-top: 9px !important;
    }

    .cnc-side-status {
        height: 21px !important;

        color: #68737a !important;

        font-size: 8px !important;

        display: flex !important;
        align-items: center !important;

        letter-spacing: .12em !important;
    }

    .cnc-side-status span {
        width: 5px !important;
        height: 5px !important;

        display: inline-block !important;

        margin-right: 7px !important;

        border-radius: 50% !important;

        background: ${C.green} !important;

        box-shadow: 0 0 5px ${C.green} !important;
    }
    `);


    /*
     * ------------------------------------------------------------
     * PUSH HIVEOS CONTENT TO THE RIGHT
     * ------------------------------------------------------------
     */

    GM_addStyle(`
    /*
     * HiveOS has a relatively narrow centered content area.
     * Give the command center more room.
     */

    body {
        padding-top: 30px !important;
    }

    #root {
    min-height: calc(100vh - 30px) !important;
    }

    /*
     * Don't force every element; target the major application
     * containers instead.
     */

    body > div:not(#cnc-sidebar):not(#cnc-command-header) {
        position: relative !important;
    }

    @media (min-width: 1100px) {
        body > div:not(#cnc-sidebar):not(#cnc-command-header) {
            margin-left: 210px !important;
        }
    }

    @media (max-width: 1099px) {
        #cnc-sidebar {
        width: 165px !important;
        }

        body > div:not(#cnc-sidebar):not(#cnc-command-header) {
            margin-left: 165px !important;
        }
    }

    @media (max-width: 700px) {
        #cnc-sidebar {
        display: none !important;
        }

        body > div:not(#cnc-sidebar):not(#cnc-command-header) {
            margin-left: 0 !important;
        }
    }
    `);


    /*
     * ------------------------------------------------------------
     * HIVEOS NAVIGATION DETECTION
     * ------------------------------------------------------------
     *
     * Find the real HiveOS nav links by their text and give them
     * Red Alert styling regardless of their generated class name.
     */

    function styleHiveNavigation() {
        const elements = document.querySelectorAll(
            'a, button, [role="button"], [role="tab"]'
        );

        elements.forEach(el => {
            const text = (el.innerText || el.textContent || '')
            .trim()
            .replace(/\s+/g, ' ');

            if (!text)
                return;

            const known = [
                'Overview',
                'Flight Sheet',
                'Flight Sheets',
                'Overclocking',
                'Autofan',
                'Tuning',
                'Stats',
                'Activity',
                'Settings'
            ];

            if (!known.some(x =>
                text.toLowerCase() === x.toLowerCase()
            )) {
                return;
            }

            el.classList.add('cnc-hive-nav');

            if (
                el.getAttribute('aria-current') === 'page' ||
                el.getAttribute('aria-selected') === 'true'
            ) {
                el.classList.add('cnc-hive-nav-active');
            }
        });
    }


    GM_addStyle(`
    .cnc-hive-nav {
        position: relative !important;

        color: #aeb5b8 !important;

        border-bottom: 1px solid transparent !important;

        text-transform: uppercase !important;

        letter-spacing: .045em !important;
    }

    .cnc-hive-nav:hover {
        color: ${C.redBright} !important;

        background:
        linear-gradient(
            180deg,
            rgba(255,59,48,.12),
                        transparent
        ) !important;
    }

    .cnc-hive-nav-active,
    .cnc-hive-nav[aria-current="page"],
    .cnc-hive-nav[aria-selected="true"] {
        color: ${C.yellow} !important;

        border-bottom-color: ${C.red} !important;

        text-shadow:
        0 0 7px rgba(255,204,51,.25) !important;
    }
    `);


    /*
     * ------------------------------------------------------------
     * COMMAND CENTER DECORATION
     * ------------------------------------------------------------
     */

    function createCornerDecorations() {
        if (document.getElementById('cnc-corners'))
            return;

        const el = document.createElement('div');

        el.id = 'cnc-corners';

        el.innerHTML = `
        <div class="cnc-corner cnc-tl"></div>
        <div class="cnc-corner cnc-tr"></div>
        <div class="cnc-corner cnc-bl"></div>
        <div class="cnc-corner cnc-br"></div>
        `;

        document.body.appendChild(el);
    }

    GM_addStyle(`
    #cnc-corners {
    position: fixed !important;
    inset: 0 !important;

    pointer-events: none !important;

    z-index: 2147481000 !important;
    }

    .cnc-corner {
        position: absolute !important;

        width: 26px !important;
        height: 26px !important;
    }

    .cnc-tl {
        top: 36px;
        left: 216px;

        border-top: 2px solid ${C.red};
        border-left: 2px solid ${C.red};
    }

    .cnc-tr {
        top: 36px;
        right: 10px;

        border-top: 2px solid ${C.red};
        border-right: 2px solid ${C.red};
    }

    .cnc-bl {
        bottom: 10px;
        left: 216px;

        border-bottom: 2px solid ${C.red};
        border-left: 2px solid ${C.red};
    }

    .cnc-br {
        bottom: 10px;
        right: 10px;

        border-bottom: 2px solid ${C.red};
        border-right: 2px solid ${C.red};
    }
    `);


    /*
     * ------------------------------------------------------------
     * TITLE
     * ------------------------------------------------------------
     */

    function updateTitle() {
        if (!document.title.includes('COMMAND & CONQUER')) {
            document.title =
            'COMMAND & CONQUER // ' +
            document.title;
        }
    }


    /*
     * ------------------------------------------------------------
     * INITIALIZATION
     * ------------------------------------------------------------
     */

    function init() {
        createCommandHeader();
        createCommandSidebar();
        createCornerDecorations();
        styleHiveNavigation();
        updateTitle();

        console.log(
            '%c COMMAND & CONQUER // HIVEOS THEME ACTIVE ',
            'background:#120000;color:#ff504c;font-weight:bold;padding:5px 10px;border:1px solid #ff3b30;'
        );
    }


    /*
     * HiveOS is React-based, so parts of the interface are
     * recreated after navigation. Keep reapplying the styling.
     */

    const observer = new MutationObserver(() => {
        styleHiveNavigation();

        if (!document.getElementById('cnc-command-header'))
            createCommandHeader();

        if (!document.getElementById('cnc-sidebar'))
            createCommandSidebar();

        if (!document.getElementById('cnc-corners'))
            createCornerDecorations();
    });


    function start() {
        init();

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }


    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start, {
            once: true
        });
    } else {
        start();
    }

})();
