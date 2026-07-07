import { DsRouterProvider, Header } from "my-v0-project"

// Two things keep Header out of a naive still: it embeds LanguageSwitcher,
// whose next-intl navigation hooks throw without an app router (DsRouterProvider
// stubs those contexts from inside the bundle), and it's position:fixed with
// its over-the-hero transparent state — so neutralize the fixed positioning
// and stage it on the dark control-room surface it actually overlays.
export const Vista = () => (
  <DsRouterProvider>
    {/* surface-steel and bg-blueprint both set background-image — layer them
        on nested elements (as the app does), never on the same node. */}
    <div className="header-preview surface-steel relative overflow-hidden rounded-xl">
      <div className="bg-blueprint p-2">
        <style>{`.header-preview header { position: static !important; }`}</style>
        <Header />
      </div>
    </div>
  </DsRouterProvider>
)
