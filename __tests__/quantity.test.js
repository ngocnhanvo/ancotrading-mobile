import {getTotalQuantity, validateQuantity, getLineAmount, getLineCbm} from '../modules2/Model/quantity';

describe('Quantity Items + Pallet/thùng/kiện × SL Outer', () => {
  test('single outer pack and no loose items', () => {
    const row = {qty: 0, qtyPallet: 1, slOuter: 12, price: '10', cbm: '0.071'};
    expect(getTotalQuantity(row)).toBe(12);
    expect(getLineAmount(row)).toBe(120);
    expect(getLineCbm(row)).toBe(0.071);
    expect(validateQuantity(row)).toBeNull();
  });
  test('mixes loose items and outer packs', () => {
    const row = {qty: 5, qtyPallet: 3, slOuter: 12, price: '10.25'};
    expect(getTotalQuantity(row)).toBe(41);
    expect(getLineAmount(row)).toBe(420.25);
  });
  test('CBM for loose items uses qty / SL Outer, not qty * CBM Outer', () => {
    expect(getLineCbm({qty: 18, qtyPallet: 0, slOuter: 36, cbm: '0.071'})).toBe(0.0355);
    expect(getLineCbm({qty: 36, qtyPallet: 0, slOuter: 36, cbm: '0.071'})).toBe(0.071);
  });
  test('CBM for pallets uses qtyPallet * CBM Outer', () => {
    expect(getLineCbm({qty: 0, qtyPallet: 2, slOuter: 36, cbm: '0.071'})).toBe(0.142);
  });
  test('CBM for mixed quantities sums both contributions', () => {
    expect(getLineCbm({qty: 18, qtyPallet: 2, slOuter: 36, cbm: '0.071'})).toBe(0.1775);
    expect(getLineCbm({qty: 18, qtyPallet: 2, slOuter: 36, cbm: '0,071'})).toBe(0.1775);
    expect(getTotalQuantity({qty: 18, qtyPallet: 2, slOuter: 36})).toBe(90);
  });
  test('missing SL Outer must not silently produce a wrong CBM', () => {
    expect(getLineCbm({qty: 5, qtyPallet: 0, slOuter: 0, cbm: '0.071'})).toBeNull();
    expect(getLineCbm({qty: 0, qtyPallet: 1, slOuter: 0, cbm: '0.071'})).toBeNull();
  });
  test('zero total quantity has zero CBM', () => {
    expect(getLineCbm({qty: 0, qtyPallet: 0, slOuter: 0, cbm: '0.071'})).toBe(0);
  });
  test('legacy items without pallets do not need SL Outer', () => {
    expect(getTotalQuantity({qty: 2, qtyPallet: 0})).toBe(2);
    expect(validateQuantity({qty: 2, qtyPallet: 0})).toBeNull();
  });
  test('missing outer with pallets is rejected rather than silently pricing items only', () => {
    expect(getTotalQuantity({qty: 3, qtyPallet: 1, slOuter: 0})).toBeNull();
    expect(validateQuantity({qty: 3, qtyPallet: 1, slOuter: 0})).toMatch(/SL Outer/);
  });
  test('rejects empty and negative lines', () => {
    expect(validateQuantity({qty: 0, qtyPallet: 0})).toMatch(/Enter/);
    expect(validateQuantity({qty: -1, qtyPallet: 0})).toMatch(/non-negative/);
  });
  test('limits converted quantity to the configured maximum', () => {
    expect(validateQuantity({qty: 1, qtyPallet: 100, slOuter: 12}, 1000)).toMatch(/Total quantity/);
  });
});
