'use client';

import React from "react";
import QRCode from "react-qr-code";

export function QRBlock({ label, url }: { label: string; url: string; }) {
  return (
    <div className="flex flex-col items-center gap-2 p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="bg-white p-3 rounded-xl">
        <QRCode value={url} size={140} />
      </div>
      <div className="text-xs text-gray-500 break-all text-center max-w-[220px]">{url}</div>
    </div>
  );
}
