import { FormEvent, useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Camera,
  Copy,
  ExternalLink,
  LockKeyhole,
  Menu,
  Minus,
  PackageCheck,
  Plus,
  Shirt,
  Sparkles,
  SprayCan,
  Star,
  Trash2,
  TriangleAlert,
  X,
} from 'lucide-react'
import heroImage from './assets/bersih-sepatu-hero.webp?inline'

// Link Google Form pemesanan.
const GOOGLE_FORM_URL = 'https://forms.gle/RtxsPZbzW3LaKEAr8'
// Link kontak.
const WHATSAPP_URL = 'https://wa.me/6282342346911'
const INSTAGRAM_URL = 'https://www.instagram.com/bersih_sepatu_official?bqrl=ZjduemExY2tmejMy'
// Catatan: password frontend hanya untuk demo. Gunakan autentikasi backend untuk keamanan produksi.
const ADMIN_PASSWORD = 'SoleCare#2604'

type Page = 'home' | 'order' | 'confirm' | 'ruang-admin-solecare'
type ServiceType = 'Basic' | 'Deep' | 'Fast'
type OrderStatus = 'Pesanan diterima' | 'Menunggu pembayaran' | 'Sedang dibersihkan' | 'Quality check' | 'Siap diambil' | 'Selesai'
type Order = {
  code: string
  name: string
  phone: string
  item: string
  service: ServiceType | 'Perawatan Tas'
  price: number
  status: OrderStatus
  date: string
  note: string
}

const STORAGE_KEY = 'solecare-orders'
const statuses: OrderStatus[] = [
  'Pesanan diterima',
  'Menunggu pembayaran',
  'Sedang dibersihkan',
  'Quality check',
  'Siap diambil',
  'Selesai',
]

const shoePrices = [
  { name: 'Sepatu biasa', detail: 'Sneakers, kanvas, mesh, knit', Basic: 35000, Deep: 50000, Fast: 55000 },
  { name: 'Sepatu leather', detail: 'Kulit asli atau sintetis', Basic: 45000, Deep: 55000, Fast: 60000 },
  { name: 'Sepatu suede/nubuck', detail: 'Perawatan material sensitif', Basic: 50000, Deep: 60000, Fast: 65000 },
  { name: 'Sepatu anak-anak', detail: 'Ukuran anak hingga 12 tahun', Basic: 25000, Deep: 35000, Fast: 40000 },
]

const bagPrices = [
  { name: 'Tas canvas/kain', price: 115000 },
  { name: 'Tas leather', price: 150000 },
  { name: 'Tas suede', price: 200000 },
]

const services = [
  {
    name: 'Basic Cleaning',
    short: 'Basic',
    icon: SprayCan,
    time: '2–3 hari',
    text: 'Pembersihan bagian luar untuk mengangkat debu dan kotoran ringan sehari-hari.',
  },
  {
    name: 'Deep Cleaning',
    short: 'Deep',
    icon: Sparkles,
    time: '3–5 hari',
    text: 'Perawatan menyeluruh dari upper, midsole, outsole hingga tali dan insole.',
    featured: true,
  },
  {
    name: 'Fast Cleaning',
    short: 'Fast',
    icon: Clock3,
    time: '1 hari',
    text: 'Pembersihan praktis dengan prioritas pengerjaan untuk kebutuhan mendesakmu.',
  },
]

const rupiah = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value)

function getOrders(): Order[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {
    // Ignore unavailable local storage.
  }
  return []
}

function saveOrders(orders: Order[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
}

function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <button className="logo" onClick={onClick} aria-label="Kembali ke beranda">
      <span className="logo-mark"><Sparkles size={18} strokeWidth={2.5} /></span>
      <span>BERSIH <span>SEPATU</span></span>
    </button>
  )
}

