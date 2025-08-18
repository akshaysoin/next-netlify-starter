import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Next.js Starter!</title>
        <link rel="icon" href="/favicon.ico" />

        <script
          id="mopo_agent_embed_script"
          type="text/javascript"
          src="https://avstest.netlify.app/embed?url=https://mak.com"
          crossorigin
        ></script>
          
      </Head>

      <main>
        <Header title="Welcome to my app!" />
        <p className="description">
          This is a test page!
        </p>
      </main>

      <Footer />
    </div>
  )
}
