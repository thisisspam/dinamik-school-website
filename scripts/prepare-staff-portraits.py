"""Extract staff portraits from the supplied 2026-2027 department posters.

Usage:
    python scripts/prepare-staff-portraits.py --source-dir "C:\\path\\to\\posters"

The crop boxes intentionally retain the school's portrait backdrop while removing
the surrounding poster artwork and name labels. Outputs are normalized to a 4:5
WebP portrait for consistent rendering in the staff directory.
"""

from __future__ import annotations

import argparse
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps


@dataclass(frozen=True)
class PortraitCrop:
    source: str
    output: str
    box: tuple[int, int, int, int]


PORTRAITS = (
    PortraitCrop("WhatsApp Image 2026-07-19 at 17.36.13 (2).jpeg", "mahir-yatkin.webp", (150, 515, 505, 925)),
    PortraitCrop("WhatsApp Image 2026-07-19 at 17.36.13 (2).jpeg", "mustafa-topcu.webp", (623, 515, 949, 925)),
    PortraitCrop("WhatsApp Image 2026-07-19 at 17.36.13 (3).jpeg", "omer-can-sondas.webp", (318, 537, 758, 1049)),
    PortraitCrop("WhatsApp Image 2026-07-19 at 17.36.13 (4).jpeg", "sumeyye-bektas.webp", (28, 417, 328, 769)),
    PortraitCrop("WhatsApp Image 2026-07-19 at 17.36.13 (4).jpeg", "berre-misirli-erdinli.webp", (383, 417, 683, 769)),
    PortraitCrop("WhatsApp Image 2026-07-19 at 17.36.13 (4).jpeg", "humeyra-omur-dagdeviren.webp", (752, 417, 1055, 769)),
    PortraitCrop("WhatsApp Image 2026-07-19 at 17.36.13 (4).jpeg", "ayse-sarikaya.webp", (28, 865, 328, 1214)),
    PortraitCrop("WhatsApp Image 2026-07-19 at 17.36.13 (4).jpeg", "mustafa-irfan-kutuk.webp", (383, 865, 683, 1214)),
    PortraitCrop("WhatsApp Image 2026-07-19 at 17.36.13 (4).jpeg", "nevin-varoglu.webp", (752, 865, 1055, 1214)),
    PortraitCrop("WhatsApp Image 2026-07-19 at 17.36.13 (5).jpeg", "belgin-dumanli.webp", (28, 439, 328, 790)),
    PortraitCrop("WhatsApp Image 2026-07-19 at 17.36.13 (5).jpeg", "melisa-tokmak.webp", (382, 439, 687, 790)),
    PortraitCrop("WhatsApp Image 2026-07-19 at 17.36.13 (5).jpeg", "aysan-busra-tosun.webp", (750, 439, 1053, 790)),
    PortraitCrop("WhatsApp Image 2026-07-19 at 17.36.13 (5).jpeg", "beyzanur-tinmaz.webp", (183, 895, 484, 1259)),
    PortraitCrop("WhatsApp Image 2026-07-19 at 17.36.13 (5).jpeg", "ecem-yatarkalkmaz.webp", (560, 895, 864, 1259)),
    PortraitCrop("WhatsApp Image 2026-07-19 at 17.36.14 (1).jpeg", "ayse-guler.webp", (24, 504, 351, 887)),
    PortraitCrop("WhatsApp Image 2026-07-19 at 17.36.14 (1).jpeg", "fatma-zehra-soruklu.webp", (375, 700, 705, 1079)),
    PortraitCrop("WhatsApp Image 2026-07-19 at 17.36.14 (1).jpeg", "elmas-yadigaroglu.webp", (732, 504, 1057, 887)),
    PortraitCrop("WhatsApp Image 2026-07-19 at 17.36.14 (2).jpeg", "tuncay-erdinli.webp", (24, 534, 357, 919)),
    PortraitCrop("WhatsApp Image 2026-07-19 at 17.36.14 (2).jpeg", "kader-danismaz.webp", (376, 774, 706, 1161)),
    PortraitCrop("WhatsApp Image 2026-07-19 at 17.36.14 (2).jpeg", "nazmiye-aksu.webp", (735, 534, 1055, 919)),
    PortraitCrop("WhatsApp Image 2026-07-19 at 17.36.13.jpeg", "saime-naime-ezber.webp", (24, 506, 343, 876)),
    PortraitCrop("WhatsApp Image 2026-07-19 at 17.36.13.jpeg", "fatma-gul-genc-tufek.webp", (377, 645, 730, 1014)),
    PortraitCrop("WhatsApp Image 2026-07-19 at 17.36.13.jpeg", "esra-yavuz.webp", (739, 506, 1054, 876)),
    PortraitCrop("WhatsApp Image 2026-07-19 at 17.36.14 (3).jpeg", "ferdi-elbasi.webp", (113, 404, 371, 702)),
    PortraitCrop("WhatsApp Image 2026-07-19 at 17.36.14 (3).jpeg", "busra-tok.webp", (413, 404, 668, 711)),
    PortraitCrop("WhatsApp Image 2026-07-19 at 17.36.14 (3).jpeg", "rukiye-gulcan.webp", (713, 404, 966, 702)),
    PortraitCrop("WhatsApp Image 2026-07-19 at 17.36.14 (3).jpeg", "busra-ozturk.webp", (15, 856, 261, 1136)),
    PortraitCrop("WhatsApp Image 2026-07-19 at 17.36.14 (3).jpeg", "pinar-cakmak.webp", (278, 794, 526, 1095)),
    PortraitCrop("WhatsApp Image 2026-07-19 at 17.36.14 (3).jpeg", "kader-aslan.webp", (547, 835, 792, 1137)),
    PortraitCrop("WhatsApp Image 2026-07-19 at 17.36.14 (3).jpeg", "beyzanur-atsan-guldekal.webp", (811, 795, 1065, 1095)),
    PortraitCrop("WhatsApp Image 2026-07-19 at 17.36.14.jpeg", "rumeysa-guney.webp", (26, 505, 343, 876)),
    PortraitCrop("WhatsApp Image 2026-07-19 at 17.36.14.jpeg", "melike-demirbag.webp", (371, 665, 707, 1058)),
    PortraitCrop("WhatsApp Image 2026-07-19 at 17.36.14.jpeg", "mihriban-celik.webp", (738, 505, 1056, 876)),
    PortraitCrop("WhatsApp Image 2026-07-19 at 17.36.13 (1).jpeg", "zeynep-bozdemir.webp", (151, 516, 503, 925)),
    PortraitCrop("WhatsApp Image 2026-07-19 at 17.36.13 (1).jpeg", "irem-keskin.webp", (585, 516, 936, 925)),
)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-dir", type=Path, required=True)
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path("public/uploads/staff"),
    )
    parser.add_argument("--contact-sheet", type=Path)
    args = parser.parse_args()

    args.output_dir.mkdir(parents=True, exist_ok=True)
    opened_images: dict[Path, Image.Image] = {}

    try:
        for portrait in PORTRAITS:
            source_path = args.source_dir / portrait.source
            if source_path not in opened_images:
                opened_images[source_path] = Image.open(source_path).convert("RGB")

            cropped = opened_images[source_path].crop(portrait.box)
            normalized = ImageOps.fit(
                cropped,
                (400, 500),
                method=Image.Resampling.LANCZOS,
                centering=(0.5, 0.5),
            )
            normalized.save(
                args.output_dir / portrait.output,
                "WEBP",
                quality=90,
                method=6,
            )
    finally:
        for image in opened_images.values():
            image.close()

    if args.contact_sheet:
        args.contact_sheet.parent.mkdir(parents=True, exist_ok=True)
        thumb_width, thumb_height, label_height = 160, 200, 32
        columns = 5
        rows = (len(PORTRAITS) + columns - 1) // columns
        sheet = Image.new("RGB", (columns * thumb_width, rows * (thumb_height + label_height)), "white")
        draw = ImageDraw.Draw(sheet)
        for index, portrait in enumerate(PORTRAITS):
            with Image.open(args.output_dir / portrait.output) as prepared:
                thumbnail = prepared.resize((thumb_width, thumb_height), Image.Resampling.LANCZOS)
                x = (index % columns) * thumb_width
                y = (index // columns) * (thumb_height + label_height)
                sheet.paste(thumbnail, (x, y))
                draw.text((x + 5, y + thumb_height + 7), portrait.output.removesuffix(".webp"), fill="#11142b")
        sheet.save(args.contact_sheet, "JPEG", quality=90)

    print(f"Prepared {len(PORTRAITS)} staff portraits in {args.output_dir}")


if __name__ == "__main__":
    main()