function AppHeader({ page, go }: { page: Page; go: (page: Page) => void }) {
  const [open, setOpen] = useState(false)
  const navigate = (next: Page) => {
    setOpen(false)
    go(next)
  }

  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Logo onClick={() => navigate('home')} />
        <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Buka menu">
          {open ? <X /> : <Menu />}
        </button>
        <nav className={open ? 'nav-links open' : 'nav-links'}>
          <button className={page === 'home' ? 'active' : ''} onClick={() => navigate('home')}>Beranda</button>
          <button onClick={() => { navigate('home'); setTimeout(() => document.getElementById('layanan')?.scrollIntoView({ behavior: 'smooth' }), 50) }}>Layanan</button>
          <button onClick={() => { navigate('home'); setTimeout(() => document.getElementById('harga')?.scrollIntoView({ behavior: 'smooth' }), 50) }}>Harga</button>
          <button className="nav-cta" onClick={() => navigate('order')}>Pesan Sekarang <ArrowRight size={16} /></button>
        </nav>
      </div>
    </header>
  )
}

function Home({ go }: { go: (page: Page, service?: ServiceType) => void }) {
  return (
    <>
      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span /> YOUR SHOES, OUR CARE</div>
            <h1>Sepatu bersih,<br /><em>percaya diri kembali.</em></h1>
            <p>Perawatan profesional untuk sepatu dan tas kesayanganmu. Dikerjakan teliti, transparan, dan selalu tepat waktu.</p>
            <div className="hero-actions">
              <button className="primary-btn" onClick={() => go('order')}>Pesan Sekarang <ArrowRight size={18} /></button>
              <button className="text-btn" onClick={() => document.getElementById('layanan')?.scrollIntoView({ behavior: 'smooth' })}>Lihat layanan <ChevronRight size={17} /></button>
            </div>
            <div className="trust-row">
              <div className="avatars"><span>R</span><span>A</span><span>D</span></div>
              <div><div className="stars"><Star /><Star /><Star /><Star /><Star /></div><small>Dipercaya 500+ pelanggan</small></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-wrap"><img src={heroImage} alt="Sepatu bersih di studio perawatan Bersih Sepatu" width={1280} height={960} decoding="async" /></div>
            <div className="float-card top"><span><Sparkles size={20} /></span><div><b>Premium care</b><small>Aman untuk setiap material</small></div></div>
            <div className="float-card bottom"><CheckCircle2 /><div><b>Garansi treatment</b><small>Kualitas adalah prioritas kami</small></div></div>
          </div>
        </section>

        <section className="services section" id="layanan">
          <div className="section-heading">
            <div><span className="section-kicker">LAYANAN KAMI</span><h2>Perawatan tepat untuk<br />setiap kebutuhan.</h2></div>
            <p>Dari perawatan rutin hingga pembersihan intensif, pilih layanan yang paling sesuai untuk koleksimu.</p>
          </div>
          <div className="service-grid">
            {services.map(({ icon: Icon, ...service }, index) => (
              <article className={`service-card ${service.featured ? 'featured' : ''}`} key={service.name}>
                <div className="service-number">0{index + 1}</div>
                <div className="service-icon"><Icon /></div>
                {service.featured && <span className="popular">PALING POPULER</span>}
                <h3>{service.name}</h3>
                <p>{service.text}</p>
                <div className="service-footer"><span><Clock3 size={16} /> {service.time}</span><button onClick={() => go('order', service.short as ServiceType)} aria-label={`Pilih ${service.name}`}><ArrowRight /></button></div>
              </article>
            ))}
          </div>
        </section>

        <section className="why">
          <div className="why-copy">
            <span className="section-kicker">KENAPA BERSIH SEPATU?</span>
            <h2>Bukan sekadar bersih.<br />Kami merawat ceritanya.</h2>
            <p>Setiap pasang sepatu punya cerita. Tim kami memastikan setiap detail ditangani dengan teknik dan bahan yang tepat.</p>
            <div className="benefit-list">
              {[
                ['Penanganan profesional', 'Teknik disesuaikan dengan material dan kondisi.'],
                ['Harga transparan', 'Tanpa biaya tersembunyi, selalu ada konfirmasi.'],
                ['Update proses real-time', 'Pantau progres dengan kode unik pesananmu.'],
              ].map(([title, text]) => <div className="benefit" key={title}><span><Check /></span><div><b>{title}</b><p>{text}</p></div></div>)}
            </div>
          </div>
          <div className="process-card">
            <span className="process-label">PROSES KAMI</span>
            {[
              ['01', 'Inspeksi', 'Cek material dan kondisi awal'],
              ['02', 'Treatment', 'Pembersihan sesuai kebutuhan'],
              ['03', 'Quality check', 'Pemeriksaan detail akhir'],
              ['04', 'Siap kembali', 'Dikemas bersih dan aman'],
            ].map(([num, title, text], i) => <div className="process-step" key={num}><span>{num}</span><div><b>{title}</b><small>{text}</small></div>{i < 3 && <i />}</div>)}
          </div>
        </section>

        <section className="pricing section" id="harga">
          <div className="price-head"><div><span className="section-kicker">HARGA LAYANAN</span><h2>Jelas dari awal.</h2></div><p>Harga bersahabat, hasil maksimal. Pilih jenis item untuk melihat detail layanan.</p></div>
          <div className="price-table-wrap">
            <table>
              <thead><tr><th>Jenis sepatu</th><th>Basic</th><th>Deep</th><th>Fast</th></tr></thead>
              <tbody>
                {shoePrices.map(row => <tr key={row.name}><td><b>{row.name}</b><small>{row.detail}</small></td><td>{rupiah(row.Basic)}</td><td className="highlight">{rupiah(row.Deep)}</td><td>{rupiah(row.Fast)}</td></tr>)}
              </tbody>
            </table>
          </div>
          <div className="bag-row">
            <div className="bag-intro"><span><Shirt /></span><div><b>Perawatan tas</b><small>Deep cleaning khusus berbagai material</small></div></div>
            {bagPrices.map(item => <div className="bag-price" key={item.name}><small>{item.name}</small><b>{rupiah(item.price)}</b></div>)}
          </div>
          <p className="price-note">* Harga dapat berubah setelah inspeksi kondisi item. Kami akan selalu mengonfirmasi terlebih dahulu.</p>
        </section>

        <section className="cta-section">
          <div><span className="section-kicker light">MULAI SEKARANG</span><h2>Siap bikin sepatu kamu<br />kembali tampil maksimal?</h2></div>
          <button className="primary-btn light-btn" onClick={() => go('order')}>Pesan Perawatan <ArrowRight /></button>
        </section>
      </main>
      <Footer go={go} />
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Alur pemesanan: pilih layanan  →  salin pesanan  →  Google Form   */
/* ------------------------------------------------------------------ */

type ItemKind = 'shoe' | 'bag'
type CartLine = { key: string; name: string; kind: ItemKind; service: ServiceType; unit: number; qty: number; time: string }
type CatalogItem = { id: string; name: string; detail: string; kind: ItemKind; prices: Partial<Record<ServiceType, number>> }

const CART_KEY = 'solecare-cart'
const MAX_QTY = 20

const catalog: CatalogItem[] = [
  ...shoePrices.map(row => ({ id: row.name, name: row.name, detail: row.detail, kind: 'shoe' as ItemKind, prices: { Basic: row.Basic, Deep: row.Deep, Fast: row.Fast } })),
  ...bagPrices.map(bag => ({ id: bag.name, name: bag.name, detail: 'Deep cleaning khusus tas', kind: 'bag' as ItemKind, prices: { Deep: bag.price } })),
]

const unitWord = (kind: ItemKind) => (kind === 'shoe' ? 'pasang' : 'pcs')
const serviceTime = (service: ServiceType) => services.find(s => s.short === service)?.time ?? ''
const lineTotal = (line: CartLine) => line.unit * line.qty
const cartTotal = (lines: CartLine[]) => lines.reduce((sum, line) => sum + lineTotal(line), 0)
const cartCount = (lines: CartLine[]) => lines.reduce((sum, line) => sum + line.qty, 0)

function longestTime(lines: CartLine[]) {
  const days = (text: string) => Math.max(...(text.match(/\d+/g) ?? ['0']).map(Number))
  return lines.reduce<CartLine | null>((best, line) => (!best || days(line.time) > days(best.time) ? line : best), null)?.time ?? '-'
}

function mergeLine(lines: CartLine[], line: CartLine) {
  if (!lines.some(item => item.key === line.key)) return [...lines, line]
  return lines.map(item => (item.key === line.key ? { ...item, qty: Math.min(MAX_QTY, item.qty + line.qty) } : item))
}

function loadCart(): CartLine[] {
  try {
    const saved = sessionStorage.getItem(CART_KEY)
    if (saved) return JSON.parse(saved)
  } catch {
    // Abaikan jika penyimpanan tidak tersedia.
  }
  return []
}

function persistCart(lines: CartLine[]) {
  try {
    sessionStorage.setItem(CART_KEY, JSON.stringify(lines))
  } catch {
    // Abaikan jika penyimpanan tidak tersedia.
  }
}

function buildOrderText(lines: CartLine[]) {
  const body = lines
    .map((line, i) => `${i + 1}. ${line.name} - ${line.service} Cleaning\n   ${line.qty} ${unitWord(line.kind)} x ${rupiah(line.unit)} = ${rupiah(lineTotal(line))}`)
    .join('\n')
  return [
    'PESANAN BERSIH SEPATU',
    '--------------------',
    body,
    '--------------------',
    `Estimasi pengerjaan: ${longestTime(lines)}`,
    `TOTAL: ${rupiah(cartTotal(lines))}`,
    '*Harga dapat berubah setelah inspeksi kondisi item.',
  ].join('\n').replace(/\u00a0/g, ' ')
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Lanjut ke cara cadangan di bawah.
  }
  try {
    const area = document.createElement('textarea')
    area.value = text
    area.style.cssText = 'position:fixed;opacity:0;top:0;left:0'
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(area)
    return ok
  } catch {
    return false
  }
}

function FlowSteps({ current }: { current: 1 | 2 | 3 }) {
  const steps = ['Pilih layanan', 'Salin pesanan', 'Isi Google Form']
  return (
    <ol className="flow-steps" aria-label="Tahapan pemesanan">
      {steps.map((label, i) => {
        const n = i + 1
        const state = n < current ? 'done' : n === current ? 'current' : ''
        return <li className={`flow-step ${state}`} key={label} aria-current={n === current ? 'step' : undefined}><span>{n < current ? <Check size={15} strokeWidth={3} /> : n}</span><b>{label}</b></li>
      })}
    </ol>
  )
}

function OrderPage({ cart, setCart, preset, go }: { cart: CartLine[]; setCart: (lines: CartLine[]) => void; preset: ServiceType | null; go: (page: Page) => void }) {
  const [itemId, setItemId] = useState<string | null>(null)
  const [service, setService] = useState<ServiceType | null>(preset)
  const [qty, setQty] = useState(1)

  const item = catalog.find(entry => entry.id === itemId) ?? null
  const activeService: ServiceType | null = item ? (item.kind === 'bag' ? 'Deep' : service) : null
  const unit = item && activeService ? item.prices[activeService] : undefined
  const draft: CartLine | null = item && activeService && unit !== undefined
    ? { key: `${item.id}|${activeService}`, name: item.name, kind: item.kind, service: activeService, unit, qty, time: serviceTime(activeService) }
    : null

  const total = cartTotal(cart) + (draft ? lineTotal(draft) : 0)
  const eta = longestTime(draft ? [...cart, draft] : cart)
  const canContinue = cart.length > 0 || draft !== null

  const resetSelection = () => { setItemId(null); setService(null); setQty(1) }
  const addDraft = () => { if (draft) { setCart(mergeLine(cart, draft)); resetSelection() } }
  const changeQty = (key: string, delta: number) => setCart(cart.map(line => (line.key === key ? { ...line, qty: Math.min(MAX_QTY, Math.max(1, line.qty + delta)) } : line)))
  const removeLine = (key: string) => setCart(cart.filter(line => line.key !== key))
  const proceed = () => {
    if (!canContinue) return
    if (draft) setCart(mergeLine(cart, draft))
    go('confirm')
  }

  const shoes = catalog.filter(entry => entry.kind === 'shoe')
  const bags = catalog.filter(entry => entry.kind === 'bag')
  const itemCard = (entry: CatalogItem) => {
    const from = Math.min(...Object.values(entry.prices).filter((v): v is number => v !== undefined))
    const selected = entry.id === itemId
    return (
      <button type="button" key={entry.id} className={selected ? 'ord-item selected' : 'ord-item'} aria-pressed={selected} onClick={() => setItemId(entry.id)}>
        <span className="ord-check"><Check size={14} strokeWidth={3} /></span>
        <b>{entry.name}</b>
        <small>{entry.detail}</small>
        <span className="ord-from">mulai {rupiah(from)}</span>
      </button>
    )
  }

  return (
    <main className="subpage ord-page">
      <div className="ord-top">
        <button type="button" className="ord-back" onClick={() => go('home')}><ArrowLeft size={16} /> Kembali ke beranda</button>
        <FlowSteps current={1} />
      </div>
      <div className="ord-title">
        <span className="section-kicker">PESAN LAYANAN</span>
        <h1>Pilih perawatan untuk<br /><em>item kesayanganmu.</em></h1>
        <p>Pilih jenis item, layanan, dan jumlahnya. Biaya dihitung otomatis di ringkasan.</p>
      </div>

      <div className="ord-layout">
        <div className="ord-main">
          <section className="ord-block">
            <div className="ord-block-head"><span>1</span><div><h2>Jenis item</h2><p>Pilih sesuai material item kamu.</p></div></div>
            <div className="ord-group-label">Sepatu</div>
            <div className="ord-item-grid">{shoes.map(itemCard)}</div>
            <div className="ord-group-label">Tas</div>
            <div className="ord-item-grid three">{bags.map(itemCard)}</div>
          </section>

          <section className={item ? 'ord-block' : 'ord-block muted'}>
            <div className="ord-block-head"><span>2</span><div><h2>Layanan</h2><p>{item ? (item.kind === 'bag' ? 'Tas dirawat dengan Deep Cleaning khusus.' : 'Pilih kecepatan dan kedalaman perawatan.') : 'Pilih jenis item terlebih dulu.'}</p></div></div>
            <div className="ord-service-grid">
              {services.map(({ icon: Icon, ...svc }) => {
                const short = svc.short as ServiceType
                const price = item?.prices[short]
                const available = !item || price !== undefined
                const selected = (item ? activeService : service) === short
                return (
                  <button type="button" key={svc.name} className={selected ? 'ord-service selected' : 'ord-service'} disabled={!item || !available} aria-pressed={selected} onClick={() => setService(short)}>
                    <span className="ord-check"><Check size={14} strokeWidth={3} /></span>
                    <span className="ord-service-icon"><Icon size={20} /></span>
                    <b>{svc.name}</b>
                    <small><Clock3 size={13} /> {svc.time}</small>
                    <span className="ord-price">{price !== undefined ? rupiah(price) : item ? 'Tidak tersedia' : '-'}</span>
                  </button>
                )
              })}
            </div>
          </section>

          <section className={draft ? 'ord-block' : 'ord-block muted'}>
            <div className="ord-block-head"><span>3</span><div><h2>Jumlah</h2><p>Berapa {item ? unitWord(item.kind) : 'pasang'} yang ingin dirawat?</p></div></div>
            <div className="ord-qty-row">
              <div className="ord-qty" aria-label="Jumlah">
                <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} disabled={!draft || qty <= 1} aria-label="Kurangi"><Minus size={18} /></button>
                <output>{qty}</output>
                <button type="button" onClick={() => setQty(Math.min(MAX_QTY, qty + 1))} disabled={!draft || qty >= MAX_QTY} aria-label="Tambah"><Plus size={18} /></button>
              </div>
              <div className="ord-subtotal"><small>Subtotal item ini</small><b>{draft ? rupiah(lineTotal(draft)) : '-'}</b></div>
              <button type="button" className="ord-add" disabled={!draft} onClick={addDraft}><Plus size={16} /> Tambah item lain</button>
            </div>
          </section>
        </div>

        <aside className="ord-summary" aria-label="Ringkasan pesanan">
          <div className="ord-sum-head">
            <div><span className="section-kicker light">RINGKASAN</span><h3>Pesananmu</h3></div>
            {cart.length > 0 && <button type="button" onClick={() => setCart([])}>Kosongkan</button>}
          </div>
          <div className="ord-sum-list">
            {cart.length === 0 && !draft && <div className="ord-sum-empty"><PackageCheck /><p>Belum ada item dipilih.<br />Pilih item dan layanan di sebelah kiri.</p></div>}
            {cart.map(line => (
              <div className="ord-line" key={line.key}>
                <div className="ord-line-top"><div><b>{line.name}</b><small>{line.service} Cleaning · {line.time}</small></div><button type="button" onClick={() => removeLine(line.key)} aria-label={`Hapus ${line.name}`}><Trash2 size={15} /></button></div>
                <div className="ord-line-bottom">
                  <div className="ord-mini-qty"><button type="button" onClick={() => changeQty(line.key, -1)} disabled={line.qty <= 1} aria-label="Kurangi"><Minus size={13} /></button><output>{line.qty}</output><button type="button" onClick={() => changeQty(line.key, 1)} disabled={line.qty >= MAX_QTY} aria-label="Tambah"><Plus size={13} /></button></div>
                  <span>{rupiah(line.unit)} × {line.qty}</span><strong>{rupiah(lineTotal(line))}</strong>
                </div>
              </div>
            ))}
            {draft && (
              <div className="ord-line draft">
                <div className="ord-line-top"><div><span className="ord-draft-tag">SEDANG DIPILIH</span><b>{draft.name}</b><small>{draft.service} Cleaning · {draft.time}</small></div></div>
                <div className="ord-line-bottom"><span>{rupiah(draft.unit)} × {draft.qty}</span><strong>{rupiah(lineTotal(draft))}</strong></div>
              </div>
            )}
          </div>
          <div className="ord-sum-foot">
            <div className="ord-eta"><Clock3 size={15} /> Estimasi pengerjaan <b>{eta}</b></div>
            <div className="ord-total"><span>Total estimasi</span><strong>{rupiah(total)}</strong></div>
            <button type="button" className="ord-continue" disabled={!canContinue} onClick={proceed}>Lanjutkan <ArrowRight size={18} /></button>
            <p>* Harga dapat berubah setelah inspeksi kondisi item. Kami akan selalu mengonfirmasi terlebih dahulu.</p>
          </div>
        </aside>
      </div>

      <div className="ord-mobilebar">
        <div><small>{cartCount(draft ? [...cart, draft] : cart)} item · total estimasi</small><strong>{rupiah(total)}</strong></div>
        <button type="button" disabled={!canContinue} onClick={proceed}>Lanjutkan <ArrowRight size={17} /></button>
      </div>
    </main>
  )
}

