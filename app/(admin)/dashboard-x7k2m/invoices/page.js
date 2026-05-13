'use client'
import { useEffect } from 'react'

export default function InvoicesPage() {
  useEffect(() => {
    // ─── REFS (service types) ───
    const REFS = {
      sw:   { label: 'Software Development Services',   desc: 'Custom software design, development and technical implementation' },
      it:   { label: 'IT Consulting Services',           desc: 'Technology strategy, infrastructure planning and technical advisory' },
      web:  { label: 'Web Development Services',         desc: 'Website design, development and deployment services' },
      mkt:  { label: 'Marketing Services',               desc: 'Brand strategy, campaign management and marketing execution' },
      api:  { label: 'API Integration Services',         desc: 'Third-party API integration, automation and data pipeline development' },
      biz:  { label: 'Business Consulting Services',     desc: 'Business process optimisation, growth strategy and operational advisory' },
      dmkt: { label: 'Digital Marketing Services',       desc: 'SEO, paid media management, analytics and conversion optimisation' },
    }

    // ─── COMPANIES (localStorage) ───
    const DEFAULT_COS = [
      { label: 'Estenatura Ltd', name: 'ESTENATURA LIMITED',  a1: "99 Queen's Road Central", a2: 'Hong Kong',             iban: 'BE64 9055 2588 0352',        bic: 'TRWIBEB1XXX', bank: 'Wise', email: 'billing@estenatura.com' },
      { label: 'BasiQ Ltd',      name: 'BASIQ LIMITED',       a1: '27 Old Gloucester Street', a2: 'London, WC1N 3AX, UK', iban: 'GB29 NWBK 6016 1331 9268 19', bic: 'TRWIBEB1XXX', bank: 'Wise', email: 'billing@basiq.io' },
    ]
    function loadCos() { try { return JSON.parse(localStorage.getItem('bq_companies')) || DEFAULT_COS } catch { return DEFAULT_COS } }
    function saveCosLS(c) { localStorage.setItem('bq_companies', JSON.stringify(c)) }

    let COS = loadCos()
    let curCo = 0
    let items = []

    // ─── CO TOGGLE ───
    function updateCoButtons() {
      COS = loadCos()
      document.getElementById('co0btn').textContent = COS[0].label
      document.getElementById('co1btn').textContent = COS[1].label
      document.getElementById('co0btn').classList.toggle('inv-co-active', curCo === 0)
      document.getElementById('co1btn').classList.toggle('inv-co-active', curCo === 0)
      document.getElementById('co0btn').classList.toggle('inv-co-active', curCo === 0)
      document.getElementById('co1btn').classList.toggle('inv-co-active', curCo === 1)
    }
    function selectCo(i) { curCo = i; updateCoButtons(); render() }
    window._inv_selectCo = selectCo

    // ─── CONFIG MODAL ───
    function openCfg() {
      COS = loadCos()
      const keys = ['label', 'name', 'a1', 'a2', 'iban', 'bic', 'bank', 'email']
      keys.forEach(f => {
        document.getElementById('c1_' + f).value = COS[0][f] || ''
        document.getElementById('c2_' + f).value = COS[1][f] || ''
      })
      document.getElementById('cfgModal').classList.add('open')
    }
    function closeCfg() { document.getElementById('cfgModal').classList.remove('open') }
    function saveCfg() {
      const keys = ['label', 'name', 'a1', 'a2', 'iban', 'bic', 'bank', 'email']
      COS = [
        Object.fromEntries(keys.map(f => [f, document.getElementById('c1_' + f).value.trim()])),
        Object.fromEntries(keys.map(f => [f, document.getElementById('c2_' + f).value.trim()])),
      ]
      saveCosLS(COS)
      updateCoButtons()
      closeCfg()
      render()
    }
    window._inv_openCfg  = openCfg
    window._inv_closeCfg = closeCfg
    window._inv_saveCfg  = saveCfg

    // ─── REF CHANGE ───
    function onRefChange() {
      const ref = REFS[document.getElementById('invRef').value]
      if (items.length > 0) {
        items[0].name = ref.label
        items[0].desc = ref.desc
      } else {
        addItem(ref.label, ref.desc, 1, '')
        return
      }
      renderItems()
      render()
    }
    window._inv_onRefChange = onRefChange

    // ─── ITEMS ───
    function esc(s) { return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') }
    function addItem(name = '', desc = '', qty = 1, price = '') {
      items.push({ name, desc, qty, price })
      renderItems(); render()
    }
    function removeItem(i) { items.splice(i, 1); renderItems(); render() }
    function renderItems() {
      const l = document.getElementById('itemsList')
      if (!l) return
      l.innerHTML = items.map((it, i) => `
        <div class="inv-item-card">
          <button class="inv-item-del" onclick="window._inv_removeItem(${i})">×</button>
          <input type="text" class="inv-input" placeholder="Service name" value="${esc(it.name)}" oninput="window._inv_items[${i}].name=this.value;window._inv_render()">
          <input type="text" class="inv-input" placeholder="Description (optional)" value="${esc(it.desc)}" oninput="window._inv_items[${i}].desc=this.value;window._inv_render()">
          <div style="display:grid;grid-template-columns:52px 1fr;gap:6px;">
            <input type="number" class="inv-input" placeholder="Qty"  value="${it.qty}"   min="1"    oninput="window._inv_items[${i}].qty=+this.value;window._inv_render()" style="margin-bottom:0">
            <input type="number" class="inv-input" placeholder="Price" value="${it.price}" min="0" step="0.01" oninput="window._inv_items[${i}].price=+this.value;window._inv_render()" style="margin-bottom:0">
          </div>
        </div>`).join('')
    }
    window._inv_items      = items
    window._inv_removeItem = removeItem
    window._inv_addItem    = addItem
    window._inv_render     = () => render()

    // ─── DATES ───
    function fmtDate(iso) {
      if (!iso) return '—'
      const [y, m, d] = iso.split('-')
      return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+m-1] + ' ' + parseInt(d) + ', ' + y
    }
    function todayISO() { return new Date().toISOString().slice(0, 10) }
    function addDays(iso, n) { const d = new Date(iso); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10) }
    window._inv_addDays = addDays

    // ─── TOTALS ───
    function calcTotals() {
      const cur  = document.getElementById('cur').value
      const disc = parseFloat(document.getElementById('disc').value) || 0
      const taxP = parseFloat(document.getElementById('taxP').value) || 0
      const sub  = items.reduce((s, it) => s + ((+it.qty || 1) * (+it.price || 0)), 0)
      const tax  = (sub - disc) * taxP / 100
      const total = sub - disc + tax
      return { cur, sub, disc, taxP, tax, total }
    }
    function fmt(cur, n) { return cur + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') }

    // ─── RENDER ───
    function render() {
      const co     = COS[curCo]
      const num    = document.getElementById('invNum').value   || 'INV-0001'
      const date   = document.getElementById('invDate').value
      const due    = document.getElementById('invDue').value
      const refKey = document.getElementById('invRef').value
      const refLabel = REFS[refKey].label
      const cn  = document.getElementById('cName').value  || '—'
      const ca1 = document.getElementById('cA1').value
      const ca2 = document.getElementById('cA2').value
      const cac = document.getElementById('cCity').value
      const creg = document.getElementById('cReg').value
      const notes = document.getElementById('notes').value
      const { cur, sub, disc, taxP, tax, total } = calcTotals()

      const rows = items.map((it, i) => `
        <div class="tr${i % 2 ? '' : ' s'}">
          <div><div class="tin">${esc(it.name || '—')}</div>${it.desc ? `<div class="tid">${esc(it.desc)}</div>` : ''}</div>
          <div class="tiq">${it.qty || 1}</div>
          <div class="tip">${fmt(cur, (+it.qty || 1) * (+it.price || 0))}</div>
        </div>`).join('')

      const totRows = `
        <div class="tot"><span>Subtotal</span><span class="tv">${fmt(cur, sub)}</span></div>
        ${disc > 0 ? `<div class="tot"><span>Discount</span><span class="tv">− ${fmt(cur, disc)}</span></div>` : ''}
        <div class="tot"><span>Tax (${taxP}%)</span><span class="tv">${fmt(cur, tax)}</span></div>
        <div class="tot main"><span>TOTAL</span><span class="tv">${fmt(cur, total)}</span></div>
        <div class="tot due"><span>PAYMENT DUE</span><span class="tv">${fmt(cur, total)}</span></div>`

      const page = document.getElementById('invoicePage')
      if (!page) return
      page.innerHTML = `
        <div class="inv-chrome-inner">
          <div class="cd r"></div><div class="cd y"></div><div class="cd g"></div>
          <span class="clbl">BasiQ Invoice</span>
        </div>
        <div class="inv-body">
          <div class="inv-hdr">
            <div class="inv-brand">
              <img class="inv-logo" src="/logo.png" alt="BasiQ">
              <div class="inv-tagline">Simple. Discreet. It Works.</div>
            </div>
            <div class="inv-right">
              <div class="inv-title">INVOICE</div>
              <div class="meta-box">
                <div class="mrow"><div class="mico"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div><div><div class="mlbl">Date</div><div class="mval">${fmtDate(date)}</div></div></div>
                <div class="mrow"><div class="mico"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div><div><div class="mlbl">Invoice No.</div><div class="mval">${esc(num)}</div></div></div>
                <div class="mrow"><div class="mico"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div><div><div class="mlbl">Due Date</div><div class="mval">${fmtDate(due)}</div></div></div>
                <div class="mrow" style="border-bottom:none"><div class="mico"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div><div><div class="mlbl">Reference</div><div class="mval">${esc(refLabel)}</div></div></div>
              </div>
            </div>
          </div>
          <div class="inv-rule"></div>
          <div class="sh"><div class="sh-ico"><svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div><div class="sh-lbl">Parties</div><div class="sh-line"></div></div>
          <div class="addrs">
            <div class="addr dk">
              <div class="al">From</div>
              <div class="an">${esc(co.name)}</div>
              <div class="ali"><div>${esc(co.a1)}</div><div>${esc(co.a2)}</div></div>
            </div>
            <div class="addr">
              <div class="al">Bill To</div>
              <div class="an">${esc(cn)}</div>
              <div class="ali">
                ${ca1 ? `<div>${esc(ca1)}</div>` : ''}
                ${ca2 ? `<div>${esc(ca2)}</div>` : ''}
                ${cac ? `<div>${esc(cac)}</div>` : ''}
                ${creg ? `<div style="margin-top:4px;font-size:11px;">Reg. No.: <strong>${esc(creg)}</strong></div>` : ''}
              </div>
            </div>
          </div>
          <div class="sh"><div class="sh-ico"><svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></div><div class="sh-lbl">Services</div><div class="sh-line"></div></div>
          <div class="tbl">
            <div class="tbl-hd"><div class="thc">Description</div><div class="thc c">Qty</div><div class="thc r">Amount</div></div>
            ${rows || '<div class="tr"><div class="tid" style="color:#aaa">No items added.</div><div></div><div></div></div>'}
            ${totRows}
          </div>
          <div class="btm">
            <div class="bc">
              <div class="bl">Payment Details</div>
              <div class="bm">Bank Transfer</div>
              <div class="bv">
                <div><strong>${esc(co.name)}</strong></div>
                <div>IBAN: ${esc(co.iban)}</div>
                <div>BIC: ${esc(co.bic)}</div>
                <div>Bank: ${esc(co.bank)}</div>
              </div>
            </div>
            <div class="bc tc">
              <div class="bl">Terms &amp; Conditions</div>
              <div class="bv">
                <div>Payment due within 14 days of issue date.</div>
                <div style="margin-top:5px">Terms of our signed service agreement apply.</div>
                <div style="margin-top:5px">Queries: <strong>${esc(co.email)}</strong></div>
                ${notes ? `<div style="margin-top:8px;font-style:italic;font-size:11px">${esc(notes)}</div>` : ''}
              </div>
            </div>
          </div>
        </div>
        <div class="inv-foot"></div>`
    }

    // ─── EXPORT PDF ───
    function exportPDF() {
      const page = document.getElementById('invOuter').cloneNode(true)
      const num  = document.getElementById('invNum').value || 'invoice'
      const printCSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Inter',sans-serif;background:white;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
:root{--navy:#1A2A4A;--amber:#E8922B;--g50:#F8FAFC;--g100:#EEF2F8;--g200:#D8E2F0;--g500:#6B7A99;--mono:'DM Mono',monospace;}
.inv-outer{display:flex;flex-direction:column;width:794px;}
.inv-chrome-inner{background:#1A2A4A;padding:13px 20px;display:flex;align-items:center;gap:8px;flex-shrink:0;}
.inv-chrome-inner .cd{width:12px;height:12px;border-radius:50%;flex-shrink:0;}
.inv-chrome-inner .cd.r{background:#FF5F56;}.inv-chrome-inner .cd.y{background:#FFBD2E;}.inv-chrome-inner .cd.g{background:#27C93F;}
.clbl{margin-left:10px;font-size:11px;font-weight:700;color:rgba(255,255,255,.35);letter-spacing:2.5px;text-transform:uppercase;}
.inv{background:white;width:794px;min-height:1123px;display:flex;flex-direction:column;}
.inv-body{flex:1;padding:52px 56px 0;}
.inv-hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:34px;}
.inv-brand{display:flex;flex-direction:column;gap:10px;max-width:320px;}
.inv-logo{display:block;width:auto;max-height:100px;max-width:280px;}
.inv-tagline{font-size:13px;font-weight:700;color:var(--amber);letter-spacing:2.5px;text-transform:uppercase;}
.inv-right{display:flex;flex-direction:column;align-items:flex-end;}
.inv-title{font-size:56px;font-weight:800;color:var(--navy);letter-spacing:-2px;line-height:1;margin-bottom:14px;}
.meta-box{background:var(--g50);border:1.5px solid var(--g200);border-radius:12px;overflow:hidden;min-width:220px;}
.mrow{display:flex;align-items:center;padding:9px 14px;border-bottom:1px solid var(--g100);gap:10px;}
.mrow:last-child{border-bottom:none;}
.mico{width:28px;height:28px;background:var(--g100);border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.mlbl{font-size:9px;font-weight:600;color:var(--g500);letter-spacing:1px;text-transform:uppercase;margin-bottom:1px;}
.mval{font-size:12.5px;font-weight:500;color:var(--navy);font-family:var(--mono);}
.inv-rule{height:2px;background:linear-gradient(to right,var(--navy) 65%,var(--amber));border-radius:1px;margin:0 0 26px;position:relative;}
.inv-rule::after{content:'';position:absolute;right:-6px;top:-5px;width:0;height:0;border-top:6px solid transparent;border-bottom:6px solid transparent;border-left:12px solid var(--amber);}
.sh{display:flex;align-items:center;gap:10px;margin-bottom:12px;}
.sh-ico{width:32px;height:32px;background:var(--navy);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.sh-ico svg{width:16px;height:16px;fill:none;stroke:white;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}
.sh-lbl{font-size:11px;font-weight:700;color:var(--navy);letter-spacing:1.5px;text-transform:uppercase;}
.sh-line{flex:1;height:1px;background:var(--g200);}
.addrs{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:26px;}
.addr{background:var(--g50);border:1.5px solid var(--g200);border-radius:10px;padding:16px 18px;}
.addr.dk{background:var(--navy);border-color:var(--navy);}
.al{font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--g500);margin-bottom:8px;}
.addr.dk .al{color:rgba(255,255,255,.4);}
.an{font-size:13.5px;font-weight:700;color:var(--navy);margin-bottom:4px;}
.addr.dk .an{color:white;}
.ali{font-size:12px;color:var(--g500);line-height:1.75;}
.addr.dk .ali{color:rgba(255,255,255,.65);}
.tbl{border:1.5px solid var(--g200);border-radius:10px;overflow:hidden;}
.tbl-hd{display:grid;grid-template-columns:1fr 68px 112px;background:var(--navy);padding:10px 18px;}
.thc{font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,.5);}
.thc.r{text-align:right;}.thc.c{text-align:center;}
.tr{display:grid;grid-template-columns:1fr 68px 112px;padding:11px 18px;border-bottom:1px solid var(--g100);align-items:start;}
.tr:last-child{border-bottom:none;}.tr.s{background:var(--g50);}
.tin{font-size:13px;font-weight:600;color:var(--navy);}
.tid{font-size:11.5px;color:var(--g500);margin-top:2px;line-height:1.5;}
.tiq{font-size:13px;font-weight:500;color:var(--navy);text-align:center;}
.tip{font-size:13px;font-weight:600;color:var(--navy);text-align:right;font-family:var(--mono);}
.tot{display:flex;justify-content:space-between;padding:7px 18px;font-size:12.5px;color:var(--g500);border-bottom:1px solid var(--g100);}
.tot:last-child{border-bottom:none;}
.tot.main{background:var(--navy);color:white;font-size:14px;font-weight:700;padding:12px 18px;}
.tot.due{background:var(--amber);color:white;font-size:15px;font-weight:800;padding:12px 18px;}
.tv{font-family:var(--mono);font-weight:600;}
.btm{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:22px;}
.bc{background:var(--g50);border:1.5px solid var(--g200);border-radius:10px;padding:16px 18px;}
.bc.tc{border-top:3px solid var(--amber);}
.bl{font-size:9px;font-weight:700;color:var(--g500);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px;}
.bm{font-size:11px;font-weight:700;color:var(--navy);letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;}
.bv{font-size:11.5px;color:var(--g500);line-height:1.85;}
.bv strong{color:var(--navy);}
.inv-foot{height:5px;background:linear-gradient(to right,var(--navy),var(--amber));margin-top:40px;}
@media print{@page{size:A4;margin:0;}body{margin:0;}}`

      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Invoice - ${num}</title><style>${printCSS}</style></head><body>${page.outerHTML}<script>window.onload=function(){window.print();}<\/script></body></html>`
      const win = window.open('', '_blank')
      win.document.write(html)
      win.document.close()
    }
    window._inv_exportPDF = exportPDF

    // ─── RESET ───
    function autoNum() {
      const d = new Date()
      return `INV-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 900) + 100)}`
    }
    function resetForm() {
      document.getElementById('cName').value = ''
      document.getElementById('cA1').value   = ''
      document.getElementById('cA2').value   = ''
      document.getElementById('cCity').value = ''
      document.getElementById('cReg').value  = ''
      document.getElementById('notes').value = ''
      document.getElementById('disc').value  = '0'
      document.getElementById('taxP').value  = '0'
      document.getElementById('invRef').value = 'sw'
      items.length = 0
      document.getElementById('invNum').value = autoNum()
      renderItems()
      onRefChange()
    }
    window._inv_resetForm = resetForm

    // ─── INIT ───
    updateCoButtons()
    const t = todayISO()
    document.getElementById('invDate').value = t
    document.getElementById('invDue').value  = addDays(t, 14)
    document.getElementById('invNum').value  = autoNum()
    onRefChange()
  }, [])

  // ─── Shared input/label styles for the form panel ───
  const lbl = 'block text-[10px] uppercase tracking-widest text-[#6a7a90] font-medium mb-1'
  const inp = 'w-full bg-[#2c3d5e] border border-[#3e4e72] rounded-lg px-3 py-2 text-[#f0ede8] placeholder-[#6a7a90] text-xs outline-none focus:border-[#e8914a] focus:ring-1 focus:ring-[#e8914a]/30 transition-all mb-3'
  const sec = 'mb-5'
  const secTitle = 'text-[9px] font-bold uppercase tracking-widest text-[#6a7a90] mb-3 flex items-center gap-2 after:flex-1 after:h-px after:bg-[#2c3d5e] after:content-[\'\']'

  return (
    <>
      {/* Invoice-specific CSS (white paper styles) */}
      <style>{`
        .inv-outer { display:flex; flex-direction:column; width:794px; box-shadow:0 24px 80px rgba(0,0,0,.6); }
        .inv-chrome-inner { background:#1A2A4A; padding:13px 20px; display:flex; align-items:center; gap:8px; flex-shrink:0; border-radius:0; }
        .inv-chrome-inner .cd { width:12px; height:12px; border-radius:50%; flex-shrink:0; }
        .inv-chrome-inner .cd.r{background:#FF5F56;} .cd.y{background:#FFBD2E;} .cd.g{background:#27C93F;}
        .clbl { margin-left:10px; font-size:11px; font-weight:700; color:rgba(255,255,255,.35); letter-spacing:2.5px; text-transform:uppercase; }
        .inv { background:white; width:794px; min-height:1123px; display:flex; flex-direction:column; }
        .inv-body { flex:1; padding:52px 56px 0; }
        .inv-hdr { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:34px; }
        .inv-brand { display:flex; flex-direction:column; gap:10px; max-width:320px; }
        .inv-logo { display:block; width:auto; max-height:100px; max-width:280px; }
        .inv-tagline { font-size:13px; font-weight:700; color:#E8922B; letter-spacing:2.5px; text-transform:uppercase; }
        .inv-right { display:flex; flex-direction:column; align-items:flex-end; }
        .inv-title { font-size:56px; font-weight:800; color:#1A2A4A; letter-spacing:-2px; line-height:1; margin-bottom:14px; }
        .meta-box { background:#F8FAFC; border:1.5px solid #D8E2F0; border-radius:12px; overflow:hidden; min-width:220px; }
        .mrow { display:flex; align-items:center; padding:9px 14px; border-bottom:1px solid #EEF2F8; gap:10px; }
        .mrow:last-child { border-bottom:none; }
        .mico { width:28px; height:28px; background:#EEF2F8; border-radius:6px; display:flex; align-items:center; justify-content:center; flex-shrink:0; color:#2D4163; }
        .mlbl { font-size:9px; font-weight:600; color:#6B7A99; letter-spacing:1px; text-transform:uppercase; margin-bottom:1px; }
        .mval { font-size:12.5px; font-weight:500; color:#1A2A4A; font-family:'DM Mono',monospace; }
        .inv-rule { height:2px; background:linear-gradient(to right,#1A2A4A 65%,#E8922B); border-radius:1px; margin:0 0 26px; position:relative; }
        .inv-rule::after { content:''; position:absolute; right:-6px; top:-5px; width:0; height:0; border-top:6px solid transparent; border-bottom:6px solid transparent; border-left:12px solid #E8922B; }
        .sh { display:flex; align-items:center; gap:10px; margin-bottom:12px; }
        .sh-ico { width:32px; height:32px; background:#1A2A4A; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .sh-ico svg { width:16px; height:16px; fill:none; stroke:white; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
        .sh-lbl { font-size:11px; font-weight:700; color:#1A2A4A; letter-spacing:1.5px; text-transform:uppercase; }
        .sh-line { flex:1; height:1px; background:#D8E2F0; }
        .addrs { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:26px; }
        .addr { background:#F8FAFC; border:1.5px solid #D8E2F0; border-radius:10px; padding:16px 18px; }
        .addr.dk { background:#1A2A4A; border-color:#1A2A4A; }
        .al { font-size:9px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#6B7A99; margin-bottom:8px; }
        .addr.dk .al { color:rgba(255,255,255,.4); }
        .an { font-size:13.5px; font-weight:700; color:#1A2A4A; margin-bottom:4px; }
        .addr.dk .an { color:white; }
        .ali { font-size:12px; color:#6B7A99; line-height:1.75; }
        .addr.dk .ali { color:rgba(255,255,255,.65); }
        .tbl { border:1.5px solid #D8E2F0; border-radius:10px; overflow:hidden; }
        .tbl-hd { display:grid; grid-template-columns:1fr 68px 112px; background:#1A2A4A; padding:10px 18px; }
        .thc { font-size:9px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:rgba(255,255,255,.5); }
        .thc.r { text-align:right; } .thc.c { text-align:center; }
        .tr { display:grid; grid-template-columns:1fr 68px 112px; padding:11px 18px; border-bottom:1px solid #EEF2F8; align-items:start; }
        .tr:last-child { border-bottom:none; } .tr.s { background:#F8FAFC; }
        .tin { font-size:13px; font-weight:600; color:#1A2A4A; }
        .tid { font-size:11.5px; color:#6B7A99; margin-top:2px; line-height:1.5; }
        .tiq { font-size:13px; font-weight:500; color:#1A2A4A; text-align:center; }
        .tip { font-size:13px; font-weight:600; color:#1A2A4A; text-align:right; font-family:'DM Mono',monospace; }
        .tot { display:flex; justify-content:space-between; padding:7px 18px; font-size:12.5px; color:#6B7A99; border-bottom:1px solid #EEF2F8; }
        .tot:last-child { border-bottom:none; }
        .tot.main { background:#1A2A4A; color:white; font-size:14px; font-weight:700; padding:12px 18px; }
        .tot.due { background:#E8922B; color:white; font-size:15px; font-weight:800; padding:12px 18px; }
        .tv { font-family:'DM Mono',monospace; font-weight:600; }
        .btm { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-top:22px; }
        .bc { background:#F8FAFC; border:1.5px solid #D8E2F0; border-radius:10px; padding:16px 18px; }
        .bc.tc { border-top:3px solid #E8922B; }
        .bl { font-size:9px; font-weight:700; color:#6B7A99; letter-spacing:1.5px; text-transform:uppercase; margin-bottom:8px; }
        .bm { font-size:11px; font-weight:700; color:#1A2A4A; letter-spacing:1px; text-transform:uppercase; margin-bottom:6px; }
        .bv { font-size:11.5px; color:#6B7A99; line-height:1.85; }
        .bv strong { color:#1A2A4A; }
        .inv-foot { height:5px; background:linear-gradient(to right,#1A2A4A,#E8922B); margin-top:40px; }
        /* item cards in the form panel */
        .inv-item-card { background:rgba(255,255,255,.04); border:1px solid #3e4e72; border-radius:8px; padding:10px 11px 6px; position:relative; margin-bottom:7px; }
        .inv-item-del { position:absolute; top:8px; right:8px; width:20px; height:20px; background:rgba(255,80,80,.12); border:none; border-radius:4px; color:rgba(255,100,100,.7); cursor:pointer; font-size:13px; display:flex; align-items:center; justify-content:center; }
        .inv-item-del:hover { background:rgba(255,80,80,.25); }
        .inv-input { width:100%; background:#2c3d5e; border:1px solid #3e4e72; border-radius:7px; padding:7px 10px; font-size:12px; color:#f0ede8; outline:none; transition:border-color .15s; margin-bottom:6px; font-family:'DM Sans',sans-serif; }
        .inv-input:focus { border-color:#e8914a; background:rgba(232,145,74,.07); }
        .inv-co-active { border-color:#e8914a !important; background:rgba(232,145,74,.12) !important; color:#f5a94a !important; }
        /* config modal */
        .inv-modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.7); z-index:200; display:none; align-items:center; justify-content:center; }
        .inv-modal-overlay.open { display:flex; }
        .inv-modal { background:#1a2538; border:1px solid #344060; border-radius:14px; padding:28px 30px; width:500px; max-height:80vh; overflow-y:auto; }
      `}</style>

      {/* CONFIG MODAL */}
      <div className="inv-modal-overlay" id="cfgModal">
        <div className="inv-modal">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#344060]">
            <span className="text-[#f0ede8] font-semibold text-sm">Company Settings</span>
            <button onClick={() => window._inv_closeCfg()} className="ml-auto text-[#6a7a90] hover:text-[#f0ede8] text-xl leading-none">×</button>
          </div>
          <p className="text-xs text-[#6a7a90] mb-5">Saved locally. Used as static data for all invoices.</p>

          {[1, 2].map(n => (
            <div key={n} className="mb-6">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#e8914a] mb-3 pb-2 border-b border-[#344060]">Company {n}</div>
              {[['label','Display name (button)'],['name','Legal name'],['a1','Address line 1'],['a2','Address line 2'],['iban','IBAN'],['bic','BIC / SWIFT'],['bank','Bank name'],['email','Billing email']].map(([id, label]) => (
                <div key={id} className="mb-3">
                  <label className={lbl}>{label}</label>
                  <input id={`c${n}_${id}`} className={inp.replace('mb-3','')} />
                </div>
              ))}
            </div>
          ))}

          <button onClick={() => window._inv_saveCfg()} className="portal-btn-primary w-full mt-2">Save & Close</button>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="-m-4 sm:-m-8 flex overflow-hidden h-[calc(100vh-56px)] md:h-screen">

        {/* ── FORM PANEL ── */}
        <div className="relative w-[360px] flex-shrink-0 bg-[#0f172a] border-r border-[#2c3d5e] flex flex-col overflow-hidden">

          {/* Header */}
          <div className="px-4 py-3 border-b border-[#2c3d5e] flex items-center gap-3 bg-[#1a2538] flex-shrink-0">
            <img src="/logo.png" alt="BasiQ" className="h-5 object-contain" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#6a7a90]">Invoice Generator</span>
            <button onClick={() => window._inv_openCfg()} className="ml-auto text-[10px] text-[#6a7a90] hover:text-[#a8b8cc] border border-[#344060] rounded px-2 py-1 transition-colors">⚙ Settings</button>
          </div>

          {/* Scrollable form */}
          <div className="flex-1 overflow-y-auto p-5" style={{ paddingBottom: '120px' }}>

            {/* From */}
            <div className={sec}>
              <div className={secTitle}>From (Our Company)</div>
              <div className="grid grid-cols-2 gap-2">
                <button id="co0btn" onClick={() => window._inv_selectCo(0)}
                  className="py-2 px-3 rounded-lg border border-[#3e4e72] bg-[#2c3d5e] text-[#a8b8cc] text-xs font-semibold cursor-pointer transition-all hover:border-[#e8914a]/50">—</button>
                <button id="co1btn" onClick={() => window._inv_selectCo(1)}
                  className="py-2 px-3 rounded-lg border border-[#3e4e72] bg-[#2c3d5e] text-[#a8b8cc] text-xs font-semibold cursor-pointer transition-all hover:border-[#e8914a]/50">—</button>
              </div>
            </div>

            {/* Invoice Meta */}
            <div className={sec}>
              <div className={secTitle}>Invoice Details</div>
              <label className={lbl}>Invoice No.</label>
              <input id="invNum" className={inp} placeholder="INV-2025-001" onInput={() => window._inv_render()} />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Date</label>
                  <input type="date" id="invDate" className={inp} onInput={() => window._inv_render()} />
                </div>
                <div>
                  <label className={lbl}>Due Date</label>
                  <input type="date" id="invDue" className={inp} onInput={() => window._inv_render()} />
                </div>
              </div>
              <label className={lbl}>Service Type</label>
              <select id="invRef" className={inp} onChange={() => window._inv_onRefChange()}>
                <option value="sw">Software Development</option>
                <option value="it">IT Consulting</option>
                <option value="web">Web Development</option>
                <option value="mkt">Marketing Services</option>
                <option value="api">API Integration</option>
                <option value="biz">Business Consulting</option>
                <option value="dmkt">Digital Marketing</option>
              </select>
            </div>

            {/* Bill To */}
            <div className={sec}>
              <div className={secTitle}>Bill To (Client)</div>
              <label className={lbl}>Company Name</label>
              <input id="cName" className={inp} placeholder="Client Ltd" onInput={() => window._inv_render()} />
              <label className={lbl}>Address Line 1</label>
              <input id="cA1" className={inp} placeholder="Floor / Suite" onInput={() => window._inv_render()} />
              <label className={lbl}>Address Line 2</label>
              <input id="cA2" className={inp} placeholder="Building / Street" onInput={() => window._inv_render()} />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>City / Country</label>
                  <input id="cCity" className={inp} placeholder="Hong Kong" onInput={() => window._inv_render()} />
                </div>
                <div>
                  <label className={lbl}>Reg. No. (opt.)</label>
                  <input id="cReg" className={inp} placeholder="" onInput={() => window._inv_render()} />
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className={sec}>
              <div className={secTitle}>Line Items</div>
              <div id="itemsList"></div>
              <button
                onClick={() => window._inv_addItem()}
                className="w-full py-2 bg-[#e8914a]/08 border border-dashed border-[#e8914a]/35 rounded-lg text-[#f5a94a] text-xs font-semibold mt-1 hover:bg-[#e8914a]/15 transition-all"
              >+ Add Line Item</button>
            </div>

            {/* Currency & Totals */}
            <div className={sec}>
              <div className={secTitle}>Currency & Totals</div>
              <label className={lbl}>Currency</label>
              <select id="cur" className={inp} onChange={() => window._inv_render()}>
                <option>£</option><option>€</option><option>$</option><option>HK$</option>
              </select>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Discount</label>
                  <input type="number" id="disc" className={inp} defaultValue="0" min="0" step="0.01" onInput={() => window._inv_render()} />
                </div>
                <div>
                  <label className={lbl}>Tax %</label>
                  <input type="number" id="taxP" className={inp} defaultValue="0" min="0" step="0.1" onInput={() => window._inv_render()} />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className={sec}>
              <div className={secTitle}>Notes (optional)</div>
              <textarea id="notes" className={inp + ' resize-none min-h-[64px]'} placeholder="Additional notes…" onInput={() => window._inv_render()} />
            </div>
          </div>

          {/* Footer buttons */}
          <div className="absolute bottom-0 left-0 w-[360px] p-4 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/95 to-transparent">
            <button onClick={() => window._inv_exportPDF()} className="portal-btn-primary w-full flex items-center justify-center gap-2 py-3 mb-2 text-sm font-bold">
              ↓ Export PDF
            </button>
            <button onClick={() => window._inv_resetForm()} className="portal-btn-ghost w-full py-2 text-xs">
              Reset form
            </button>
          </div>
        </div>

        {/* ── PREVIEW PANEL ── */}
        <div className="flex-1 overflow-y-auto bg-[#0d1526] flex justify-center py-10 px-6">
          <div id="invOuter" className="inv-outer">
            <div id="invoicePage" className="inv"></div>
          </div>
        </div>

      </div>
    </>
  )
}
