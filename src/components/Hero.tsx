import { ArrowRight, Heart, PawPrint } from 'lucide-react'
import { DoodleHeart, DoodleUnderline } from './Doodles'

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__media" aria-hidden="true">
        <img src="/images/hero.jpg" alt="" />
      </div>
      <div className="container hero__content">
        <p className="eyebrow hero__eyebrow">
          Tieren eine
          <br />
          Chance geben
          <DoodleHeart className="hero__heart" />
        </p>
        <h1 className="hero__title">
          Zuhause
          <br />
          <span className="underlined">
            gesucht.
            <DoodleUnderline className="underlined__line" />
          </span>
        </h1>
        <p className="hero__lead">
          Wir retten, versorgen und vermitteln Tiere
          <br className="hide-sm" /> in ein liebevolles, artgerechtes Zuhause.
        </p>
        <div className="hero__actions">
          <a href="#tiere" className="btn btn--primary">
            <PawPrint size={20} /> Tiere entdecken <ArrowRight size={18} />
          </a>
          <a href="#mithelfen" className="btn btn--outline">
            Jetzt helfen <Heart size={18} />
          </a>
        </div>
      </div>
      <svg className="hero__wave" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 22C180 8 330 4 520 18s420 34 620 20 230-30 300-34V60H0z" />
      </svg>
    </section>
  )
}