function ConfirmPage({ cart, go }: { cart: CartLine[]; go: (page: Page) => void }) {
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)
  const text = useMemo(() => buildOrderText(cart), [cart])

  const doCopy = async () => {
    const ok = await copyText(text)
    setCopied(ok)
    setCopyFailed(!ok)
  }

  const openForm = () => {
    if (!GOOGLE_FORM_URL) {
      window.alert('Link Google Form belum diisi. Tempel link Anda pada GOOGLE_FORM_URL di src/App.tsx.')
      return
    }
    if (!copied) void doCopy() // pengaman: pesanan tetap tersalin walau customer lupa menekan tombol salin
    window.open(GOOGLE_FORM_URL, '_blank', 'noopener,noreferrer')
  }

  return (
    <main className="subpage ord-page cf-page">
      <div className="ord-top">
        <button type="button" className="ord-back" onClick={() => go('order')}><ArrowLeft size={16} /> Ubah pesanan</button>
        <FlowSteps current={2} />
      </div>
      <div className="ord-title">
        <span className="section-kicker">KONFIRMASI PESANAN</span>
        <h1>Periksa, salin, lalu<br /><em>lanjut ke Google Form.</em></h1>
        <p>Pastikan pesananmu sudah benar. Salin teks pesanan, lalu tempel di Google Form.</p>
      </div>

      <div className="ord-layout cf-layout">
        <section className="cf-order">
          <div className="cf-order-head"><div><span className="section-kicker">RINCIAN PESANAN</span><h2>Pesanan yang kamu pilih</h2></div><span className="cf-count">{cartCount(cart)} item</span></div>
          <div className="cf-lines">
            {cart.map((line, i) => (
              <div className="cf-line" key={line.key}>
                <span className="cf-num">{i + 1}</span>
                <div className="cf-line-info"><b>{line.name}</b><small>{line.service} Cleaning · {line.time}</small></div>
                <div className="cf-line-price"><small>{line.qty} {unitWord(line.kind)} × {rupiah(line.unit)}</small><b>{rupiah(lineTotal(line))}</b></div>
              </div>
            ))}
          </div>
          <div className="cf-totals">
            <div><span>Estimasi pengerjaan</span><b>{longestTime(cart)}</b></div>
            <div className="grand"><span>Total estimasi</span><strong>{rupiah(cartTotal(cart))}</strong></div>
          </div>
          <p className="cf-note">* Harga dapat berubah setelah inspeksi kondisi item. Kami akan selalu mengonfirmasi terlebih dahulu.</p>
        </section>

        <aside className="cf-action">
          <div className="cf-action-head"><span className="cf-badge">LANGKAH 1</span><h3>Salin pesananmu</h3></div>
          <pre className="cf-preview" tabIndex={0} aria-label="Teks pesanan yang akan disalin">{text}</pre>
          <button type="button" className={copied ? 'cf-copy copied' : 'cf-copy'} onClick={doCopy}>
            {copied ? <><Check size={19} strokeWidth={3} /> Pesanan tersalin!</> : <><Copy size={18} /> Salin pesanan</>}
          </button>
          {copyFailed && <p className="cf-fail">Tidak bisa menyalin otomatis. Tekan lama atau blok teks di atas, lalu salin manual.</p>}

          <div className={copied ? 'cf-reminder done' : 'cf-reminder'} role="alert">
            <span className="cf-reminder-icon">{copied ? <Check size={24} strokeWidth={3} /> : <TriangleAlert size={24} />}</span>
            <div>
              <b>{copied ? 'Sudah tersalin. Sekarang tempel di Google Form.' : 'JANGAN LUPA SALIN PESANANMU!'}</b>
              <p>{copied ? 'Di Google Form, tempel (paste) teks tadi pada kolom pesanan, lalu lengkapi data dan pembayaran.' : 'Tekan tombol “Salin pesanan” di atas, lalu tempel (paste) pada kolom pesanan di Google Form agar pesananmu tercatat dengan benar.'}</p>
            </div>
          </div>

          <div className="cf-action-head second"><span className="cf-badge">LANGKAH 2</span><h3>Lanjutkan pesanan</h3></div>
          <button type="button" className={copied ? 'cf-form ready' : 'cf-form'} onClick={openForm}>Lanjut ke Google Form <ExternalLink size={18} /></button>
          <p className="cf-hint">Google Form terbuka di tab baru. Halaman ini tetap tersimpan jika kamu perlu kembali.</p>
        </aside>
      </div>
    </main>
  )
}

