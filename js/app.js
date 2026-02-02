// =====================================================
// 🔥 FIREBASE CONFIGURATION
// =====================================================
const firebaseConfig = {
    apiKey: "AIzaSyDtPhY9THpLXwSJo5kKzAZriqlS79vSqnk",
    authDomain: "currency-exchange-pos.firebaseapp.com",
    projectId: "currency-exchange-pos",
    storageBucket: "currency-exchange-pos.firebasestorage.app",
    messagingSenderId: "855437301179",
    appId: "1:855437301179:web:82dc1aee8f620229c0609e"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
// ===== THEME TOGGLE SYSTEM =====

class ThemeManager {
    constructor() {
        this.theme = this.getStoredTheme() || this.getSystemTheme();
        this.init();
    }

    init() {
        this.applyTheme(this.theme);
        this.bindEvents();
        this.watchSystemTheme();
    }

    getStoredTheme() {
        return localStorage.getItem('theme');
    }

    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    applyTheme(theme) {
        // Add transition class for smooth theme change
        document.body.classList.add('theme-transitioning');

        document.documentElement.setAttribute('data-theme', theme);
        document.body.classList.remove('light-mode', 'dark-mode');
        document.body.classList.add(`${theme}-mode`);

        localStorage.setItem('theme', theme);
        // =====================================================
        // DEFAULT CURRENCIES DATA
        // =====================================================
        const defaultCurrencies = {
            CAD: { name: 'Canadian Dollar', flag: 'ca', rate: 1.0 },
            USD: { name: 'US Dollar', flag: 'us', rate: 1.3605 },
            EUR: { name: 'Euro', flag: 'eu', rate: 1.5320 },
            GBP: { name: 'British Pound', flag: 'gb', rate: 1.7285 },
            AUD: { name: 'Australian Dollar', flag: 'au', rate: 0.8850 },
            JPY: { name: 'Japanese Yen', flag: 'jp', rate: 0.0091 },
            CHF: { name: 'Swiss Franc', flag: 'ch', rate: 1.5340 },
            CNY: { name: 'Chinese Yuan', flag: 'cn', rate: 0.1875 },
            INR: { name: 'Indian Rupee', flag: 'in', rate: 0.0163 },
            MXN: { name: 'Mexican Peso', flag: 'mx', rate: 0.0785 },
            AED: { name: 'UAE Dirham', flag: 'ae', rate: 0.3704 },
            SAR: { name: 'Saudi Riyal', flag: 'sa', rate: 0.3627 },
            HKD: { name: 'Hong Kong Dollar', flag: 'hk', rate: 0.1745 },
            SGD: { name: 'Singapore Dollar', flag: 'sg', rate: 1.0215 },
            NZD: { name: 'New Zealand Dollar', flag: 'nz', rate: 0.8125 },
            KRW: { name: 'South Korean Won', flag: 'kr', rate: 0.00099 },
            ZAR: { name: 'South African Rand', flag: 'za', rate: 0.0745 },
            BRL: { name: 'Brazilian Real', flag: 'br', rate: 0.2385 },
            TRY: { name: 'Turkish Lira', flag: 'tr', rate: 0.0395 },
            SEK: { name: 'Swedish Krona', flag: 'se', rate: 0.1265 },
            NOK: { name: 'Norwegian Krone', flag: 'no', rate: 0.1245 },
            DKK: { name: 'Danish Krone', flag: 'dk', rate: 0.2055 },
            PLN: { name: 'Polish Zloty', flag: 'pl', rate: 0.3425 },
            THB: { name: 'Thai Baht', flag: 'th', rate: 0.0395 },
            MYR: { name: 'Malaysian Ringgit', flag: 'my', rate: 0.3045 },
            IDR: { name: 'Indonesian Rupiah', flag: 'id', rate: 0.000085 },
            PHP: { name: 'Philippine Peso', flag: 'ph', rate: 0.0238 },
            CZK: { name: 'Czech Koruna', flag: 'cz', rate: 0.0585 },
            HUF: { name: 'Hungarian Forint', flag: 'hu', rate: 0.00365 },
            ILS: { name: 'Israeli Shekel', flag: 'il', rate: 0.3685 },
            CLP: { name: 'Chilean Peso', flag: 'cl', rate: 0.00142 },
            COP: { name: 'Colombian Peso', flag: 'co', rate: 0.00032 },
            ARS: { name: 'Argentine Peso', flag: 'ar', rate: 0.00115 },
            EGP: { name: 'Egyptian Pound', flag: 'eg', rate: 0.0275 },
            PKR: { name: 'Pakistani Rupee', flag: 'pk', rate: 0.0048 },
            VND: { name: 'Vietnamese Dong', flag: 'vn', rate: 0.000054 },
            NGN: { name: 'Nigerian Naira', flag: 'ng', rate: 0.00085 },
            BDT: { name: 'Bangladeshi Taka', flag: 'bd', rate: 0.0124 },
            UAH: { name: 'Ukrainian Hryvnia', flag: 'ua', rate: 0.0328 },
            RON: { name: 'Romanian Leu', flag: 'ro', rate: 0.2945 },
            PEN: { name: 'Peruvian Sol', flag: 'pe', rate: 0.3625 },
            KES: { name: 'Kenyan Shilling', flag: 'ke', rate: 0.0105 },
            QAR: { name: 'Qatari Riyal', flag: 'qa', rate: 0.3735 },
            KWD: { name: 'Kuwaiti Dinar', flag: 'kw', rate: 4.4250 },
            BHD: { name: 'Bahraini Dinar', flag: 'bh', rate: 3.6125 },
            OMR: { name: 'Omani Rial', flag: 'om', rate: 3.5350 },
            JOD: { name: 'Jordanian Dinar', flag: 'jo', rate: 1.9185 },
            LKR: { name: 'Sri Lankan Rupee', flag: 'lk', rate: 0.0046 },
            MAD: { name: 'Moroccan Dirham', flag: 'ma', rate: 0.1365 },
            TWD: { name: 'Taiwan Dollar', flag: 'tw', rate: 0.0425 },
            RUB: { name: 'Russian Ruble', flag: 'ru', rate: 0.0148 }
        };

        // App State
        let rates = {}, currencies = {}, marginConfig = {};
        let fromCurr = 'USD', toCurr = 'CAD', configCurrency = 'USD';
        let transactions = [], inventory = {}, todayStats = { count: 0, profit: 0 }, lastCalc = {};
        let activePickerType = null, logicExpanded = false, sidePanelOpen = false;

        // NEW: Custom rate state
        let customRate = null; // When user manually edits the rate
        let isCustomRateActive = false;
        let manualAmountEdit = null; // Track which amount field was manually edited

        const dropdown = document.getElementById('currencyDropdown');
        const dropdownSearch = document.getElementById('dropdownSearch');
        const dropdownList = document.getElementById('dropdownList');

        // =====================================================
        // FIREBASE DATABASE SERVICE
        // =====================================================
        const FirebaseDB = {
            async initialize() {
                updateLoadingText('Checking database...');
                const snapshot = await db.collection('rates').limit(1).get();
                if (snapshot.empty) { updateLoadingText('Setting up initial data...'); await this.setupInitialData(); }
                return true;
            },
            async setupInitialData() {
                const batch = db.batch();
                for (const [code, data] of Object.entries(defaultCurrencies)) {
                    batch.set(db.collection('rates').doc(code), { code, name: data.name, flag: data.flag, rate: data.rate, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
                    if (code !== 'CAD') {
                        const isFixed = code === 'USD';
                        batch.set(db.collection('margins').doc(code), { type: isFixed ? 'fixed' : 'percentage', tiers: [{ min: 0, max: 500, margin: isFixed ? 0.02 : 2.0 }, { min: 500, max: 1000, margin: isFixed ? 0.015 : 1.5 }, { min: 1000, max: 5000, margin: isFixed ? 0.01 : 1.0 }, { min: 5000, max: null, margin: isFixed ? 0.005 : 0.5 }], updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
                    }
                    batch.set(db.collection('inventory').doc(code), { in: 0, out: 0, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
                }
                await batch.commit();
            },
            async loadRates() {
                const snapshot = await db.collection('rates').get();
                const r = {}, c = {};
                snapshot.forEach(doc => { const d = doc.data(); r[doc.id] = d.rate; c[doc.id] = { name: d.name, flag: d.flag }; });
                return { rates: r, currencies: c };
            },
            async saveRates(ratesToSave) {
                const batch = db.batch();
                for (const [code, rate] of Object.entries(ratesToSave)) { if (code !== 'CAD') batch.update(db.collection('rates').doc(code), { rate, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }); }
                await batch.commit();
            },
            async loadMargins() { const snapshot = await db.collection('margins').get(); const m = {}; snapshot.forEach(doc => { m[doc.id] = doc.data(); }); return m; },
            async saveMargin(code, config) { await db.collection('margins').doc(code).set({ ...config, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }); },
            async createTransaction(tx) {
                const transactionId = `TXN-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`.toUpperCase();
                await db.collection('transactions').add({ ...tx, transactionId, status: 'completed', createdAt: firebase.firestore.FieldValue.serverTimestamp() });
                await this.updateInventory(tx.fromCurrency, tx.fromAmount, 'in');
                await this.updateInventory(tx.toCurrency, tx.toAmount, 'out');
                await this.updateDailyStats(tx.profit);
                return transactionId;
            },
            async updateInventory(code, amount, type) {
                const ref = db.collection('inventory').doc(code);
                await db.runTransaction(async t => { const doc = await t.get(ref); if (doc.exists) t.update(ref, { [type]: (doc.data()[type] || 0) + amount, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }); else t.set(ref, { in: type === 'in' ? amount : 0, out: type === 'out' ? amount : 0, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }); });
            },
            async updateDailyStats(profit) {
                const today = new Date().toISOString().split('T')[0];
                const ref = db.collection('dailyStats').doc(today);
                await db.runTransaction(async t => { const doc = await t.get(ref); if (doc.exists) t.update(ref, { count: (doc.data().count || 0) + 1, profit: (doc.data().profit || 0) + profit, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }); else t.set(ref, { count: 1, profit, date: today, createdAt: firebase.firestore.FieldValue.serverTimestamp() }); });
            },
            async getTodayStats() { const doc = await db.collection('dailyStats').doc(new Date().toISOString().split('T')[0]).get(); return doc.exists ? doc.data() : { count: 0, profit: 0 }; },
            async getTodayTransactions() { const today = new Date(); today.setHours(0, 0, 0, 0); const snapshot = await db.collection('transactions').where('createdAt', '>=', today).orderBy('createdAt', 'desc').limit(50).get(); return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); },
            async getInventory() { const snapshot = await db.collection('inventory').get(); const inv = {}; snapshot.forEach(doc => { inv[doc.id] = doc.data(); }); return inv; },
            subscribeToStats(cb) { return db.collection('dailyStats').doc(new Date().toISOString().split('T')[0]).onSnapshot(doc => cb(doc.exists ? doc.data() : { count: 0, profit: 0 })); },
            subscribeToTransactions(cb) { const today = new Date(); today.setHours(0, 0, 0, 0); return db.collection('transactions').where('createdAt', '>=', today).orderBy('createdAt', 'desc').limit(20).onSnapshot(snapshot => cb(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))); }
        };

        // =====================================================
        // UI HELPERS
        // =====================================================
        function updateLoadingText(t) { document.getElementById('loadingSubtext').textContent = t; }
        function hideLoading() { document.getElementById('loadingOverlay').classList.add('hidden'); }
        function showConnectionStatus(s, t) { const el = document.getElementById('connectionStatus'); el.className = 'connection-status show ' + s; document.getElementById('connectionText').textContent = t; setTimeout(() => el.classList.remove('show'), 3000); }
        function updateDbIndicator(c) { const el = document.getElementById('dbIndicator'); el.innerHTML = c ? '<span>🔥</span><span>Firebase Connected</span>' : '<span>⚠️</span><span>Offline</span>'; el.classList.toggle('error', !c); }
        function notify(msg, type) { const n = document.createElement('div'); n.style.cssText = `position:fixed;top:60px;right:20px;padding:10px 16px;background:${type === 'success' ? 'var(--success)' : 'var(--danger)'};color:white;border-radius:var(--radius-sm);font-weight:600;font-size:12px;box-shadow:var(--shadow-lg);z-index:9999;animation:slideIn 0.3s ease;`; n.textContent = msg; document.body.appendChild(n); setTimeout(() => { n.style.animation = 'slideOut 0.3s ease'; setTimeout(() => n.remove(), 300); }, 2700); }
        function toggleLogicBox() { logicExpanded = !logicExpanded; document.getElementById('logicBox').classList.toggle('expanded', logicExpanded); document.getElementById('logicToggleText').textContent = logicExpanded ? 'Hide Details' : 'Show Details'; }
        function toggleSidePanel() { sidePanelOpen = !sidePanelOpen; document.getElementById('sidePanel').classList.toggle('open', sidePanelOpen); document.getElementById('panelToggle').classList.toggle('open', sidePanelOpen); }
        function showPanelTab(tab, btn) { document.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active')); btn.classList.add('active'); document.getElementById('panelStats').style.display = tab === 'stats' ? 'block' : 'none'; document.getElementById('panelInventory').style.display = tab === 'inventory' ? 'block' : 'none'; document.getElementById('panelHistory').style.display = tab === 'history' ? 'block' : 'none'; }
        function updateClock() { document.getElementById('navTime').textContent = new Date().toLocaleTimeString(); document.getElementById('todayDate').textContent = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }); }

        // =====================================================
        // CALCULATIONS - UPDATED WITH CUSTOM RATE SUPPORT
        // =====================================================
        function getMarginTier(currency, amount) {
            const cfg = marginConfig[currency];
            if (!cfg || !cfg.tiers) return null;
            for (let t of cfg.tiers) {
                const max = t.max === null ? Infinity : t.max;
                if (amount >= t.min && amount < max) return t;
            }
            return cfg.tiers[cfg.tiers.length - 1];
        }

        function applyMargin(baseRate, currency, amount, isBuying) {
            const cfg = marginConfig[currency];
            if (!cfg) return baseRate;
            const tier = getMarginTier(currency, amount);
            if (!tier) return baseRate;
            const margin = tier.margin;
            return isBuying ? (cfg.type === 'fixed' ? baseRate - margin : baseRate * (1 - margin / 100)) : (cfg.type === 'fixed' ? baseRate + margin : baseRate * (1 + margin / 100));
        }

        function getCalculatedRate() {
            const fromRate = rates[fromCurr] || 1, toRate = rates[toCurr] || 1;
            const fromAmt = parseFloat(document.getElementById('fromAmount').value) || 0;

            if (fromCurr === 'CAD' && toCurr === 'CAD') return 1;

            let foreignCurr, foreignAmt, isBuying;

            if (toCurr === 'CAD') {
                isBuying = true;
                foreignCurr = fromCurr;
                foreignAmt = fromAmt;
                return applyMargin(fromRate, foreignCurr, foreignAmt, true);
            } else if (fromCurr === 'CAD') {
                isBuying = false;
                foreignCurr = toCurr;
                const marketRate = 1 / toRate;
                foreignAmt = fromAmt * marketRate;
                const adjusted = applyMargin(toRate, foreignCurr, foreignAmt, false);
                return 1 / adjusted;
            } else {
                isBuying = true;
                foreignCurr = fromCurr;
                foreignAmt = fromAmt;
                const adjusted = applyMargin(fromRate, foreignCurr, foreignAmt, true);
                return adjusted / toRate;
            }
        }

        function calculate(source = 'from') {
            const fromAmtEl = document.getElementById('fromAmount');
            const toAmtEl = document.getElementById('toAmount');
            const fromAmt = parseFloat(fromAmtEl.value) || 0;
            const toAmt = parseFloat(toAmtEl.value) || 0;
            const fromRate = rates[fromCurr] || 1, toRate = rates[toCurr] || 1;

            // Determine the exchange rate to use
            let clientRate;
            if (isCustomRateActive && customRate !== null) {
                clientRate = customRate;
            } else {
                clientRate = getCalculatedRate();
            }

            // Calculate based on source
            if (source === 'from') {
                const result = fromAmt * clientRate;
                toAmtEl.value = result.toFixed(2);
                toAmtEl.classList.remove('manual-edit');
            } else if (source === 'to') {
                const result = toAmt / clientRate;
                fromAmtEl.value = result.toFixed(2);
                fromAmtEl.classList.remove('manual-edit');
            } else if (source === 'rate') {
                // Rate was changed, recalculate to amount
                const result = fromAmt * clientRate;
                toAmtEl.value = result.toFixed(2);
            }

            // Update rate display inputs
            updateRateInputs(clientRate);

            // Calculate profit
            const actualFrom = parseFloat(fromAmtEl.value) || 0;
            const actualTo = parseFloat(toAmtEl.value) || 0;
            let profit = 0;

            if (toCurr === 'CAD') {
                profit = (actualFrom * fromRate) - actualTo;
            } else if (fromCurr === 'CAD') {
                profit = actualFrom - (actualTo * toRate);
            } else {
                profit = (actualFrom * fromRate) - (actualTo * toRate);
            }

            // Determine margin info for display
            let foreignCurr = fromCurr === 'CAD' ? toCurr : fromCurr;
            let foreignAmt = fromCurr === 'CAD' ? actualTo : actualFrom;
            let isBuying = toCurr === 'CAD' || (fromCurr !== 'CAD' && toCurr !== 'CAD');
            let marginType = marginConfig[foreignCurr]?.type || 'percentage';
            let tier = getMarginTier(foreignCurr, foreignAmt);
            let marginVal = tier?.margin || 0;
            let marketRate = (fromRate || 1) / (toRate || 1);

            lastCalc = { isBuying, foreignCurr, foreignAmt, marketRate, clientRate, marginVal, marginType, profit };
            updateUI(marketRate, clientRate, profit, foreignCurr, foreignAmt, isBuying, marginType, marginVal);
        }

        function updateRateInputs(rate) {
            const primaryInput = document.getElementById('ratePrimaryInput');
            const secondaryInput = document.getElementById('rateSecondaryInput');

            primaryInput.value = rate.toFixed(4);
            secondaryInput.value = (1 / rate).toFixed(4);

            // Update currency labels
            document.getElementById('rateFromCode').textContent = fromCurr;
            document.getElementById('rateToCode').textContent = toCurr;
            document.getElementById('rateFromCode2').textContent = fromCurr;
            document.getElementById('rateToCode2').textContent = toCurr;

            // Style inputs if custom rate
            if (isCustomRateActive) {
                primaryInput.classList.add('custom');
                secondaryInput.classList.add('custom');
                document.getElementById('rateResetBtn').classList.add('show');
                document.getElementById('badgeCustom').style.display = 'inline-block';
            } else {
                primaryInput.classList.remove('custom');
                secondaryInput.classList.remove('custom');
                document.getElementById('rateResetBtn').classList.remove('show');
                document.getElementById('badgeCustom').style.display = 'none';
            }
        }

        // Handle manual rate edit (primary - forward rate)
        function onRatePrimaryChange() {
            const newRate = parseFloat(document.getElementById('ratePrimaryInput').value) || 0;
            if (newRate > 0) {
                customRate = newRate;
                isCustomRateActive = true;
                document.getElementById('rateSecondaryInput').value = (1 / newRate).toFixed(4);
                calculate('rate');
            }
        }

        // Handle manual rate edit (secondary - inverse rate)
        function onRateSecondaryChange() {
            const inverseRate = parseFloat(document.getElementById('rateSecondaryInput').value) || 0;
            if (inverseRate > 0) {
                customRate = 1 / inverseRate;
                isCustomRateActive = true;
                document.getElementById('ratePrimaryInput').value = customRate.toFixed(4);
                calculate('rate');
            }
        }

        // Reset to calculated rate
        function resetCustomRate() {
            customRate = null;
            isCustomRateActive = false;
            calculate('from');
            notify('↺ Rate reset to calculated value', 'success');
        }

        // Handle manual amount edits
        function onFromAmountInput() {
            document.getElementById('fromAmount').classList.remove('manual-edit');
            calculate('from');
        }

        function onToAmountInput() {
            document.getElementById('toAmount').classList.remove('manual-edit');
            calculate('to');
        }

        // Allow manual override without auto-calculation (for flat numbers)
        function onFromAmountBlur() {
            const el = document.getElementById('fromAmount');
            const val = el.value;
            // Check if user typed a round number (no decimals or .00)
            if (val && !val.includes('.')) {
                el.classList.add('manual-edit');
            }
        }

        function onToAmountBlur() {
            const el = document.getElementById('toAmount');
            const val = el.value;
            if (val && !val.includes('.')) {
                el.classList.add('manual-edit');
            }
        }

        function updateUI(mktRate, clientRate, profit, foreignCurr, foreignAmt, isBuying, marginType, marginVal) {
            document.getElementById('marketRates').innerHTML = `<span class="market-rate-item">📊 ${fromCurr}/${toCurr}: ${mktRate.toFixed(4)}</span><span class="market-rate-item">📊 ${toCurr}/${fromCurr}: ${(1 / mktRate).toFixed(4)}</span>`;
            document.getElementById('profitValue').textContent = `$${Math.abs(profit).toFixed(2)}`;
            document.getElementById('txTitle').textContent = `${fromCurr} → ${toCurr}`;
            document.getElementById('txSubtitle').textContent = `Customer exchanges ${fromCurr} for ${toCurr}`;

            if (foreignCurr) {
                document.getElementById('logicTx').textContent = isBuying ? `Customer has ${foreignCurr}, wants ${toCurr}` : `Customer has ${fromCurr}, wants ${foreignCurr}`;
                document.getElementById('logicBase').textContent = `${mktRate.toFixed(4)} ${toCurr}`;
                document.getElementById('logicMargin').textContent = marginType === 'fixed' ? `${isBuying ? '-' : '+'}$${marginVal.toFixed(4)}` : `${isBuying ? '-' : '+'}${marginVal}%`;
                document.getElementById('logicFinal').textContent = `${clientRate.toFixed(4)} ${toCurr}`;
                document.getElementById('logicProfit').textContent = `$${Math.abs(profit).toFixed(2)} CAD`;
                const tier = getMarginTier(foreignCurr, foreignAmt);
                if (tier) document.getElementById('badgeTier').textContent = `📈 Tier: $${tier.min}${tier.max === null ? '+' : `-$${tier.max}`}`;
                document.getElementById('badgeType').textContent = marginType === 'fixed' ? '📏 Fixed' : '📐 Percentage';
            }
        }
        // =====================================================
        // CURRENCY PICKER
        // =====================================================
        function populateDropdownList(q = '') {
            const curr = activePickerType === 'from' ? fromCurr : toCurr;
            dropdownList.innerHTML = Object.keys(currencies).filter(c => !q || c.toLowerCase().includes(q.toLowerCase()) || currencies[c].name.toLowerCase().includes(q.toLowerCase())).map(c => `<div class="picker-option ${c === curr ? 'selected' : ''}" data-code="${c}"><img src="https://flagcdn.com/w40/${currencies[c].flag}.png"><div class="picker-option-text"><div class="picker-option-code">${c}</div><div class="picker-option-name">${currencies[c].name}</div></div></div>`).join('');
            dropdownList.querySelectorAll('.picker-option').forEach(o => o.addEventListener('click', () => selectCurrency(o.dataset.code, activePickerType)));
        }
        function positionDropdown(trigger) { const r = trigger.getBoundingClientRect(); dropdown.style.top = `${r.bottom + 6}px`; dropdown.style.left = `${Math.max(10, Math.min(r.left, window.innerWidth - 210))}px`; dropdown.style.width = `${Math.max(r.width, 200)}px`; }
        function openPicker(type) { if (activePickerType === type && dropdown.classList.contains('open')) { closePicker(); return; } activePickerType = type; const trigger = document.getElementById(`${type}Trigger`); document.querySelectorAll('.picker-trigger').forEach(t => t.classList.remove('open')); trigger.classList.add('open'); positionDropdown(trigger); dropdown.classList.add('open'); dropdownSearch.value = ''; populateDropdownList(); setTimeout(() => dropdownSearch.focus(), 50); }
        function closePicker() { dropdown.classList.remove('open'); document.querySelectorAll('.picker-trigger').forEach(t => t.classList.remove('open')); activePickerType = null; }
        function selectCurrency(code, type) {
            if (type === 'from') fromCurr = code; else toCurr = code;
            const c = currencies[code];
            document.getElementById(`${type}Code`).textContent = code;
            document.getElementById(`${type}Name`).textContent = c.name;
            document.getElementById(`${type}Flag`).src = `https://flagcdn.com/w40/${c.flag}.png`;
            closePicker();
            // Reset custom rate when currency changes
            customRate = null;
            isCustomRateActive = false;
            calculate('from');
        }
        function swapCurrencies() {
            [fromCurr, toCurr] = [toCurr, fromCurr];
            ['from', 'to'].forEach(t => {
                const code = t === 'from' ? fromCurr : toCurr;
                const c = currencies[code];
                document.getElementById(`${t}Code`).textContent = code;
                document.getElementById(`${t}Name`).textContent = c.name;
                document.getElementById(`${t}Flag`).src = `https://flagcdn.com/w40/${c.flag}.png`;
            });
            // Reset custom rate when swapping
            customRate = null;
            isCustomRateActive = false;
            calculate('from');
        }

        // =====================================================
        // TRANSACTIONS
        // =====================================================
        async function completeExchange() {
            const fromAmt = parseFloat(document.getElementById('fromAmount').value) || 0;
            const toAmt = parseFloat(document.getElementById('toAmount').value) || 0;
            if (fromAmt <= 0) return notify('Enter valid amount', 'error');
            const btn = document.getElementById('completeBtn');
            btn.disabled = true;
            btn.innerHTML = '⏳ Processing...';
            try {
                const txId = await FirebaseDB.createTransaction({
                    fromCurrency: fromCurr,
                    toCurrency: toCurr,
                    fromAmount: fromAmt,
                    toAmount: toAmt,
                    exchangeRate: toAmt / fromAmt,
                    profit: Math.abs(lastCalc.profit),
                    isCustomRate: isCustomRateActive
                });
                showReceipt({ transactionId: txId, date: new Date().toISOString(), fromCurr, toCurr, fromAmt, toAmt, rate: toAmt / fromAmt });
                notify('✅ Exchange saved!', 'success');
                if (!sidePanelOpen) toggleSidePanel();
                // Reset after successful transaction
                customRate = null;
                isCustomRateActive = false;
            }
            catch (e) { notify('❌ Failed: ' + e.message, 'error'); }
            btn.disabled = false;
            btn.innerHTML = '✅ Complete Exchange';
        }

        function clearForm() {
            document.getElementById('fromAmount').value = '';
            document.getElementById('toAmount').value = '';
            document.getElementById('fromAmount').classList.remove('manual-edit');
            document.getElementById('toAmount').classList.remove('manual-edit');
            document.getElementById('profitValue').textContent = '$0.00';
            customRate = null;
            isCustomRateActive = false;
            calculate('from');
        }

        function updatePanels(stats, txs, inv) {
            document.getElementById('statCount').textContent = stats?.count || 0;
            document.getElementById('statProfit').textContent = `$${(stats?.profit || 0).toFixed(2)}`;
            const invList = document.getElementById('inventoryList'), invKeys = Object.keys(inv || {}).filter(c => (inv[c].in > 0 || inv[c].out > 0) && currencies[c]);
            invList.innerHTML = invKeys.length === 0 ? '<div class="empty-state">No inventory yet</div>' : invKeys.map(c => { const i = inv[c], total = (i.in || 0) - (i.out || 0); return `<div class="inventory-item"><div class="inventory-left"><img src="https://flagcdn.com/w40/${currencies[c].flag}.png" class="inventory-flag"><span class="inventory-code">${c}</span></div><div class="inventory-right"><div class="inventory-total ${total >= 0 ? 'positive' : 'negative'}">${total >= 0 ? '+' : ''}${total.toFixed(2)}</div><div class="inventory-details">In: ${(i.in || 0).toFixed(2)} | Out: ${(i.out || 0).toFixed(2)}</div></div></div>`; }).join('');
            const histList = document.getElementById('historyList'), validTxs = (txs || []).filter(tx => currencies[tx.fromCurrency]);
            histList.innerHTML = validTxs.length === 0 ? '<div class="empty-state">No transactions yet</div>' : validTxs.map(tx => { const time = tx.createdAt?.toDate ? tx.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'; return `<div class="history-item"><div class="history-icon"><img src="https://flagcdn.com/w40/${currencies[tx.fromCurrency]?.flag || 'un'}.png"></div><div class="history-info"><div class="history-pair">${tx.fromCurrency} → ${tx.toCurrency}</div><div class="history-time">${time}</div></div><div class="history-amounts"><div class="history-from">${tx.fromAmount.toFixed(2)} ${tx.fromCurrency}</div><div class="history-to">${tx.toAmount.toFixed(2)} ${tx.toCurrency}</div></div></div>`; }).join('');
        }

        // =====================================================
        // RECEIPT
        // =====================================================
        function showReceipt(tx) { const d = new Date(tx.date); document.getElementById('receiptContent').innerHTML = `<div class="receipt-header"><h2>💱 Currency Exchange</h2><p>Transaction Receipt</p></div><div class="receipt-row"><span>Date</span><span>${d.toLocaleDateString()}</span></div><div class="receipt-row"><span>Time</span><span>${d.toLocaleTimeString()}</span></div><div class="receipt-row"><span>Receipt #</span><span>${tx.transactionId || '---'}</span></div><div style="margin:12px 0;padding:10px;background:var(--gray-50);border-radius:var(--radius-sm);"><div class="receipt-row" style="border:none;"><span>Customer Gave</span><span style="font-weight:700">${tx.fromAmt.toFixed(2)} ${tx.fromCurr}</span></div><div class="receipt-row highlight"><span>Customer Received</span><span class="receipt-val">${tx.toAmt.toFixed(2)} ${tx.toCurr}</span></div></div><div class="receipt-row"><span>Rate</span><span>1 ${tx.fromCurr} = ${tx.rate.toFixed(4)} ${tx.toCurr}</span></div><div class="receipt-footer"><p>Thank you!</p><p style="margin-top:5px">🔥 Saved to Firebase</p></div>`; document.getElementById('receiptModal').classList.add('open'); }
        function printReceipt() { const fromAmt = parseFloat(document.getElementById('fromAmount').value) || 0, toAmt = parseFloat(document.getElementById('toAmount').value) || 0; if (fromAmt <= 0) return notify('Enter amount first', 'error'); showReceipt({ transactionId: 'PREVIEW', date: new Date().toISOString(), fromCurr, toCurr, fromAmt, toAmt, rate: toAmt / fromAmt }); }
        function closeReceipt() { document.getElementById('receiptModal').classList.remove('open'); }

        // =====================================================
        // SETTINGS - RATES
        // =====================================================
        function populateRateGrid() { const grid = document.getElementById('rateGrid'); grid.innerHTML = Object.keys(currencies).filter(c => c !== 'CAD').sort().map(c => `<div class="rate-input-item" data-code="${c}" data-name="${currencies[c].name.toLowerCase()}"><img src="https://flagcdn.com/w40/${currencies[c].flag}.png"><div class="currency-info"><div class="currency-code">${c}</div><div class="currency-name">${currencies[c].name}</div></div><input type="number" step="0.0001" value="${rates[c] || 0}" onchange="rates['${c}']=parseFloat(this.value)||0"></div>`).join(''); updateRateCount(); }
        function filterRateGrid() { const q = document.getElementById('rateSearchInput').value.toLowerCase(); let cnt = 0; document.querySelectorAll('#rateGrid .rate-input-item').forEach(i => { const m = i.dataset.code.toLowerCase().includes(q) || i.dataset.name.includes(q); i.classList.toggle('hidden', !m); if (m) cnt++; }); document.getElementById('rateCount').textContent = `${cnt} currencies`; }
        function updateRateCount() { document.getElementById('rateCount').textContent = `${document.querySelectorAll('#rateGrid .rate-input-item:not(.hidden)').length} currencies`; }
        function resetRatesView() { document.getElementById('rateSearchInput').value = ''; filterRateGrid(); }
        async function saveRates() { try { notify('💾 Saving...', 'success'); await FirebaseDB.saveRates(rates); calculate('from'); notify('✅ Rates saved!', 'success'); } catch (e) { notify('❌ Failed', 'error'); } }
        async function syncRatesFromAPI() { notify('🔄 Syncing...', 'success'); try { const res = await fetch('https://api.exchangerate-api.com/v4/latest/CAD'); const data = await res.json(); if (data?.rates) { Object.keys(currencies).forEach(c => { if (data.rates[c] && c !== 'CAD') rates[c] = 1 / data.rates[c]; }); populateRateGrid(); calculate('from'); document.getElementById('rateTime').textContent = '🕐 Updated now'; notify('✅ Synced! Save to store.', 'success'); } } catch (e) { notify('❌ Sync failed', 'error'); } }

        // =====================================================
        // SETTINGS - MARGINS
        // =====================================================
        function populateMarginTabs() { document.getElementById('marginTabs').innerHTML = Object.keys(currencies).filter(c => c !== 'CAD').sort().map(c => `<button class="currency-tab ${c === configCurrency ? 'active' : ''}" data-code="${c}" data-name="${currencies[c].name.toLowerCase()}" onclick="selectMarginCurr('${c}', this)"><img src="https://flagcdn.com/w40/${currencies[c].flag}.png"><span class="tab-code">${c}</span><span class="tab-name">${currencies[c].name}</span></button>`).join(''); updateMarginCount(); }
        function filterMarginTabs() { const q = document.getElementById('marginSearchInput').value.toLowerCase(); let cnt = 0; document.querySelectorAll('#marginTabs .currency-tab').forEach(t => { const m = t.dataset.code.toLowerCase().includes(q) || t.dataset.name.includes(q); t.classList.toggle('hidden', !m); if (m) cnt++; }); document.getElementById('marginCount').textContent = `${cnt} currencies`; }
        function updateMarginCount() { document.getElementById('marginCount').textContent = `${document.querySelectorAll('#marginTabs .currency-tab:not(.hidden)').length} currencies`; }
        function selectMarginCurr(code, btn) { configCurrency = code; document.querySelectorAll('#marginTabs .currency-tab').forEach(t => t.classList.remove('active')); if (btn) btn.classList.add('active'); document.getElementById('marginCurrLabel').textContent = code; document.getElementById('marginCurrName').textContent = currencies[code]?.name || ''; document.getElementById('tierCurrLabel').textContent = code; loadMarginUI(); }
        function loadMarginUI() { if (!marginConfig[configCurrency]) marginConfig[configCurrency] = { type: configCurrency === 'USD' ? 'fixed' : 'percentage', tiers: [{ min: 0, max: 500, margin: configCurrency === 'USD' ? 0.02 : 2.0 }, { min: 500, max: 1000, margin: configCurrency === 'USD' ? 0.015 : 1.5 }, { min: 1000, max: 5000, margin: configCurrency === 'USD' ? 0.01 : 1.0 }, { min: 5000, max: null, margin: configCurrency === 'USD' ? 0.005 : 0.5 }] }; const cfg = marginConfig[configCurrency]; document.getElementById('btnFixed').className = 'toggle-btn' + (cfg.type === 'fixed' ? ' active' : ''); document.getElementById('btnPercent').className = 'toggle-btn' + (cfg.type === 'percentage' ? ' active' : ''); loadTierList(); }
        function setMarginType(type) { if (!marginConfig[configCurrency]) marginConfig[configCurrency] = { type, tiers: [] }; marginConfig[configCurrency].type = type; document.getElementById('btnFixed').className = 'toggle-btn' + (type === 'fixed' ? ' active' : ''); document.getElementById('btnPercent').className = 'toggle-btn' + (type === 'percentage' ? ' active' : ''); loadTierList(); }
        function loadTierList() { const cfg = marginConfig[configCurrency] || { type: 'percentage', tiers: [] }; const isFixed = cfg.type === 'fixed'; const tiers = cfg.tiers || []; if (tiers.length === 0) { tiers.push({ min: 0, max: null, margin: isFixed ? 0.02 : 2.0 }); marginConfig[configCurrency].tiers = tiers; } document.getElementById('tierList').innerHTML = tiers.map((t, i) => `<div class="tier-item"><div class="tier-header"><span class="tier-num">📊 Tier ${i + 1} <span class="tier-badge">$${t.min}${t.max === null ? '+' : '-$' + t.max}</span></span>${i > 0 ? `<button class="tier-remove" onclick="removeTier(${i})">🗑️ Remove</button>` : ''}</div><div class="tier-inputs"><div class="input-group"><label>Min ($)</label><input type="number" value="${t.min}" onchange="updateTier(${i},'min',this.value)"></div><div class="input-group"><label>Max ($)</label><input type="number" value="${t.max === null ? '' : t.max}" placeholder="∞" onchange="updateTier(${i},'max',this.value)"></div><div class="input-group"><label>Margin ${isFixed ? '($)' : '(%)'}</label><input type="number" step="0.001" value="${t.margin}" onchange="updateTier(${i},'margin',this.value)"></div></div></div>`).join(''); }
        function updateTier(i, f, v) { marginConfig[configCurrency].tiers[i][f] = f === 'max' && v === '' ? null : parseFloat(v) || 0; }
        function addTier() { const tiers = marginConfig[configCurrency].tiers; const last = tiers[tiers.length - 1] || { min: 0, max: 500 }; if (last.max === null) last.max = last.min + 1000; tiers.push({ min: last.max, max: null, margin: marginConfig[configCurrency].type === 'fixed' ? 0.005 : 0.5 }); loadTierList(); }
        function removeTier(i) { marginConfig[configCurrency].tiers.splice(i, 1); loadTierList(); }
        async function saveMarginConfig() { try { notify('💾 Saving...', 'success'); await FirebaseDB.saveMargin(configCurrency, marginConfig[configCurrency]); calculate('from'); notify(`✅ ${configCurrency} saved!`, 'success'); } catch (e) { notify('❌ Failed', 'error'); } }
        function resetMarginConfig() { const isFixed = configCurrency === 'USD'; marginConfig[configCurrency] = { type: isFixed ? 'fixed' : 'percentage', tiers: [{ min: 0, max: 500, margin: isFixed ? 0.02 : 2.0 }, { min: 500, max: 1000, margin: isFixed ? 0.015 : 1.5 }, { min: 1000, max: 5000, margin: isFixed ? 0.01 : 1.0 }, { min: 5000, max: null, margin: isFixed ? 0.005 : 0.5 }] }; loadMarginUI(); notify(`🔄 Reset ${configCurrency}`, 'success'); }
        async function applyToAllCurrencies() { if (!confirm(`Apply ${configCurrency} config to ALL currencies?`)) return; notify('⏳ Applying...', 'success'); try { const batch = db.batch(); const src = marginConfig[configCurrency]; Object.keys(currencies).filter(c => c !== 'CAD').forEach(c => { batch.set(db.collection('margins').doc(c), { type: src.type, tiers: src.tiers, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }); marginConfig[c] = JSON.parse(JSON.stringify(src)); }); await batch.commit(); notify('✅ Applied to all!', 'success'); } catch (e) { notify('❌ Failed', 'error'); } }
        function showSettingsTab(tab, btn) { document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active')); btn.classList.add('active'); document.getElementById('tabRates').style.display = tab === 'rates' ? 'block' : 'none'; document.getElementById('tabMargins').style.display = tab === 'margins' ? 'block' : 'none'; if (tab === 'rates') populateRateGrid(); else { populateMarginTabs(); loadMarginUI(); } }
        function openSettings() { document.getElementById('settingsModal').classList.add('open'); populateRateGrid(); populateMarginTabs(); loadMarginUI(); }
        function closeSettings() { document.getElementById('settingsModal').classList.remove('open'); }

        // =====================================================
        // SYNC
        // =====================================================
        async function syncFromFirebase() {
            const btn = document.getElementById('syncBtn'), icon = document.getElementById('syncIcon');
            btn.classList.add('syncing');
            icon.textContent = '⏳';
            try {
                const { rates: r, currencies: c } = await FirebaseDB.loadRates();
                rates = r; currencies = c;
                marginConfig = await FirebaseDB.loadMargins();
                const stats = await FirebaseDB.getTodayStats();
                const txs = await FirebaseDB.getTodayTransactions();
                const inv = await FirebaseDB.getInventory();
                updatePanels(stats, txs, inv);
                customRate = null;
                isCustomRateActive = false;
                calculate('from');
                icon.textContent = '✓';
                notify('✅ Synced!', 'success');
                showConnectionStatus('online', 'Connected');
            } catch (e) {
                icon.textContent = '❌';
                notify('❌ Sync failed', 'error');
                showConnectionStatus('offline', 'Error');
            }
            setTimeout(() => { btn.classList.remove('syncing'); icon.textContent = '🔄'; }, 2000);
        }

        // =====================================================
        // INITIALIZATION
        // =====================================================
        async function init() {
            try {
                updateLoadingText('Connecting to Firebase...');
                await FirebaseDB.initialize();
                updateLoadingText('Loading data...');
                const { rates: r, currencies: c } = await FirebaseDB.loadRates(); rates = r; currencies = c;
                marginConfig = await FirebaseDB.loadMargins();
                const stats = await FirebaseDB.getTodayStats();
                const txs = await FirebaseDB.getTodayTransactions();
                const inv = await FirebaseDB.getInventory();
                FirebaseDB.subscribeToStats(s => { document.getElementById('statCount').textContent = s.count || 0; document.getElementById('statProfit').textContent = `$${(s.profit || 0).toFixed(2)}`; });
                FirebaseDB.subscribeToTransactions(txs => { FirebaseDB.getInventory().then(inv => { FirebaseDB.getTodayStats().then(stats => updatePanels(stats, txs, inv)); }); });
                updatePanels(stats, txs, inv);
                calculate('from');
                updateClock();
                setInterval(updateClock, 1000);
                updateDbIndicator(true);
                hideLoading();
                if (window.innerWidth > 1200) toggleSidePanel();
                showConnectionStatus('online', 'Connected');
            } catch (e) {
                console.error('Init error:', e);
                updateLoadingText('Connection failed. Check config.');
                updateDbIndicator(false);
                setTimeout(() => { hideLoading(); notify('❌ Firebase connection failed', 'error'); }, 2000);
            }

            // Currency picker events
            document.getElementById('fromTrigger').addEventListener('click', e => { e.stopPropagation(); openPicker('from'); });
            document.getElementById('toTrigger').addEventListener('click', e => { e.stopPropagation(); openPicker('to'); });
            dropdownSearch.addEventListener('input', e => populateDropdownList(e.target.value));
            dropdownSearch.addEventListener('click', e => e.stopPropagation());
            dropdown.addEventListener('click', e => e.stopPropagation());
            document.addEventListener('click', e => { if (!e.target.closest('.currency-picker') && !e.target.closest('.picker-dropdown')) closePicker(); });
            document.querySelector('.main-content').addEventListener('scroll', closePicker);
            window.addEventListener('resize', () => { if (activePickerType) positionDropdown(document.getElementById(`${activePickerType}Trigger`)); });

            // Amount input events - NEW
            document.getElementById('fromAmount').addEventListener('input', onFromAmountInput);
            document.getElementById('toAmount').addEventListener('input', onToAmountInput);
            document.getElementById('fromAmount').addEventListener('blur', onFromAmountBlur);
            document.getElementById('toAmount').addEventListener('blur', onToAmountBlur);

            // Rate input events - NEW
            document.getElementById('ratePrimaryInput').addEventListener('change', onRatePrimaryChange);
            document.getElementById('rateSecondaryInput').addEventListener('change', onRateSecondaryChange);

            // Keyboard shortcuts
            document.addEventListener('keydown', e => { if (e.key === 'Escape') { closePicker(); closeSettings(); closeReceipt(); } });
            document.getElementById('settingsModal').onclick = e => { if (e.target.id === 'settingsModal') closeSettings(); };
            document.getElementById('receiptModal').onclick = e => { if (e.target.id === 'receiptModal') closeReceipt(); };
        }

        init();
