// ==UserScript==
// @name         HiveOS - Command & Conquer Red Alert 3 UI
// @namespace    https://github.com/NukelordPvP/hiveos-command-conquer-theme
// @version      3.4.0
// @description  Converts the HiveOS web interface into a Command & Conquer / Red Alert 3 command center with RA3 music and background.
// @author       Zack
// @match        https://the.hiveos.farm/*
// @match        https://*.hiveos.farm/*
// @run-at       document-start
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    /*
     * ============================================================
     * COMMAND & CONQUER / RED ALERT 3 ASSETS
     * ============================================================
     */

    const CNC_ASSET_BASE =
    'https://raw.githubusercontent.com/NukelordPvP/hiveos-command-conquer-theme/main/assets';

    const CNC_BACKGROUND =
    CNC_ASSET_BASE + '/images/11176891.jpg';

    const CNC_AUDIO_BASE =
    CNC_ASSET_BASE + '/audio/red-alert-3';


    /*
     * ============================================================
     * RED ALERT 3 SOUNDTRACK
     * ============================================================
     */

    const CNC_TRACKS = [
        '01 - Soviet March.flac',
        '02 - Hell March 3.flac',
        '03 - Grinder 2.flac',
        '04 - Hell March 1 - From First To Last Remix.flac',
        '05 - Russian Celebration.flac',
        '06 - The Might of the Empire.flac',
        '07 - The Motherland.flac',
        '08 - The Red Scare.flac',
        '09 - The Calm Before....flac',
        '10 - The European Storm.flac',
        '11 - For Mother Russia.flac',
        '12 - Russian Retreat.flac',
        '13 - Red Rock.flac',
        '14 - The Big Apple.flac',
        '15 - Fortifying Brighton.flac',
        '16 - The Red Storm Draws Near.flac',
        '17 - Shock and Awe.flac',
        '18 - Desertion.flac',
        '19 - How the West Was Won.flac',
        '20 - Mykonos.flac',
        '21 - The Battle for Mykonos.flac',
        '22 - Lying in Wait.flac',
        '23 - Enter the Shogun Executioner.flac',
        '24 - East Moves West.flac',
        '25 - The Rising Sun Is Setting.flac',
        '26 - For the Emperor.flac',
        '27 - The Empire Has Risen.flac',
        '28 - Eastern Mysteries.flac',
        '29 - Sayonara.flac',
        '30 - In the Belly of the Dragon.flac',
        '31 - The Sleeping Beast.flac',
        '32 - The Red Menace.flac',
        '33 - American Cowboys.flac',
        '34 - All Your Base Are Belong to Us.flac',
        '35 - The War MacHine Heads West.flac',
        '36 - Crisis in Cuba.flac',
        '37 - Floating Monstrosity.flac',
        '38 - The Chill of War.flac',
        '39 - Soviet Winter.flac',
        "40 - Take 'Em Out, Tanya!.flac",
        '41 - The Download.flac',
        '42 - Red Alert 3 Credits.flac',
        '43 - The Red March (Reprise).flac',
 '44 - Hell March 2 - From First To Last Remix.flac'
    ];


    /*
     * ============================================================
     * COLORS
     * ============================================================
     */

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
     * ============================================================
     * AUDIO STATE
     * ============================================================
     */

    let cncAudio = null;
    let cncTrackIndex = 0;
    let cncAudioStarted = false;


    /*
     * ============================================================
     * ASSET URL HELPER
     * ============================================================
     */

    function cncAssetURL(base, filename) {
        return base + '/' +
        filename
        .split('/')
        .map(part => encodeURIComponent(part))
        .join('/');
    }


    /*
     * ============================================================
     * GLOBAL HIVEOS COLOR OVERRIDES
     * ============================================================
     */

    GM_addStyle(`
    :root {
        --hos-color-gray-010: ${C.black2} !important;
        --hos-color-gray-008: #020303 !important;
        --hos-color-gray-013: #07090b !important;
        --hos-color-gray-015: #0a0d10 !important;
        --hos-color-gray-017: ${C.panel} !important;
        --hos-color-gray-021: ${C.panel2} !important;
        --hos-color-gray-024: ${C.steel} !important;

        --hos-color-red-005: #160000 !important;
        --hos-color-red-015: ${C.redDeep} !important;
        --hos-color-red-030: rgba(255,59,48,.30) !important;
        --hos-color-red-037: ${C.redDark} !important;
        --hos-color-red-060: ${C.red} !important;
        --hos-color-red-065: ${C.redBright} !important;
        --hos-color-red-070: #ff706a !important;
        --hos-color-red-080: #ff9a95 !important;
        --hos-color-red-090: #ffc4c1 !important;

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

        --hos-color-light-green-014: #14200f !important;
        --hos-color-light-green-020: #1d3214 !important;
        --hos-color-light-green-024: #29471b !important;
        --hos-color-light-green-050: ${C.green} !important;
        --hos-color-light-green-080: #b8e7ae !important;

        --hos-color-blue-015: #071b29 !important;
        --hos-color-blue-020: #0b2940 !important;
        --hos-color-blue-040: #14547c !important;
        --hos-color-blue-050: ${C.blue} !important;
        --hos-color-blue-060: #70c5ff !important;
        --hos-color-blue-070: #a8ddff !important;

        --hos-color-indigo-056: #334c70 !important;
        --hos-color-indigo-066: #5874a8 !important;
        --hos-color-purple-040: #51255c !important;
        --hos-color-purple-060: #b06ac0 !important;

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
     * ============================================================
     * HIVEOS BACKGROUND BLOCKER
     *
     * IMPORTANT:
     *
     * .faad792b22b16da7477d is an ADDITIONAL HiveOS background
     * element. It is NOT replacing the existing background
     * classes.
     *
     * All of these HiveOS background layers are blocked:
     *
     *   .faad792b22b16da7477d
     *   .e6e13ee71bc014dedcbe
     *   .c42f3a04e2d739bc22e3
     *   .c00b1e5cf79dafaebecc
     *   .ffaf0dcc275c3f9d0068
     *
     * Our RA3 background is created separately as:
     *
     *   #cnc-background
     * ============================================================
     */

    const HIVEOS_BACKGROUND_CLASSES = [
        // Additional HiveOS background layers
        'faad792b22b16da7477d',
        'ce8ac514111773b5c14f',
        'c44e0322715aa427eb2f',

        // Existing HiveOS background layers
        'e6e13ee71bc014dedcbe',
        'c42f3a04e2d739bc22e3',
        'c00b1e5cf79dafaebecc',
        'ffaf0dcc275c3f9d0068'
    ];


    function killHiveOSBackground() {
        for (const className of HIVEOS_BACKGROUND_CLASSES) {
            const elements =
            document.querySelectorAll('.' + className);

            elements.forEach(element => {
                element.style.setProperty(
                    'background',
                    'transparent',
                    'important'
                );

                element.style.setProperty(
                    'background-image',
                    'none',
                    'important'
                );

                element.style.setProperty(
                    'background-color',
                    'transparent',
                    'important'
                );

                element.style.setProperty(
                    'background-attachment',
                    'scroll',
                    'important'
                );

                element.style.setProperty(
                    'background-position',
                    'initial',
                    'important'
                );

                element.style.setProperty(
                    'background-size',
                    'auto',
                    'important'
                );
            });
        }
    }


    GM_addStyle(`
    /*
     * Current additional HiveOS background layer
     */
    .faad792b22b16da7477d,

    /*
     * Existing HiveOS background layers
     */
    .e6e13ee71bc014dedcbe,
    .c42f3a04e2d739bc22e3,
    .c00b1e5cf79dafaebecc,
    .ffaf0dcc275c3f9d0068 {
        background: transparent !important;
        background-image: none !important;
        background-color: transparent !important;
        background-attachment: scroll !important;
        background-position: initial !important;
        background-size: auto !important;
    }

    /*
     * Kill pseudo-element backgrounds as well.
     */
    .faad792b22b16da7477d::before,
    .faad792b22b16da7477d::after,

    .e6e13ee71bc014dedcbe::before,
    .e6e13ee71bc014dedcbe::after,

    .c42f3a04e2d739bc22e3::before,
    .c42f3a04e2d739bc22e3::after,

    .c00b1e5cf79dafaebecc::before,
    .c00b1e5cf79dafaebecc::after,

    .ffaf0dcc275c3f9d0068::before,
    .ffaf0dcc275c3f9d0068::after {
        background: transparent !important;
        background-image: none !important;
        background-color: transparent !important;
    }
    `);


    /*
     * ============================================================
     * RED ALERT 3 BACKGROUND
     * ============================================================
     */

    function createCNCBackground() {
        let bg =
        document.getElementById('cnc-background');

        if (!bg) {
            bg = document.createElement('div');

            bg.id = 'cnc-background';

            if (document.body) {
                document.body.insertBefore(
                    bg,
                    document.body.firstChild
                );
            }
        }
    }


    GM_addStyle(`
    #cnc-background {
    position: fixed !important;

    inset: 0 !important;

    width: 100vw !important;
    height: 100vh !important;

    background-image:
    linear-gradient(
        rgba(0,0,0,.48),
                    rgba(0,0,0,.72)
    ),
    url("${CNC_BACKGROUND}") !important;

    background-size: cover !important;

    background-position: center center !important;

    background-repeat: no-repeat !important;

    background-color: #050607 !important;

    z-index: 0 !important;

    pointer-events: none !important;
    }
    `);


    /*
     * ============================================================
     * MAIN COMMAND CENTER CSS
     * ============================================================
     */

    GM_addStyle(`
    html,
    body {
        background-color: ${C.black} !important;
        background-image: none !important;
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

        padding-top: 30px !important;
    }

    #root,
    #app,
    main,
    [role="main"] {
        background-color: transparent !important;
        background-image: none !important;
        color: ${C.white} !important;
    }

    #root,
    #app {
    min-height: calc(100vh - 30px) !important;
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

    * {
        border-radius: 0 !important;
    }

    div,
    section,
    article,
    aside,
    nav {
        scrollbar-color:
        ${C.redDark}
        ${C.black2};
    }

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

        border-bottom:
        1px solid ${C.redDark} !important;

        text-transform: uppercase !important;

        letter-spacing: .05em !important;
    }

    td {
        background: transparent !important;

        color: ${C.white} !important;

        border-bottom:
        1px solid rgba(255,255,255,.045) !important;
    }

    tr:hover td {
        background:
        rgba(255,59,48,.08) !important;
    }

    input,
    textarea,
    select {
        background: #080b0d !important;

        color: ${C.white} !important;

        border:
        1px solid ${C.border} !important;

        box-shadow:
        inset 0 2px 5px rgba(0,0,0,.7) !important;
    }

    input:focus,
    textarea:focus,
    select:focus {
        border-color: ${C.red} !important;

        outline:
        1px solid rgba(255,59,48,.25) !important;

        box-shadow:
        0 0 8px rgba(255,59,48,.15),
                inset 0 2px 5px rgba(0,0,0,.7) !important;
    }

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

        border:
        1px solid #4a555c !important;

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

        box-shadow:
        inset 0 3px 7px rgba(0,0,0,.75) !important;
    }

    a {
        color: ${C.redBright} !important;
    }

    a:hover {
        color: ${C.yellow} !important;

        text-shadow:
        0 0 6px rgba(255,204,51,.25) !important;
    }

    [role="progressbar"] {
        background: #080b0d !important;

        border:
        1px solid ${C.border} !important;
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

        box-shadow:
        0 0 8px rgba(255,59,48,.3) !important;
    }

    [class*="alert"],
    [class*="Alert"],
    [class*="notification"],
    [class*="Notification"] {
        background: #110809 !important;

        border:
        1px solid ${C.redDark} !important;

        color: ${C.white} !important;
    }

    [role="dialog"] {
        background:
        linear-gradient(
            180deg,
            #151b1f,
            #080b0d
        ) !important;

        border:
        1px solid ${C.red} !important;

        box-shadow:
        0 0 0 1px rgba(255,59,48,.12),
                0 12px 50px rgba(0,0,0,.85),
                0 0 30px rgba(255,0,0,.08) !important;
    }

    [role="menu"],
    [role="listbox"],
    [class*="menu"],
    [class*="Menu"],
    [class*="popover"],
    [class*="Popover"] {
        background: #0a0d10 !important;

        border:
        1px solid ${C.border} !important;

        box-shadow:
        0 10px 35px rgba(0,0,0,.8) !important;
    }
    `);


    /*
     * ============================================================
     * COMMAND CENTER HEADER
     * ============================================================
     */

    function createCommandHeader() {
        if (
            document.getElementById(
                'cnc-command-header'
            )
        ) {
            return;
        }

        const header =
        document.createElement('div');

        header.id =
        'cnc-command-header';

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

    border-bottom:
    2px solid #3e0805 !important;

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

        text-shadow:
        0 0 6px rgba(255,204,51,.5) !important;
    }

    .cnc-center {
        position: absolute;

        left: 50%;

        transform:
        translateX(-50%);

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

        animation:
        cncPulse 1.8s infinite !important;
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
     * ============================================================
     * LEFT COMMAND SIDEBAR
     * ============================================================
     */

    function createCommandSidebar() {
        if (
            document.getElementById(
                'cnc-sidebar'
            )
        ) {
            return;
        }

        const side =
        document.createElement('aside');

        side.id =
        'cnc-sidebar';

        side.innerHTML = `
        <div class="cnc-side-title">
        <span>◆</span>
        COMMAND
        </div>

        <div class="cnc-side-section">

        <div class="cnc-side-label">
        SYSTEM
        </div>

        <div class="cnc-side-item" data-target="Overview">
        <span>◈</span>
        OVERVIEW
        </div>

        <div class="cnc-side-item" data-target="Flight Sheet">
        <span>▣</span>
        FLIGHT SHEETS
        </div>

        <div class="cnc-side-item" data-target="Overclocking">
        <span>⚙</span>
        OVERCLOCKING
        </div>

        <div class="cnc-side-item" data-target="Autofan">
        <span>◉</span>
        AUTOFAN
        </div>

        </div>

        <div class="cnc-side-section">

        <div class="cnc-side-label">
        INTELLIGENCE
        </div>

        <div class="cnc-side-item" data-target="Tuning">
        <span>◇</span>
        TUNING
        </div>

        <div class="cnc-side-item" data-target="Stats">
        <span>▥</span>
        STATS
        </div>

        <div class="cnc-side-item" data-target="Activity">
        <span>◆</span>
        ACTIVITY
        </div>

        <div class="cnc-side-item" data-target="Settings">
        <span>⚙</span>
        SETTINGS
        </div>

        </div>

        <div class="cnc-side-footer">

        <div class="cnc-side-status">
        <span></span>
        NETWORK
        </div>

        <div class="cnc-side-status">
        <span></span>
        MINING
        </div>

        <div class="cnc-side-status">
        <span></span>
        CORE
        </div>

        </div>
        `;

        document.body.appendChild(side);

        side.querySelectorAll(
            '.cnc-side-item'
        ).forEach(item => {
            item.addEventListener(
                'click',
                () => {
                    const target =
                    item.dataset.target
                    .toLowerCase();

                    const elements =
                    Array.from(
                        document.querySelectorAll(
                            'a, button, [role="button"]'
                        )
                    );

                    const match =
                    elements.find(el => {
                        const text =
                        (
                            el.innerText ||
                            el.textContent ||
                            ''
                        )
                        .trim()
                        .toLowerCase();

                        return (
                            text === target ||
                            text.includes(target)
                        );
                    });

                    if (match) {
                        match.click();
                    }
                }
            );
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

    border-right:
    2px solid #47100c !important;

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

        border-bottom:
        1px solid #35100d !important;

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

        border-bottom:
        1px solid #22292d !important;

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

        border-left:
        2px solid transparent !important;

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

        border-left-color:
        ${C.red} !important;

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

        border-top:
        1px solid #272d31 !important;

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

        box-shadow:
        0 0 5px ${C.green} !important;
    }
    `);


    /*
     * ============================================================
     * HIVEOS CONTENT POSITION
     * ============================================================
     */

    GM_addStyle(`
    body > div:not(#cnc-sidebar):not(#cnc-command-header):not(#cnc-background) {
        position: relative !important;
    }

    @media (min-width: 1100px) {
        body > div:not(#cnc-sidebar):not(#cnc-command-header):not(#cnc-background) {
            margin-left: 210px !important;
        }
    }

    @media (max-width: 1099px) {
        #cnc-sidebar {
        width: 165px !important;
        }

        body > div:not(#cnc-sidebar):not(#cnc-command-header):not(#cnc-background) {
            margin-left: 165px !important;
        }
    }

    @media (max-width: 700px) {
        #cnc-sidebar {
        display: none !important;
        }

        body > div:not(#cnc-sidebar):not(#cnc-command-header):not(#cnc-background) {
            margin-left: 0 !important;
        }
    }
    `);


    /*
     * ============================================================
     * HIVEOS NAVIGATION DETECTION
     * ============================================================
     */

    function styleHiveNavigation() {
        const elements =
        document.querySelectorAll(
            'a, button, [role="button"], [role="tab"]'
        );

        elements.forEach(el => {
            const text =
            (
                el.innerText ||
                el.textContent ||
                ''
            )
            .trim()
            .replace(/\s+/g, ' ');

            if (!text) {
                return;
            }

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

            if (
                !known.some(x =>
                text.toLowerCase() ===
                x.toLowerCase()
                )
            ) {
                return;
            }

            el.classList.add(
                'cnc-hive-nav'
            );

            if (
                el.getAttribute(
                    'aria-current'
                ) === 'page' ||
                el.getAttribute(
                    'aria-selected'
                ) === 'true'
            ) {
                el.classList.add(
                    'cnc-hive-nav-active'
                );
            }
        });
    }


    GM_addStyle(`
    .cnc-hive-nav {
        position: relative !important;

        color: #aeb5b8 !important;

        border-bottom:
        1px solid transparent !important;

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

        border-bottom-color:
        ${C.red} !important;

        text-shadow:
        0 0 7px rgba(255,204,51,.25) !important;
    }
    `);


    /*
     * ============================================================
     * CORNER DECORATIONS
     * ============================================================
     */

    function createCornerDecorations() {
        if (
            document.getElementById(
                'cnc-corners'
            )
        ) {
            return;
        }

        const el =
        document.createElement('div');

        el.id =
        'cnc-corners';

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

        border-top:
        2px solid ${C.red};

        border-left:
        2px solid ${C.red};
    }

    .cnc-tr {
        top: 36px;
        right: 10px;

        border-top:
        2px solid ${C.red};

        border-right:
        2px solid ${C.red};
    }

    .cnc-bl {
        bottom: 10px;
        left: 216px;

        border-bottom:
        2px solid ${C.red};

        border-left:
        2px solid ${C.red};
    }

    .cnc-br {
        bottom: 10px;
        right: 10px;

        border-bottom:
        2px solid ${C.red};

        border-right:
        2px solid ${C.red};
    }
    `);


    /*
     * ============================================================
     * TITLE
     * ============================================================
     */

    function updateTitle() {
        if (
            !document.title.includes(
                'COMMAND & CONQUER'
            )
        ) {
            document.title =
            'COMMAND & CONQUER // ' +
            document.title;
        }
    }


    /*
     * ============================================================
     * AUDIO
     * ============================================================
     */

    function createCNCAudio() {
        if (cncAudio) {
            return;
        }

        cncAudio =
        document.createElement('audio');

        cncAudio.id =
        'cnc-ra3-music';

        cncAudio.preload =
        'auto';

        cncAudio.volume =
        0.35;

        cncAudio.loop =
        false;

        cncAudio.style.display =
        'none';

        document.body.appendChild(
            cncAudio
        );

        cncAudio.addEventListener(
            'ended',
            () => {
                cncTrackIndex++;

                if (
                    cncTrackIndex >=
                    CNC_TRACKS.length
                ) {
                    cncTrackIndex = 0;
                }

                playCNCTrack();
            }
        );

        cncAudio.addEventListener(
            'error',
            () => {
                console.warn(
                    '[C&C] Failed to load:',
                    CNC_TRACKS[cncTrackIndex]
                );

                cncTrackIndex++;

                if (
                    cncTrackIndex >=
                    CNC_TRACKS.length
                ) {
                    cncTrackIndex = 0;
                }

                setTimeout(
                    playCNCTrack,
                    500
                );
            }
        );
    }


    function playCNCTrack() {
        if (!cncAudio) {
            return;
        }

        const track =
        CNC_TRACKS[cncTrackIndex];

        const url =
        cncAssetURL(
            CNC_AUDIO_BASE,
            track
        );

        console.log(
            '%c C&C RA3 MUSIC ',
            'background:#350000;color:#ffcc33;font-weight:bold;padding:3px 6px;',
            track
        );

        cncAudio.src =
        url;

        cncAudio.load();

        const promise =
        cncAudio.play();

        if (promise) {
            promise.catch(
                error => {
                    console.warn(
                        '[C&C] Browser blocked audio until user interaction.',
                        error
                    );
                }
            );
        }
    }


    function activateCNCAudio() {
        if (cncAudioStarted) {
            return;
        }

        cncAudioStarted =
        true;

        createCNCAudio();

        playCNCTrack();

        document.removeEventListener(
            'click',
            activateCNCAudio,
            true
        );

        document.removeEventListener(
            'keydown',
            activateCNCAudio,
            true
        );

        console.log(
            '%c COMMAND & CONQUER // AUDIO ONLINE ',
            'background:#350000;color:#ffcc33;font-weight:bold;padding:5px 10px;'
        );
    }


    function setupCNCAudio() {
        createCNCAudio();

        document.addEventListener(
            'click',
            activateCNCAudio,
            true
        );

        document.addEventListener(
            'keydown',
            activateCNCAudio,
            true
        );
    }


    /*
     * ============================================================
     * INITIALIZATION
     * ============================================================
     */

    function init() {
        createCNCBackground();

        killHiveOSBackground();

        setupCNCAudio();

        createCommandHeader();

        createCommandSidebar();

        createCornerDecorations();

        styleHiveNavigation();

        updateTitle();
    }


    /*
     * ============================================================
     * REACT / HIVEOS MUTATION HANDLING
     * ============================================================
     *
     * Watches both child additions and style/class changes.
     *
     * This is especially important for:
     *
     *     .faad792b22b16da7477d
     *
     * because HiveOS can recreate or modify the additional
     * background layer after the page has already loaded.
     * ============================================================
     */

    let mutationQueued = false;


    function handleMutations() {
        if (mutationQueued) {
            return;
        }

        mutationQueued = true;

        requestAnimationFrame(() => {
            mutationQueued = false;

            killHiveOSBackground();

            styleHiveNavigation();

            if (
                !document.getElementById(
                    'cnc-command-header'
                )
            ) {
                createCommandHeader();
            }

            if (
                !document.getElementById(
                    'cnc-sidebar'
                )
            ) {
                createCommandSidebar();
            }

            if (
                !document.getElementById(
                    'cnc-corners'
                )
            ) {
                createCornerDecorations();
            }

            if (
                !document.getElementById(
                    'cnc-background'
                )
            ) {
                createCNCBackground();
            }
        });
    }


    const observer =
    new MutationObserver(
        handleMutations
    );


    /*
     * ============================================================
     * START
     * ============================================================
     */

    function start() {
        init();

        observer.observe(
            document.documentElement,
            {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: [
                    'class',
                    'style'
                ]
            }
        );

        /*
         * Extra periodic check.
         *
         * React/CSS-in-JS can occasionally restore a background
         * without producing a mutation that we can reliably use.
         */
        setInterval(
            killHiveOSBackground,
            1000
        );
    }


    if (
        document.readyState ===
        'loading'
    ) {
        document.addEventListener(
            'DOMContentLoaded',
            start,
            {
                once: true
            }
        );
    } else {
        start();
    }

})();
