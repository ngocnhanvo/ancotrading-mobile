import {getTotalQuantity, validateQuantity, getLineAmount, getLineCbm} from '../modules2/Model/quantity';

describe('Quantity Items + Pallet/thùng/kiện × SL Outer', () => {
  test('single outer pack and no loose items', () => {
    const row = {qty: 0, qtyPallet: 1, slOuter: 12, price: '10', cbm: '0.071'};
    expect(getTotalQuantity(row)).toBe(12);
    expect(getLineAmount(row)).toBe(120);
    expect(getLineCbm(row)).toBe(0.852);
    expect(validateQuantity(row)).toBeNull();
  });
  test('mixes loose items and outer packs', () => {
    const row = {qty: 5, qtyPallet: 3, slOuter: 12, price: '10.25'};
    expect(getTotalQuantity(row)).toBe(41);
    expect(getLineAmount(row)).toBe(420.25);
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
