import { About } from './components/About'
import { Animals } from './components/Animals'
import { Contact } from './components/Contact'
import { Features } from './components/Features'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Help } from './components/Help'
import { Hero } from './components/Hero'
import { News } from './components/News'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <Animals />
        <Help />
        <About />
        <News />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
