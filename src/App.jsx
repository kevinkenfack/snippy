import { useEffect, useRef, useState } from "react"
import CodeEditor from "./components/CodeEditor"
import { cn } from "./lib/utils"
import { fonts, themes } from "./options"
import useStore from "./store"
import { Card, CardContent } from "./components/ui/card"
import ExportOptions from "./components/controls/ExportOptions"
import ThemeSelect from "./components/controls/ThemeSelect"
import LanguageSelect from "./components/controls/LanguageSelect"
import FontSelect from "./components/controls/FontSelect"
import FontSizeInput from "./components/controls/FontSizeInput"
import PaddingSlider from "./components/controls/PaddingSlider"
import BackgroundSwitch from "./components/controls/BackgroundSwitch"
import DarkModeSwitch from "./components/controls/DarkModeSwitch"
import { Resizable } from "re-resizable"
import { Button } from "./components/ui/button"
import { ResetIcon, CodeIcon } from "@radix-ui/react-icons"
import WidthMeasurement from "./components/WidthMeasurement"

function App() {
  const [width, setWidth] = useState("auto")
  const [showWidth, setShowWidth] = useState(false)
  const [showEditor, setShowEditor] = useState(false)

  const theme = useStore((state) => state.theme)
  const padding = useStore((state) => state.padding)
  const fontStyle = useStore((state) => state.fontStyle)
  const showBackground = useStore((state) => state.showBackground)

  const editorRef = useRef(null)

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    if (queryParams.size === 0) return
    const state = Object.fromEntries(queryParams)

    useStore.setState({
      ...state,
      code: state.code ? atob(state.code) : "",
      autoDetectLanguage: state.autoDetectLanguage === "true",
      darkMode: state.darkMode === "true",
      fontSize: Number(state.fontSize || 18),
      padding: Number(state.padding || 64),
    })
  }, [])

  if (!showEditor) {
    return (
      <main className="dark min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-white relative overflow-hidden px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-[10px] opacity-50">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
            <div className="absolute top-0 -right-4 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
          </div>
        </div>

        <div className="relative max-w-3xl text-center space-y-8 sm:space-y-12 p-4 sm:p-8">
          <div className="space-y-4 sm:space-y-6">
            <div className="relative">
              <CodeIcon className="w-16 h-16 sm:w-24 sm:h-24 mx-auto text-purple-500 transform hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-purple-500/20 blur-3xl -z-10" />
            </div>
            
            <h1 className="text-4xl sm:text-7xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-transparent bg-clip-text animate-gradient">
              Snippy
            </h1>
            
            <p className="text-lg sm:text-2xl text-neutral-300 leading-relaxed max-w-2xl mx-auto">
              Créez de superbes captures d'écran de votre code en quelques clics. 
              <span className="block mt-2 text-neutral-400">
                Personnalisez les thèmes, les polices et exportez en haute qualité.
              </span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <Button 
              size="lg"
              onClick={() => setShowEditor(true)}
              className="w-full sm:w-auto bg-purple-500 hover:bg-purple-600 text-white px-8 sm:px-12 py-6 sm:py-8 text-lg sm:text-xl rounded-xl sm:rounded-2xl transform hover:scale-105 transition-all duration-200 shadow-lg shadow-purple-500/25"
            >
              Commencer
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              onClick={() => window.open('https://github.com/kevinkenfack/snippy', '_blank')}
              className="w-full sm:w-auto border-2 border-neutral-700 hover:bg-neutral-800 px-8 sm:px-12 py-6 sm:py-8 text-lg sm:text-xl rounded-xl sm:rounded-2xl transform hover:scale-105 transition-all duration-200"
            >
              GitHub
            </Button>
          </div>

          <div className="pt-8 sm:pt-12 text-sm sm:text-base text-neutral-500 hover:text-neutral-400 transition-colors">
            Créé avec <span className="text-red-500 animate-pulse">♥️</span> par Kevin Kenfack
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="dark min-h-screen flex bg-neutral-950 text-white">
      <link
        rel="stylesheet"
        href={themes[theme].theme}
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href={fonts[fontStyle].src}
        crossOrigin="anonymous"
      />

      <div className="flex-1 p-8 flex justify-center">
        <div className="w-full max-w-[1000px]">
          <Resizable
            enable={{ left: true, right: true }}
            minWidth={padding * 2 + 400}
            size={{ width }}
            onResize={(e, dir, ref) => setWidth(ref.offsetWidth)}
            onResizeStart={() => setShowWidth(true)}
            onResizeStop={() => setShowWidth(false)}
          >
            <div
              className={cn(
                "overflow-hidden mb-2 transition-all ease-out",
                showBackground ? themes[theme].background : "ring ring-neutral-900"
              )}
              style={{ padding }}
              ref={editorRef}
            >
              <CodeEditor />
            </div>
            <WidthMeasurement showWidth={showWidth} width={width} />
            <div
              className={cn(
                "transition-opacity w-fit mx-auto -mt-4",
                showWidth || width === "auto"
                  ? "invisible opacity-0"
                  : "visible opacity-100"
              )}
            >
              <Button size="sm" onClick={() => setWidth("auto")} variant="ghost">
                <ResetIcon className="mr-2" />
                Réinitialiser
              </Button>
            </div>
          </Resizable>
        </div>
      </div>

      <Card className="h-screen w-[280px] py-6 px-4 bg-neutral-900/90 backdrop-blur-sm border-l border-neutral-800">
        <CardContent className="flex flex-col gap-4 p-0">
          <div className="space-y-4">
            <ThemeSelect />
            <LanguageSelect />
            <FontSelect />
          </div>
          
          <div className="space-y-4">
            <FontSizeInput />
            <PaddingSlider />
          </div>
          
          <div className="flex gap-4 items-center">
            <BackgroundSwitch />
            <DarkModeSwitch />
          </div>
          
          <div className="h-px w-full bg-neutral-800/50" />
          
          <div className="flex justify-center">
            <ExportOptions targetRef={editorRef} />
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

export default App
