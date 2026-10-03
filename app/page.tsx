'use client';

import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Barcode from 'react-barcode';

interface ItemNota {
  id: string;
  nama: string;
  qty: number;
  harga: number;
}

export default function AplikasiNota() {
  // Profil Toko
  const [logo, setLogo] = useState<string | null>(null);
  const [namaToko, setNamaToko] = useState('TOKO BERKAH');
  const [alamat, setAlamat] = useState('Jl. Raya No. 123, Purwokerto');
  const [noTelp, setNoTelp] = useState('0812-3456-7890');
  const [noNota, setNoNota] = useState(`INV-${Date.now().toString().slice(-6)}`);
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);

  // Pengaturan Barcode & QRIS
  const [qrisPayload, setQrisPayload] = useState('https://link.dana.id/qr/contoh-toko');
  const [tampilkanQRIS, setTampilkanQRIS] = useState(true);
  const [tampilkanBarcode, setTampilkanBarcode] = useState(true);

  // Rincian Transaksi
  const [items, setItems] = useState<ItemNota[]>([
    { id: '1', nama: 'Barang A', qty: 1, harga: 15000 }
  ]);
  const [bayar, setBayar] = useState<number>(20000);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ambil logo tersimpan dari LocalStorage
  useEffect(() => {
    const savedLogo = localStorage.getItem('nota_logo');
    if (savedLogo) setLogo(savedLogo);
  }, []);

  const handleUploadLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file logo maksimal 2 MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogo(result);
        localStorage.setItem('nota_logo', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHapusLogo = () => {
    setLogo(null);
    localStorage.removeItem('nota_logo');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const tambahItem = () => {
    setItems([...items, { id: Date.now().toString(), nama: '', qty: 1, harga: 0 }]);
  };

  const updateItem = (id: string, field: keyof ItemNota, val: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: val } : item));
  };

  const hapusItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const total = items.reduce((acc, curr) => acc + (curr.qty * (curr.harga || 0)), 0);
  const kembalian = bayar - total;

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md print:shadow-none print:p-0 print:max-w-[80mm] print:mx-auto">
        
        {/* Panel Kontrol (Hanya tampil di layar, tidak ikut tercetak) */}
        <div className="mb-6 space-y-4 print:hidden border-b pb-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">Nota Digital</h1>
            <button 
              onClick={() => window.print()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition shadow-sm"
            >
              Cetak / Simpan PDF
            </button>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg border text-xs space-y-2">
            <span className="font-semibold text-gray-700 block">Pengaturan Tambahan:</span>
            
            {/* Input Upload Logo */}
            <div className="flex items-center gap-2">
              <label className="text-gray-600">Logo Toko:</label>
              <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                onChange={handleUploadLogo}
                className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {logo && (
                <button onClick={handleHapusLogo} className="text-red-500 hover:underline">
                  Hapus
                </button>
              )}
            </div>

            {/* Checkbox QRIS & Barcode */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={tampilkanQRIS} 
                  onChange={(e) => setTampilkanQRIS(e.target.checked)} 
                />
                Tampilkan QRIS
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={tampilkanBarcode} 
                  onChange={(e) => setTampilkanBarcode(e.target.checked)} 
                />
                Tampilkan Barcode Nota
              </label>
            </div>

            {tampilkanQRIS && (
              <div className="pt-1">
                <label className="block text-gray-600 mb-1">Payload / Link QRIS:</label>
                <input 
                  type="text" 
                  value={qrisPayload} 
                  onChange={(e) => setQrisPayload(e.target.value)}
                  placeholder="Isi teks atau link QRIS"
                  className="w-full border rounded px-2 py-1 bg-white focus:outline-blue-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* --- TAMPILAN FISIK NOTA (AREA CETAK) --- */}
        <div className="text-center border-b pb-3 mb-3">
          {logo && (
            <div className="flex justify-center mb-2">
              <img 
                src={logo} 
                alt="Logo Toko" 
                className="max-h-14 max-w-[120px] object-contain filter grayscale" 
              />
            </div>
          )}
          <input 
            type="text" 
            value={namaToko} 
            onChange={(e) => setNamaToko(e.target.value)}
            className="text-center font-bold text-lg w-full focus:outline-none focus:bg-blue-50 border-b border-transparent hover:border-gray-300"
          />
          <input 
            type="text" 
            value={alamat} 
            onChange={(e) => setAlamat(e.target.value)}
            className="text-center text-xs text-gray-600 w-full focus:outline-none focus:bg-blue-50 border-b border-transparent hover:border-gray-300"
          />
          <input 
            type="text" 
            value={noTelp} 
            onChange={(e) => setNoTelp(e.target.value)}
            className="text-center text-xs text-gray-600 w-full focus:outline-none focus:bg-blue-50 border-b border-transparent hover:border-gray-300"
          />
        </div>

        <div className="flex justify-between text-xs text-gray-700 mb-3">
          <div>No: <span className="font-mono font-semibold">{noNota}</span></div>
          <div>Tgl: {tanggal}</div>
        </div>

        {/* Tabel Barang */}
        <div className="border-t border-b border-dashed py-2 mb-3">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="text-left pb-1">Item</th>
                <th className="text-center pb-1 w-10">Qty</th>
                <th className="text-right pb-1 w-16">Harga</th>
                <th className="text-right pb-1 w-20">Subtotal</th>
                <th className="print:hidden w-6"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-1">
                    <input 
                      type="text" 
                      placeholder="Nama barang..."
                      value={item.nama} 
                      onChange={(e) => updateItem(item.id, 'nama', e.target.value)}
                      className="w-full focus:outline-none focus:bg-blue-50"
                    />
                  </td>
                  <td className="py-1 text-center">
                    <input 
                      type="number" 
                      min="1"
                      value={item.qty} 
                      onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value) || 0)}
                      className="w-8 text-center focus:outline-none focus:bg-blue-50"
                    />
                  </td>
                  <td className="py-1 text-right">
                    <input 
                      type="number" 
                      value={item.harga || ''} 
                      placeholder="0"
                      onChange={(e) => updateItem(item.id, 'harga', parseInt(e.target.value) || 0)}
                      className="w-16 text-right focus:outline-none focus:bg-blue-50"
                    />
                  </td>
                  <td className="py-1 text-right font-mono">
                    {(item.qty * item.harga).toLocaleString('id-ID')}
                  </td>
                  <td className="print:hidden text-center">
                    <button 
                      onClick={() => hapusItem(item.id)} 
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button 
            onClick={tambahItem}
            className="mt-2 text-xs text-blue-600 hover:underline print:hidden font-medium"
          >
            + Tambah Baris
          </button>
        </div>

        {/* Ringkasan Perhitungan */}
        <div className="space-y-1 text-xs">
          <div className="flex justify-between font-bold text-sm">
            <span>Total:</span>
            <span>Rp {total.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Bayar:</span>
            <input 
              type="number" 
              value={bayar || ''}
              onChange={(e) => setBayar(parseInt(e.target.value) || 0)}
              className="text-right w-24 border rounded px-1 py-0.5 text-xs focus:outline-none print:border-none"
            />
          </div>
          <div className="flex justify-between">
            <span>Kembali:</span>
            <span className="font-mono">Rp {Math.max(0, kembalian).toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* Area QRIS & Barcode */}
        <div className="mt-4 pt-3 border-t border-dashed flex flex-col items-center justify-center space-y-3">
          {tampilkanQRIS && qrisPayload && (
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-gray-500 mb-1 font-medium tracking-wider">SCAN UNTUK BAYAR (QRIS)</span>
              <div className="p-1 bg-white border border-gray-200 rounded">
                <QRCodeSVG value={qrisPayload} size={96} level="M" />
              </div>
            </div>
          )}

          {tampilkanBarcode && noNota && (
            <div className="flex flex-col items-center">
              <Barcode 
                value={noNota} 
                width={1.2} 
                height={30} 
                fontSize={10} 
                margin={0} 
                displayValue={true} 
              />
            </div>
          )}
        </div>

        {/* Catatan Kaki */}
        <div className="mt-4 text-center text-[10px] text-gray-500 border-t pt-2">
          <p>Terima kasih atas kunjungan Anda!</p>
          <p>Barang yang sudah dibeli tidak dapat ditukar/dikembalikan.</p>
        </div>

      </div>
    </div>
  );
}
