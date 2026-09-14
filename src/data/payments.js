// Edit this file to add/remove payment proof screenshots or records.
// `coingeckoId` is used to pull the live price + chart for that asset.

export const paymentAssets = [
  {
    id: 'usdt',
    name: 'USDT',
    fullName: 'Tether',
    coingeckoId: 'tether',
    accent: '#26a17b',
    screenshots: ['/proofs/usdt-1.png', '/proofs/usdt-2.png'],
    records: [
      { amount: '+188.1', unit: 'USDT', date: '02/23/2026 16:56:14' },
      { amount: '+5.02', unit: 'USDT', date: '02/19/2026 21:54:33' },
      { amount: '+5.21', unit: 'USDT', date: '01/03/2026 11:25:03' },
      { amount: '+20.83', unit: 'USDT', date: '01/02/2026 11:46:10' },
      { amount: '+4.62', unit: 'USDT', date: '08/14/2026 09:12:44' },
      { amount: '+4.62', unit: 'USDT', date: '08/09/2026 14:03:21' },
      { amount: '+4.62', unit: 'USDT', date: '08/05/2026 19:47:02' },
      { amount: '+6.93', unit: 'USDT', date: '08/01/2026 10:15:38' },
    ],
  },
  {
    id: 'ltc',
    name: 'LTC',
    fullName: 'Litecoin',
    coingeckoId: 'litecoin',
    accent: '#345d9d',
    screenshots: ['/proofs/ltc-1.png'],
    records: [
      { amount: '+0.21471335', unit: 'LTC', date: '02/24/2026 16:11:20' },
      { amount: '+0.09398794', unit: 'LTC', date: '02/24/2026 13:07:06' },
      { amount: '+3.76291343', unit: 'LTC', date: '02/23/2026 16:34:28' },
    ],
  },
]
