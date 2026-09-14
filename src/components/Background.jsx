export default function Background() {
  return (
    <div className="fixed inset-0 -z-20 pointer-events-none">
      <div className="absolute inset-0 bg-ink" />
      <div className="absolute inset-0 bg-grid opacity-60" />
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-[0.08] blur-[140px]"
        style={{ background: 'radial-gradient(circle, #e4322c 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-0 right-0 w-[600px] h-[500px] opacity-[0.05] blur-[120px]"
        style={{ background: 'radial-gradient(circle, #e4322c 0%, transparent 70%)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink" />
      <div className="grain" />
    </div>
  )
}
