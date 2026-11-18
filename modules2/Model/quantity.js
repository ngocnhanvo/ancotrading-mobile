// Quantity Items and outer packs are independent inputs. Server quantities are in items.
export const getTotalQuantity = (item = {}) => {
  const qty = Number(item.qty == null ? 0 : item.qty);
  const packs = Number(item.qtyPallet == null ? 0 : item.qtyPallet);
  const outer = Number(item.slOuter == null ? 0 : item.slOuter);
  if (!Number.isInteger(qty) || qty < 0 || !Number.isInteger(packs) || packs < 0) {
    return null;
  }
  if (packs > 0 && (!Number.isInteger(outer) || outer <= 0)) {
    return null;
  }
  const total = qty + packs * (packs > 0 ? outer : 0);
  return Number.isSafeInteger(total) ? total : null;
};

export const validateQuantity = (item = {}, max = 99999999) => {
  const qty = Number(item.qty == null ? 0 : item.qty);
  const packs = Number(item.qtyPallet == null ? 0 : item.qtyPallet);
  if (!Number.isInteger(qty) || qty < 0 || !Number.isInteger(packs) || packs < 0) {
    return 'Quantity Items and Quantity Pallet/thùng/kiện must be non-negative whole numbers.';
  }
  if (qty > max || packs > max) {
    return `Quantity must not exceed ${max}.`;
  }
  if (qty === 0 && packs === 0) {
    return 'Enter Quantity Items or Quantity Pallet/thùng/kiện.';
  }
  const total = getTotalQuantity(item);
  if (total === null) {
    return 'SL Outer is missing or invalid for this product. Refresh product data before adding pallets/thùng/kiện.';
  }
  if (total > max) {
    return `Total quantity after SL Outer conversion must not exceed ${max}.`;
  }
  return null;
};

const toPriceNumber = value => {
  const result = Number(String(value == null ? 0 : value).replace(/[,\s$]/g, ''));
  return Number.isFinite(result) ? result : 0;
};

export const getLineAmount = item => {
  const total = getTotalQuantity(item);
  return total === null ? null : Math.round(total * toPriceNumber(item.price) * 100) / 100;
};

// API cbm is the volume of one OUTER pack, not one loose item.
// Loose items contribute qty/slOuter packs; entered outer packs contribute directly.
const toCbmNumber = value => {
  // Old SQLite rows may contain decimal-comma values, e.g. "0,071".
  // API now emits decimal dots, but both formats must calculate identically.
  const cbm = Number(String(value == null ? 0 : value).trim().replace(',', '.'));
  return Number.isFinite(cbm) ? cbm : 0;
};

export const getLineCbm = (item = {}) => {
  const qty = Number(item.qty == null ? 0 : item.qty);
  const packs = Number(item.qtyPallet == null ? 0 : item.qtyPallet);
  const outer = Number(item.slOuter == null ? 0 : item.slOuter);
  if (getTotalQuantity(item) === null) return null;
  if (qty === 0 && packs === 0) return 0;
  if (!Number.isFinite(outer) || outer <= 0) return null;
  const cbm = (qty / outer + packs) * toCbmNumber(item.cbm);
  return Math.round((cbm + Number.EPSILON) * 1000000) / 1000000;
};
