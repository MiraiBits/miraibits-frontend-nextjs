'use client';

import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { useCart } from '../lib/cart';
import { getProductById } from '../lib/products';
import { formatCurrencyLKR } from '../lib/currency';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#f0f0f0',
    padding: 5,
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  tableCellHeader: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  tableCell: {
    fontSize: 10,
  },
  total: {
    marginTop: 20,
    textAlign: 'right',
    fontSize: 14,
  },
});

export default function CartPDF({ items, totalPrice }: { items: ReturnType<typeof useCart>['items'], totalPrice: number }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Your Cart</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Product</Text></View>
            <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Price</Text></View>
            <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Quantity</Text></View>
            <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Subtotal</Text></View>
          </View>
          {items.map(it => {
            const p = getProductById(it.productId)!;
            const subtotal = p.price * it.quantity;
            return (
              <View style={styles.tableRow} key={it.productId}>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{p.name}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{formatCurrencyLKR(p.price)}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{it.quantity}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{formatCurrencyLKR(subtotal)}</Text></View>
              </View>
            );
          })}
        </View>
        <Text style={styles.total}>Total: {formatCurrencyLKR(totalPrice)}</Text>
      </Page>
    </Document>
  );
}