function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(sessionStorage.getItem('solecare-admin') === 'yes')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [orders, setOrders] = useState<Order[]>(getOrders())
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newItem, setNewItem] = useState('')
  const [newService, setNewService] = useState<ServiceType>('Deep')
  const [newNote, setNewNote] = useState('')

  const login = (e: FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('solecare-admin', 'yes')
      setLoggedIn(true)
    } else setError('Password tidak sesuai.')
  }

  const updateStatus = (code: string, status: OrderStatus) => {
    const updated = orders.map(order => order.code === code ? { ...order, status } : order)
    setOrders(updated)
    saveOrders(updated)
  }

  const createTrackingCode = (e: FormEvent) => {
    e.preventDefault()
    const order: Order = {
      code: `BS-${new Date().getFullYear().toString().slice(-2)}${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      name: newName,
      phone: newPhone,
      item: newItem,
      service: newService,
      price: 0,
      status: 'Pesanan diterima',
      date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      note: newNote,
    }
    const updated = [order, ...orders]
    setOrders(updated)
    saveOrders(updated)
    setNewName('')
    setNewPhone('')
    setNewItem('')
    setNewService('Deep')
    setNewNote('')
  }

  if (!loggedIn) return <main className="subpage admin-login"><form onSubmit={login} className="login-card"><span className="lock-icon"><LockKeyhole /></span><span className="section-kicker">AREA ADMIN</span><h1>Selamat datang kembali.</h1><p>Masukkan password untuk membuat kode dan mengelola status pesanan.</p><label>Password<input autoFocus type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Masukkan password" /></label>{error && <span className="error">{error}</span>}<button className="primary-btn wide" type="submit">Masuk ke dashboard <ArrowRight /></button></form></main>

  return (
    <main className="subpage admin-page">
      <div className="admin-head"><div><span className="section-kicker">DASHBOARD ADMIN</span><h1>Kelola pesanan.</h1><p>Hanya admin yang dapat membuat kode unik dan memperbarui status pengerjaan.</p></div><button className="outline-btn" onClick={() => { sessionStorage.removeItem('solecare-admin'); setLoggedIn(false) }}>Keluar</button></div>
      <div className="stats"><div><small>Total pesanan</small><strong>{orders.length}</strong></div><div><small>Sedang diproses</small><strong>{orders.filter(o => !['Selesai', 'Siap diambil'].includes(o.status)).length}</strong></div><div><small>Siap diambil</small><strong>{orders.filter(o => o.status === 'Siap diambil').length}</strong></div></div>
      <form className="admin-create" onSubmit={createTrackingCode}>
        <div className="admin-create-head"><div><span className="section-kicker">KODE PELACAKAN BARU</span><h3>Buat kode untuk customer</h3></div><span>Kode dibuat otomatis setelah data disimpan</span></div>
        <div className="admin-create-grid">
          <label>Nama customer<input required value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nama lengkap" /></label>
          <label>Nomor WhatsApp<input required value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="08xxxxxxxxxx" /></label>
          <label>Item<input required value={newItem} onChange={e => setNewItem(e.target.value)} placeholder="Contoh: Sneakers putih" /></label>
          <label>Layanan<select value={newService} onChange={e => setNewService(e.target.value as ServiceType)}><option>Basic</option><option>Deep</option><option>Fast</option></select></label>
          <label className="admin-note">Catatan<textarea value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Kondisi atau permintaan customer" /></label>
        </div>
        <button className="primary-btn" type="submit">Buat kode unik <ArrowRight /></button>
      </form>
      <div className="admin-table">
        <div className="admin-table-head"><h3>Pesanan terbaru</h3><span>{orders.length} pesanan</span></div>
        {orders.length === 0 ? <div className="empty-orders"><PackageCheck /><h3>Belum ada pesanan</h3><p>Pesanan baru dari form akan muncul di sini.</p></div> :
          orders.map(order => <div className="admin-order" key={order.code}><div><small>{order.code}</small><b>{order.name}</b></div><div><small>Item & layanan</small><b>{order.item} · {order.service}</b></div><div><small>Tanggal</small><b>{order.date}</b></div><label><small>Update status</small><select value={order.status} onChange={e => updateStatus(order.code, e.target.value as OrderStatus)}>{statuses.map(status => <option key={status}>{status}</option>)}</select></label></div>)}
      </div>
    </main>
  )
}

function Footer({ go }: { go: (page: Page) => void }) {
  return <footer><div className="footer-main"><div><Logo onClick={() => go('home')} /><p>Perawatan profesional untuk sepatu<br />dan tas kesayanganmu.</p></div><div className="footer-links"><div><b>Navigasi</b><button onClick={() => go('home')}>Beranda</button><button onClick={() => go('order')}>Pesan layanan</button></div><div><b>Hubungi</b><a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">WhatsApp</a><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"><Camera size={15} /> Instagram</a></div></div></div><div className="footer-bottom"><span>© 2026 Bersih Sepatu. All rights reserved.</span><span>Clean shoes, clear mind.</span></div></footer>
}

export default function App() {
  const getPage = () => (window.location.hash.replace('#/', '') as Page) || 'home'
  const [page, setPage] = useState<Page>(getPage())
  const [cart, setCartState] = useState<CartLine[]>(loadCart)
  const [preset, setPreset] = useState<ServiceType | null>(null)

  const setCart = (lines: CartLine[]) => {
    setCartState(lines)
    persistCart(lines)
  }

  useEffect(() => {
    const onHash = () => { setPage(getPage()); window.scrollTo({ top: 0 }) }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const go = (next: Page, service?: ServiceType) => {
    setPreset(next === 'order' ? service ?? null : null)
    window.location.hash = `/${next}`
    setPage(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  let content = <Home go={go} />
  if (page === 'order') content = <OrderPage cart={cart} setCart={setCart} preset={preset} go={go} />
  else if (page === 'confirm') content = cart.length > 0 ? <ConfirmPage cart={cart} go={go} /> : <OrderPage cart={cart} setCart={setCart} preset={preset} go={go} />
  else if (page === 'ruang-admin-solecare') content = <AdminPage />

  return <><AppHeader page={page} go={go} />{content}</>
}
