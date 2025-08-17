export default function Header({ title }) {
  return (
    <>
      <script
        id="mopo_agent_embed_script"
        type="text/javascript"
        src="https://devagent.mopo.life/chat_assets/embed.js?url=https://mak.com"
        crossorigin
      ></script>

      <h1 className="title">{title}</h1>
    </>
  )
}
