import React, { useState, useEffect } from 'react';
import {
  Receipt,
  Printer,
  Download,
  Calculator,
  RotateCcw,
  X,
  Flame,
  Users,
  History,
  Trash2,
  Sparkles,
} from 'lucide-react';
import './App.css';

const PRICES = {
  adult: 299,
  child: 89,
  refill: 29,
  water: 10,
  soda: 25,
};

const DISCOUNTS = [
  { label: 'ไม่มีส่วนลด', value: 0 },
  { label: 'บัตรสมาชิก ลด 5%', value: 0.05 },
  { label: 'โปรโมชั่น ลด 10%', value: 0.1 },
  { label: 'โปรฯ เทศกาลคริสต์มาส ลด 15% 🎄', value: 0.15 },
  { label: 'บัตร VIP ลด 20%', value: 0.2 },
];

const THEMES = {
  default: {
    id: 'default',
    name: 'ปกติ',
    icon: '🔥',
    banner: '',
    greeting: 'ขอบคุณที่ใช้บริการ แซ่บโอชา หมูกระทะ',
    particles: [],
    canvasBorder: '#cbd5e1',
    canvasHeader: '#ea580c',
    canvasTotal: '#4338ca',
    canvasDecor: '',
  },
  christmas: {
    id: 'christmas',
    name: 'คริสต์มาส',
    icon: '🎄',
    banner: '🎄 Merry Christmas & Happy Holidays 🎅',
    greeting: 'Merry Christmas! สุขสันต์วันคริสต์มาส 🎄🎅',
    particles: ['❄️', '❅', '❆', '✨', '❄️', '🎄', '❄️', '❅'],
    canvasBorder: '#b91c1c',
    canvasHeader: '#b91c1c',
    canvasTotal: '#15803d',
    canvasDecor: '❄️   🎄   🎅   🎁   ❄️',
  },
  newyear: {
    id: 'newyear',
    name: 'ปีใหม่',
    icon: '🎉',
    banner: '✨ Happy New Year สวัสดีปีใหม่ 🎉',
    greeting: 'Happy New Year! ขอให้มีความสุขตลอดปี 🎉✨',
    particles: ['✨', '🎉', '⭐', '🎊', '✨', '💫'],
    canvasBorder: '#d97706',
    canvasHeader: '#1e3a8a',
    canvasTotal: '#b45309',
    canvasDecor: '✨   🎉   🥂   🎆   ✨',
  },
  songkran: {
    id: 'songkran',
    name: 'สงกรานต์',
    icon: '💦',
    banner: '💦 สุขสันต์วันสงกรานต์ เย็นฉ่ำทั่วไทย 🌺',
    greeting: 'สุขสันต์วันสงกรานต์ เดินทางปลอดภัยครับ 💦🌺',
    particles: ['💦', '💧', '🌺', '🌼', '💦', '💧'],
    canvasBorder: '#0284c7',
    canvasHeader: '#0369a1',
    canvasTotal: '#0284c7',
    canvasDecor: '💦   🌺   💦   🌼   💦',
  },
};

