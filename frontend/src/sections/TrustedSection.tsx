import { Container } from '../components/Container'

const brands = ['Northstar', 'Aperture', 'Summit', 'Cobalt', 'Luma']

export function TrustedSection() {
  return (
    <section className="py-10">
      <Container>
        <div className="rounded-card border border-slate-200/70 bg-white/55 px-6 py-7 backdrop-blur-xl">
          <p className="text-center text-sm font-semibold text-slate-400">Trusted by focused growth teams</p>
          <div className="mt-6 grid grid-cols-2 gap-5 text-center text-sm font-bold text-slate-400 md:grid-cols-5">
            {brands.map((brand) => (
              <span key={brand}>{brand}</span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
