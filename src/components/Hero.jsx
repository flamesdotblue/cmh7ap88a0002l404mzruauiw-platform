import Spline from '@splinetool/react-spline'

export default function Hero() {
  return (
    <section className="relative h-[460px] w-full">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/IKzHtP5ThSO83edK/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/80 via-white/40 to-white"></div>
      <div className="relative mx-auto flex h-full max-w-7xl flex-col items-start justify-end gap-4 px-4 pb-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Loan Application Partner Portal</h1>
        <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
          Monitor applications, manage partners, and accelerate approvals with a modern, data-driven workspace.
        </p>
      </div>
    </section>
  )
}
