import {
  DownloadIcon,
  ImageIcon,
  Link2Icon,
  Share2Icon,
} from "@radix-ui/react-icons"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { toBlob, toPng, toSvg } from "html-to-image"
import { toast } from "react-hot-toast"
import useStore from "@/store"
import { useHotkeys } from "react-hotkeys-hook"

export default function ExportOptions({ targetRef }) {
  const title = useStore((state) => state.title)

  const copyImage = async () => {
    const loading = toast.loading("Copying...")

    try {
      const imgBlob = await toBlob(targetRef.current, {
        pixelRatio: 2,
      })
      const img = new ClipboardItem({ "image/png": imgBlob })
      navigator.clipboard.write([img])

      toast.remove(loading)
      toast.success("Image copiée dans le presse-papiers !")
    } catch (error) {
      toast.remove(loading)
      toast.error("Something went wrong!")
    }
  }

  const copyLink = () => {
    try {
      const state = useStore.getState()
      const queryParams = new URLSearchParams({
        ...state,
        code: btoa(state.code),
      }).toString()
      navigator.clipboard.writeText(`${location.href}?${queryParams}`)

      toast.success("Lien copié dans le presse-papiers !")
    } catch (error) {
      toast.error("Something went wrong!")
    }
  }

  const saveImage = async (name, format) => {
    const loading = toast.loading(`Exporting ${format} image...`)

    try {
      let imgUrl, filename
      switch (format) {
        case "PNG":
          imgUrl = await toPng(targetRef.current, { pixelRatio: 2 })
          filename = `${name}.png`
          break
        case "SVG":
          imgUrl = await toSvg(targetRef.current, { pixelRatio: 2 })
          filename = `${name}.svg`
          break

        default:
          return
      }

      const a = document.createElement("a")
      a.href = imgUrl
      a.download = filename
      a.click()

      toast.remove(loading)
      toast.success("Image téléchargée avec succès !")
    } catch (error) {
      toast.remove(loading)
      toast.error("Something went wrong!")
    }
  }

  useHotkeys("ctrl+c", copyImage)
  useHotkeys("shift+ctrl+c", copyLink)
  useHotkeys("ctrl+s", () => saveImage(title, "PNG"))
  useHotkeys("shift+ctrl+s", () => saveImage(title, "SVG"))

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">
          <Share2Icon className="mr-2" />
          Exporter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="dark">
        <DropdownMenuItem onClick={copyImage}>
          <ImageIcon className="mr-2" />
          Copier l'image
          <DropdownMenuShortcut>⌘+C</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyLink}>
          <Link2Icon className="mr-2" />
          Copier le lien
          <DropdownMenuShortcut>⌘+L</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => saveImage(title, "PNG")}>
          <DownloadIcon className="mr-2" />
          Télécharger
          <DropdownMenuShortcut>⌘+S</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => saveImage(title, "SVG")}>
          <DownloadIcon className="mr-2" />
          Télécharger
          <DropdownMenuShortcut>⌘+S</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
