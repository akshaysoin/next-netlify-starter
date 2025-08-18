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
          dangerouslySetInnerHTML={{
            __html: ` //There is a quote on this line!
              (function() {
                // A unique global variable to act as a flag
                const MOPO_AGENT_LOADED_FLAG = 'MOPO_AgentLoaded';
        
                // Check if the flag is already set in the top-level window.
                // window.top refers to the highest window in the hierarchy.
                if (!window.top[MOPO_AGENT_LOADED_FLAG]) {
                  // Set the flag to indicate the agent is now loading.
                  window.top[MOPO_AGENT_LOADED_FLAG] = true;
                  console.log("Initializing MOPO agent for the first time.");
                  
                  const script = document.createElement('script');
                  script.id = 'mopo_agent_embed_script';
                  script.type = 'text/javascript';
                  script.src = 'https://devagent.mopo.life/chat_assets/embed.js?url=https://mak.com';
                  script.crossOrigin = '';
                  document.head.appendChild(script);
                } else {
                  //Skip loading agent as it is already loaded
                  console.log("MOPO Agent already loaded. Preventing recursion.");
                }
              })();
            ` //There is a quote on this line!
          }}
        />
            
      </Head>

      <main>
        <Header title="Welcome to my app!" />
        <p className="description">
          This is the landing page!
          Try <a href="./test">test.js</a>
        </p>
      </main>

      <Footer />
    </div>
  )
}