// ตำแหน่งแอนิเมชันคงที่ เพื่อไม่ให้กระตุกตอนพิมพ์ตัวเลขในฟอร์ม
const PARTICLE_SLOTS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${(i * 19 + 7) % 96}%`,
  duration: `${6 + (i % 5) * 1.6}s`,
  delay: `${(i * 0.7) % 5}s`,
  size: `${14 + (i % 3) * 5}px`,
}));

export default function App() {
  const [themeKey, setThemeKey] = useState('christmas'); // ค่าเริ่มต้นเป็นธีมคริสต์มาส
  const [tableNo, setTableNo] = useState('โต๊ะ 1');
  const [adults, setAdults] = useState('');
  const [children, setChildren] = useState('');
  const [drinkType, setDrinkType] = useState('refill');
  const [waterQty, setWaterQty] = useState('');
  const [sodaQty, setSodaQty] = useState('');
  const [discountRate, setDiscountRate] = useState(0);

  const [totalAmount, setTotalAmount] = useState(0);
  const [currentBill, setCurrentBill] = useState(null);
  const [splitCount, setSplitCount] = useState(1);
  const [billHistory, setBillHistory] = useState([]);
  const [billCounter, setBillCounter] = useState(1);

  const activeTheme = THEMES[themeKey] || THEMES.default;

  useEffect(() => {
    const savedHistory = localStorage.getItem('zaabocha_bills');
    const savedCounter = localStorage.getItem('zaabocha_counter');
    if (savedHistory) {
      setBillHistory(JSON.parse(savedHistory));
    }
    if (savedCounter) {
      setBillCounter(Number(savedCounter));
    }
  }, []);

  const calculateDetails = () => {
    const adultCount = Math.max(0, parseInt(adults, 10) || 0);
    const childCount = Math.max(0, parseInt(children, 10) || 0);
    const totalPeople = adultCount + childCount;

    const adultFoodTotal = adultCount * PRICES.adult;
    const childFoodTotal = childCount * PRICES.child;
    const foodSubtotal = adultFoodTotal + childFoodTotal;

    const discountAmount = foodSubtotal * discountRate;
    const foodAfterDiscount = foodSubtotal - discountAmount;

    let drinkTotal = 0;
    let waterCount = 0;
    let sodaCount = 0;

    if (drinkType === 'refill') {
      drinkTotal = totalPeople * PRICES.refill;
    } else {
      waterCount = Math.max(0, parseInt(waterQty, 10) || 0);
      sodaCount = Math.max(0, parseInt(sodaQty, 10) || 0);
      drinkTotal = waterCount * PRICES.water + sodaCount * PRICES.soda;
    }

    const grandTotal = foodAfterDiscount + drinkTotal;

    return {
      adultCount,
      childCount,
      totalPeople,
      adultFoodTotal,
      childFoodTotal,
      foodSubtotal,
      discountRate,
      discountAmount,
      foodAfterDiscount,
      drinkType,
      waterCount,
      sodaCount,
      drinkTotal,
      grandTotal,
    };
  };

  const handleCalculate = () => {
    const details = calculateDetails();
    setTotalAmount(details.grandTotal);
  };

  const handleReset = () => {
    setTableNo('โต๊ะ 1');
    setAdults('');
    setChildren('');
    setDrinkType('refill');
    setWaterQty('');
    setSodaQty('');
    setDiscountRate(0);
    setTotalAmount(0);
  };

  const handleIssueBill = () => {
    const details = calculateDetails();
    if (details.totalPeople === 0 && details.drinkTotal === 0) {
      alert('กรุณากรอกจำนวนลูกค้าหรือรายการเครื่องดื่มก่อนออกบิลครับ');
      return;
    }

    setTotalAmount(details.grandTotal);

    const now = new Date();
    const endTime = new Date(now.getTime() + 90 * 60000);

    const formatTime = (date) =>
      date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    const formatDate = (date) =>
      date.toLocaleDateString('th-TH', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

    const billId = `BILL-${String(billCounter).padStart(4, '0')}`;
    const discountObj = DISCOUNTS.find((d) => d.value === discountRate);

    const newBill = {
      id: billId,
      tableNo: tableNo.trim() || 'ไม่ระบุโต๊ะ',
      date: formatDate(now),
      startTime: formatTime(now),
      endTime: formatTime(endTime),
      discountLabel: discountObj ? discountObj.label : 'ไม่มีส่วนลด',
      themeId: themeKey,
      ...details,
    };

    const nextCounter = billCounter + 1;
    const updatedHistory = [newBill, ...billHistory].slice(0, 20);

    setBillCounter(nextCounter);
    setBillHistory(updatedHistory);
    setSplitCount(Math.max(1, details.totalPeople));
    setCurrentBill(newBill);

    localStorage.setItem('zaabocha_bills', JSON.stringify(updatedHistory));
    localStorage.setItem('zaabocha_counter', String(nextCounter));
  };

  const handleClearHistory = () => {
    setBillHistory([]);
    localStorage.removeItem('zaabocha_bills');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadImage = () => {
    if (!currentBill) return;

    const billTheme = THEMES[currentBill.themeId] || activeTheme;
    const hasDecor = Boolean(billTheme.canvasDecor);

    const canvas = document.createElement('canvas');
    const width = 460;
    const height = hasDecor ? 765 : 720;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = billTheme.canvasBorder;
    ctx.lineWidth = hasDecor ? 4 : 2;
    ctx.strokeRect(12, 12, width - 24, height - 24);

    let y = 48;
    const centerText = (text, font, color = '#1e293b') => {
      ctx.font = font;
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.fillText(text, width / 2, y);
    };

    const rowText = (left, right, font = '15px sans-serif', color = '#334155') => {
      ctx.font = font;
      ctx.fillStyle = color;
      ctx.textAlign = 'left';
      ctx.fillText(left, 32, y);
      ctx.textAlign = 'right';
      ctx.fillText(right, width - 32, y);
      y += 28;
    };

    const drawDivider = () => {
      ctx.strokeStyle = '#94a3b8';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(32, y - 10);
      ctx.lineTo(width - 32, y - 10);
      ctx.stroke();
      ctx.setLineDash([]);
      y += 14;
    };

    if (hasDecor) {
      centerText(billTheme.canvasDecor, '18px sans-serif');
      y += 28;
    }

    centerText('แซ่บโอชา หมูกระทะ', 'bold 24px sans-serif', billTheme.canvasHeader);
    y += 25;
    centerText('ใบเสร็จรับเงิน / ใบแจ้งค่าอาหาร', '14px sans-serif', '#64748b');
    y += 30;

    drawDivider();

    rowText(`เลขที่บิล: ${currentBill.id}`, `วันที่: ${currentBill.date}`, '14px sans-serif');
    rowText(
      `หมายเลขโต๊ะ: ${currentBill.tableNo}`,
      `เวลา: ${currentBill.startTime} - ${currentBill.endTime} น.`,
      'bold 14px sans-serif'
    );

    drawDivider();

    if (currentBill.adultCount > 0) {
      rowText(
        `บุฟเฟต์ผู้ใหญ่ (${currentBill.adultCount} x 299)`,
        `${currentBill.adultFoodTotal.toFixed(2)} ฿`
      );
    }
    if (currentBill.childCount > 0) {
      rowText(
        `บุฟเฟต์เด็ก (${currentBill.childCount} x 89)`,
        `${currentBill.childFoodTotal.toFixed(2)} ฿`
      );
    }
    if (currentBill.drinkType === 'refill' && currentBill.totalPeople > 0) {
      rowText(
        `น้ำรีฟิล (${currentBill.totalPeople} x 29)`,
        `${currentBill.drinkTotal.toFixed(2)} ฿`
      );
    } else {
      if (currentBill.waterCount > 0) {
        rowText(
          `น้ำเปล่า (${currentBill.waterCount} x 10)`,
          `${(currentBill.waterCount * PRICES.water).toFixed(2)} ฿`
        );
      }
      if (currentBill.sodaCount > 0) {
        rowText(
          `น้ำอัดลม (${currentBill.sodaCount} x 25)`,
          `${(currentBill.sodaCount * PRICES.soda).toFixed(2)} ฿`
        );
      }
    }

    drawDivider();

    rowText('รวมค่าอาหาร', `${currentBill.foodSubtotal.toFixed(2)} ฿`);
    rowText(
      `ส่วนลด (${currentBill.discountLabel})`,
      `-${currentBill.discountAmount.toFixed(2)} ฿`,
      '15px sans-serif',
      '#dc2626'
    );
    rowText('รวมค่าเครื่องดื่ม', `${currentBill.drinkTotal.toFixed(2)} ฿`);

    y += 6;
    drawDivider();

    rowText(
      'ยอดชำระทั้งหมด',
      `${currentBill.grandTotal.toFixed(2)} บาท`,
      'bold 20px sans-serif',
      billTheme.canvasTotal
    );

    if (splitCount > 1) {
      rowText(
        `หารเฉลี่ย (${splitCount} คน)`,
        `คนละ ${(currentBill.grandTotal / splitCount).toFixed(2)} บาท`,
        'bold 14px sans-serif',
        '#059669'
      );
    }

    y += 22;
    centerText(billTheme.greeting, 'bold 14px sans-serif', billTheme.canvasHeader);

    const link = document.createElement('a');
    link.download = `${currentBill.id}_${currentBill.tableNo}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const modalTheme = currentBill
    ? THEMES[currentBill.themeId] || activeTheme
    : activeTheme;

  return (
    <div className={`page-wrapper theme-${themeKey}`}>
      {/* เอฟเฟกต์ลูกเล่นเทศกาล (หิมะตก / พลุ / หยดน้ำ) */}
      {activeTheme.particles.length > 0 && (
        <div className="festival-particles no-print" aria-hidden="true">
          {PARTICLE_SLOTS.map((slot) => (
            <span
              key={slot.id}
              className="particle-item"
              style={{
                left: slot.left,
                animationDuration: slot.duration,
                animationDelay: slot.delay,
                fontSize: slot.size,
              }}
            >
              {activeTheme.particles[slot.id % activeTheme.particles.length]}
            </span>
          ))}
        </div>
      )}

      {/* การ์ดคำนวณหลัก */}
      <div className="calculator-card no-print">
        {/* แถบเลือกธีมเทศกาล */}
        <div className="theme-bar">
          <span className="theme-bar-label">
            <Sparkles size={14} /> ธีมเทศกาล:
          </span>
          <div className="theme-pills">
            {Object.values(THEMES).map((t) => (
              <button
                key={t.id}
                type="button"
                className={`theme-pill ${themeKey === t.id ? 'active' : ''}`}
                onClick={() => setThemeKey(t.id)}
              >
                {t.icon} {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* ป้ายแบนเนอร์เทศกาล */}
        {activeTheme.banner && (
          <div className="festival-banner">{activeTheme.banner}</div>
        )}

        <div className="header-section">
          <h1>Buffet Calculator</h1>
          <p className="subtitle">คำนวณค่าอาหารบุฟเฟต์</p>

          {/* โลโก้ร้านแซ่บโอชา หมูกระทะ */}
          <div className="brand-logo">
            <div className="flame-badge">
              {themeKey === 'christmas' && <span className="santa-hat">🎅</span>}
              <Flame size={26} color="#ffffff" fill="#f97316" />
            </div>
            <div className="brand-title">
              แซ่บโอชา {themeKey === 'christmas' ? '🎄' : ''}
            </div>
            <div className="brand-sub">หมูกระทะ</div>
          </div>
        </div>

        <div className="form-group">
          <label>หมายเลขโต๊ะ</label>
          <input
            type="text"
            value={tableNo}
            onChange={(e) => setTableNo(e.target.value)}
            placeholder="เช่น โต๊ะ 1"
          />
        </div>

        <div className="form-group">
          <label>จำนวนผู้ใหญ่ (คนละ 299 บาท)</label>
          <input
            type="number"
            min="0"
            value={adults}
            onChange={(e) => setAdults(e.target.value)}
            placeholder="0"
          />
        </div>

        <div className="form-group">
          <label>จำนวนเด็ก (คนละ 89 บาท)</label>
          <input
            type="number"
            min="0"
            value={children}
            onChange={(e) => setChildren(e.target.value)}
            placeholder="0"
          />
        </div>

        {/* กรอบเครื่องดื่ม */}
        <fieldset className="drink-fieldset">
          <legend>เครื่องดื่ม</legend>

          <label className="radio-label">
            <input
              type="radio"
              name="drinkType"
              checked={drinkType === 'refill'}
              onChange={() => setDrinkType('refill')}
            />
            <span>น้ำรีฟิล คนละ 29 บาท (ผู้ใหญ่และเด็ก)</span>
          </label>

          <label className="radio-label">
            <input
              type="radio"
              name="drinkType"
              checked={drinkType === 'bottle'}
              onChange={() => setDrinkType('bottle')}
            />
            <span>เครื่องดื่มแบบขวด</span>
          </label>

          <div className="bottle-inputs">
            <div className="form-group">
              <label>น้ำเปล่า (ขวดละ 10 บาท)</label>
              <input
                type="number"
                min="0"
                disabled={drinkType !== 'bottle'}
                value={waterQty}
                onChange={(e) => setWaterQty(e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="form-group">
              <label>น้ำอัดลม (ขวดละ 25 บาท)</label>
              <input
                type="number"
                min="0"
                disabled={drinkType !== 'bottle'}
                value={sodaQty}
                onChange={(e) => setSodaQty(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
        </fieldset>

        {/* บัตรส่วนลด */}
        <div className="form-group">
          <label>บัตรส่วนลด</label>
          <select
            value={discountRate}
            onChange={(e) => setDiscountRate(parseFloat(e.target.value))}
          >
            {DISCOUNTS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
          <small className="helper-text">ลดเฉพาะค่าอาหารทั้งหมด ไม่รวมเครื่องดื่ม</small>
        </div>

        {/* ปุ่มคำสั่ง */}
        <div className="button-group">
          <button type="button" className="btn btn-calc" onClick={handleCalculate}>
            <Calculator size={16} /> คำนวณ
          </button>
          <button type="button" className="btn btn-reset" onClick={handleReset}>
            <RotateCcw size={16} /> รีเซ็ต
          </button>
          <button type="button" className="btn btn-bill" onClick={handleIssueBill}>
            <Receipt size={16} /> ออกบิล
          </button>
        </div>

        {/* กล่องแสดงยอดรวม */}
        <div className="total-box">
          ยอดชำระทั้งหมด:{' '}
          <span className="total-price">
            {totalAmount.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>{' '}
          บาท
        </div>

        {/* ประวัติการออกบิลย้อนหลัง */}
        {billHistory.length > 0 && (
          <div className="history-section">
            <div className="history-header">
              <span>
                <History size={15} /> ประวัติการออกบิลล่าสุด ({billHistory.length})
              </span>
              <button
                type="button"
                className="btn-clear-history"
                onClick={handleClearHistory}
              >
                <Trash2 size={13} /> ล้างประวัติ
              </button>
            </div>
            <div className="history-list">
              {billHistory.map((item) => (
                <div
                  key={item.id}
                  className="history-item"
                  onClick={() => {
                    setCurrentBill(item);
                    setSplitCount(Math.max(1, item.totalPeople));
                  }}
                >
                  <div>
                    <strong>{item.id}</strong> • {item.tableNo}{' '}
                    {THEMES[item.themeId]?.icon || ''}
                    <div className="history-time">เวลา {item.startTime} น.</div>
                  </div>
                  <div className="history-amount">{item.grandTotal.toFixed(2)} ฿</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* หน้าต่าง Pop-up ใบเสร็จรับเงิน */}
      {currentBill && (
        <div className="modal-overlay">
          <div className={`modal-container theme-${modalTheme.id}`}>
            <button
              type="button"
              className="modal-close no-print"
              onClick={() => setCurrentBill(null)}
            >
              <X size={20} />
            </button>

            <div className="receipt-paper" id="receipt-area">
              {modalTheme.canvasDecor && (
                <div className="receipt-decor">{modalTheme.canvasDecor}</div>
              )}

              <div className="receipt-header">
                <div className="flame-badge small">
                  <Flame size={20} color="#ffffff" fill="#f97316" />
                </div>
                <h2>แซ่บโอชา หมูกระทะ</h2>
                <p>ใบเสร็จรับเงิน / ใบแจ้งค่าอาหาร</p>
              </div>

              <div className="receipt-meta">
                <div>
                  <span>เลขที่บิล:</span> <strong>{currentBill.id}</strong>
                </div>
                <div>
                  <span>วันที่:</span> <span>{currentBill.date}</span>
                </div>
                <div>
                  <span>โต๊ะ:</span> <strong>{currentBill.tableNo}</strong>
                </div>
                <div>
                  <span>รอบเวลา:</span>{' '}
                  <strong>
                    {currentBill.startTime} - {currentBill.endTime} น.
                  </strong>
                </div>
              </div>

              <hr className="dashed-line" />

              <div className="receipt-items">
                {currentBill.adultCount > 0 && (
                  <div className="receipt-row">
                    <span>บุฟเฟต์ผู้ใหญ่ ({currentBill.adultCount} x 299)</span>
                    <span>{currentBill.adultFoodTotal.toFixed(2)}</span>
                  </div>
                )}
                {currentBill.childCount > 0 && (
                  <div className="receipt-row">
                    <span>บุฟเฟต์เด็ก ({currentBill.childCount} x 89)</span>
                    <span>{currentBill.childFoodTotal.toFixed(2)}</span>
                  </div>
                )}
                {currentBill.drinkType === 'refill' && currentBill.totalPeople > 0 && (
                  <div className="receipt-row">
                    <span>น้ำรีฟิล ({currentBill.totalPeople} x 29)</span>
                    <span>{currentBill.drinkTotal.toFixed(2)}</span>
                  </div>
                )}
                {currentBill.drinkType === 'bottle' && currentBill.waterCount > 0 && (
                  <div className="receipt-row">
                    <span>น้ำเปล่า ({currentBill.waterCount} x 10)</span>
                    <span>{(currentBill.waterCount * PRICES.water).toFixed(2)}</span>
                  </div>
                )}
                {currentBill.drinkType === 'bottle' && currentBill.sodaCount > 0 && (
                  <div className="receipt-row">
                    <span>น้ำอัดลม ({currentBill.sodaCount} x 25)</span>
                    <span>{(currentBill.sodaCount * PRICES.soda).toFixed(2)}</span>
                  </div>
                )}
              </div>

              <hr className="dashed-line" />

              <div className="receipt-summary">
                <div className="receipt-row">
                  <span>รวมค่าอาหาร</span>
                  <span>{currentBill.foodSubtotal.toFixed(2)} ฿</span>
                </div>
                <div className="receipt-row discount-text">
                  <span>ส่วนลด ({currentBill.discountLabel})</span>
                  <span>-{currentBill.discountAmount.toFixed(2)} ฿</span>
                </div>
                <div className="receipt-row">
                  <span>รวมค่าเครื่องดื่ม</span>
                  <span>{currentBill.drinkTotal.toFixed(2)} ฿</span>
                </div>
              </div>

              <hr className="dashed-line" />

              <div className="receipt-grand-total">
                <span>ยอดชำระทั้งหมด</span>
                <span>{currentBill.grandTotal.toFixed(2)} บาท</span>
              </div>

              {/* ระบบหารค่าอาหาร */}
              <div className="split-bill-box">
                <div className="split-controls no-print">
                  <span>
                    <Users size={14} /> หารค่าอาหาร:
                  </span>
                  <div className="split-stepper">
                    <button
                      type="button"
                      onClick={() => setSplitCount((prev) => Math.max(1, prev - 1))}
                    >
                      -
                    </button>
                    <span>{splitCount} คน</span>
                    <button
                      type="button"
                      onClick={() => setSplitCount((prev) => prev + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                {splitCount > 1 && (
                  <div className="split-result">
                    หาร {splitCount} คน ตกคนละ{' '}
                    <strong>{(currentBill.grandTotal / splitCount).toFixed(2)} บาท</strong>
                  </div>
                )}
              </div>

              <div className="receipt-footer">
                <p className="receipt-greeting">{modalTheme.greeting}</p>
              </div>
            </div>

            <div className="modal-actions no-print">
              <button type="button" className="btn btn-print" onClick={handlePrint}>
                <Printer size={16} /> พิมพ์ / บันทึก PDF
              </button>
              <button
                type="button"
                className="btn btn-download"
                onClick={handleDownloadImage}
              >
                <Download size={16} /> บันทึกรูปสลิป (.PNG)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}