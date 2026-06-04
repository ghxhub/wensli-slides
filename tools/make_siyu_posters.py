from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
POSTER_DIR = ROOT / "output" / "poster"

FONT_SANS = Path("C:/Windows/Fonts/NotoSansSC-VF.ttf")
FONT_SERIF = Path("C:/Windows/Fonts/NotoSerifSC-VF.ttf")
FONT_SANS_BOLD = Path("C:/Windows/Fonts/msyhbd.ttc")


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size=size)


def add_vignette(img: Image.Image, color: tuple[int, int, int], alpha: int = 160) -> Image.Image:
    w, h = img.size
    overlay = Image.new("RGBA", img.size, color + (0,))
    mask = Image.new("L", img.size, 0)
    draw = ImageDraw.Draw(mask)
    margin = int(min(w, h) * 0.05)
    draw.rectangle((margin, margin, w - margin, h - margin), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(int(min(w, h) * 0.22)))
    inv = Image.eval(mask, lambda p: int((255 - p) * alpha / 255))
    overlay.putalpha(inv)
    return Image.alpha_composite(img.convert("RGBA"), overlay)


def linear_gradient(size: tuple[int, int], stops: list[tuple[float, tuple[int, int, int, int]]], horizontal: bool) -> Image.Image:
    w, h = size
    grad = Image.new("RGBA", size)
    pix = grad.load()
    length = w if horizontal else h
    stops = sorted(stops, key=lambda x: x[0])
    for i in range(length):
        t = i / max(1, length - 1)
        left = stops[0]
        right = stops[-1]
        for a, b in zip(stops, stops[1:]):
            if a[0] <= t <= b[0]:
                left, right = a, b
                break
        span = max(0.0001, right[0] - left[0])
        local = min(1, max(0, (t - left[0]) / span))
        col = tuple(int(left[1][j] + (right[1][j] - left[1][j]) * local) for j in range(4))
        if horizontal:
            for y in range(h):
                pix[i, y] = col
        else:
            for x in range(w):
                pix[x, i] = col
    return grad


def rounded_rect(
    draw: ImageDraw.ImageDraw,
    box: tuple[int, int, int, int],
    radius: int,
    fill: tuple[int, int, int, int],
    outline: tuple[int, int, int, int] | None = None,
    width: int = 1,
) -> None:
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def draw_text(
    draw: ImageDraw.ImageDraw,
    xy: tuple[int, int],
    text: str,
    fnt: ImageFont.FreeTypeFont,
    fill: tuple[int, int, int, int] | tuple[int, int, int],
    spacing: int = 4,
    anchor: str | None = None,
) -> None:
    draw.multiline_text(xy, text, font=fnt, fill=fill, spacing=spacing, anchor=anchor)


def fit_text(
    draw: ImageDraw.ImageDraw,
    text: str,
    font_path: Path,
    max_width: int,
    start_size: int,
    min_size: int,
) -> ImageFont.FreeTypeFont:
    size = start_size
    while size >= min_size:
        candidate = font(font_path, size)
        if draw.textbbox((0, 0), text, font=candidate)[2] <= max_width:
            return candidate
        size -= 2
    return font(font_path, min_size)


def draw_feature_icon(draw: ImageDraw.ImageDraw, center: tuple[int, int], kind: str, color: tuple[int, int, int, int]) -> None:
    x, y = center
    if kind == "chat":
        draw.rounded_rectangle((x - 16, y - 12, x + 16, y + 10), radius=5, outline=color, width=3)
        draw.line((x - 5, y + 10, x - 13, y + 18), fill=color, width=3)
        draw.line((x - 7, y - 3, x + 8, y - 3), fill=color, width=2)
        draw.line((x - 7, y + 4, x + 12, y + 4), fill=color, width=2)
    elif kind == "gift":
        draw.rectangle((x - 17, y - 7, x + 17, y + 18), outline=color, width=3)
        draw.rectangle((x - 20, y - 15, x + 20, y - 6), outline=color, width=3)
        draw.line((x, y - 15, x, y + 18), fill=color, width=3)
        draw.arc((x - 20, y - 28, x, y - 4), start=300, end=80, fill=color, width=3)
        draw.arc((x, y - 28, x + 20, y - 4), start=100, end=240, fill=color, width=3)
    elif kind == "ppt":
        draw.rectangle((x - 15, y - 20, x + 16, y + 20), outline=color, width=3)
        draw.line((x + 4, y - 20, x + 16, y - 8), fill=color, width=3)
        draw.line((x + 4, y - 20, x + 4, y - 8), fill=color, width=3)
        draw.line((x + 4, y - 8, x + 16, y - 8), fill=color, width=3)
        draw_text(draw, (x - 11, y - 2), "PPT", font(FONT_SANS_BOLD, 11), color)
    elif kind == "share":
        pts = [(x - 20, y - 12), (x + 20, y - 22), (x + 8, y + 20), (x - 2, y + 3)]
        draw.line(pts + [pts[0]], fill=color, width=3)
        draw.line((x - 2, y + 3, x + 20, y - 22), fill=color, width=3)


def clean_dark() -> None:
    src = Image.open(POSTER_DIR / "ai-guide-poster-scarf-v2.png").convert("RGB")
    img = src.convert("RGBA")
    w, h = img.size
    draw = ImageDraw.Draw(img)

    # Rebuild the left reading field so old generated text cannot show through.
    left_panel = linear_gradient(
        (int(w * 0.59), h),
        [
            (0.0, (3, 38, 37, 252)),
            (0.76, (4, 42, 40, 246)),
            (1.0, (4, 42, 40, 120)),
        ],
        horizontal=True,
    )
    img.alpha_composite(left_panel, (0, 0))
    # Solid inner copy surface for maximum legibility.
    copy_surface = Image.new("RGBA", (int(w * 0.52), 675), (3, 38, 37, 248))
    fade_edge = linear_gradient(
        (150, 675),
        [(0.0, (3, 38, 37, 0)), (1.0, (3, 38, 37, 248))],
        horizontal=True,
    ).transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    img.alpha_composite(copy_surface, (0, 35))
    img.alpha_composite(fade_edge, (int(w * 0.52), 35))
    bridge = Image.new("RGBA", (170, 675), (3, 38, 37, 0))
    bmask = Image.new("L", bridge.size, 0)
    bdraw = ImageDraw.Draw(bmask)
    bdraw.rectangle((0, 0, 120, 675), fill=120)
    bmask = bmask.filter(ImageFilter.GaussianBlur(55))
    bridge.putalpha(bmask)
    img.alpha_composite(bridge, (int(w * 0.48), 35))
    bottom_panel = linear_gradient(
        (w, int(h * 0.18)),
        [(0.0, (4, 38, 37, 0)), (1.0, (4, 38, 37, 210))],
        horizontal=False,
    )
    img.alpha_composite(bottom_panel, (0, int(h * 0.82)))
    img = add_vignette(img, (2, 19, 20), alpha=105)
    draw = ImageDraw.Draw(img)

    gold = (225, 185, 125, 255)
    light_gold = (255, 222, 173, 255)
    ivory = (247, 239, 222, 255)
    muted = (204, 220, 211, 225)
    teal = (19, 90, 86, 210)

    draw_text(draw, (62, 72), "丝语礼选", font(FONT_SERIF, 48), light_gold)
    draw.line((62, 134, 244, 134), fill=(225, 185, 125, 170), width=2)
    draw_text(draw, (62, 162), "AI 驱动的丝巾礼赠顾问", font(FONT_SANS, 26), ivory)

    title_font = fit_text(draw, "AI 智能导购", FONT_SERIF, 500, 94, 70)
    draw_text(draw, (60, 222), "AI 智能导购", title_font, light_gold)
    draw_text(draw, (66, 330), "一键导出图文版 PPT", font(FONT_SANS_BOLD, 40), ivory)
    draw.line((66, 392, 438, 392), fill=(225, 185, 125, 180), width=2)

    body = "面向丝巾、礼盒与商务赠礼场景，\n把 AI 推荐、商品筛选与方案导出，\n串成更顺手的客户沟通。"
    draw_text(draw, (68, 428), body, font(FONT_SANS, 27), muted, spacing=12)

    card = (66, 560, 514, 650)
    rounded_rect(draw, card, 20, fill=(10, 58, 55, 170), outline=(225, 185, 125, 130), width=2)
    draw_feature_icon(draw, (112, 605), "ppt", gold)
    draw_text(draw, (154, 579), "PPT 文案导出", font(FONT_SANS_BOLD, 30), light_gold)
    draw_text(draw, (154, 620), "卖点生成 / 商品搭配 / 演示内容", font(FONT_SANS, 18), muted)

    features = [
        ("chat", "AI 对话推荐", "按预算、场景与人群快速给建议"),
        ("gift", "礼品智能筛选", "丝巾、礼盒、配饰一站式匹配"),
        ("share", "分享跟进", "方案导出后继续推进转化"),
    ]
    y = 710
    for kind, title, desc in features:
        draw_feature_icon(draw, (90, y + 21), kind, gold)
        draw_text(draw, (126, y), title, font(FONT_SANS_BOLD, 24), ivory)
        draw_text(draw, (126, y + 34), desc, font(FONT_SANS, 17), muted)
        y += 72

    rounded_rect(draw, (58, 920, 966, 984), 26, fill=(6, 45, 43, 150), outline=(225, 185, 125, 100), width=1)
    bottom = [
        ("时尚配饰全品类", "围巾 / 丝巾 / 配饰"),
        ("数据驱动选品", "洞察趋势  提升转化"),
        ("场景化营销", "多场景推荐  精准触达"),
        ("专属智能助手", "懂时尚  更懂生意"),
    ]
    x_positions = [115, 342, 570, 800]
    for x, (a, b) in zip(x_positions, bottom):
        draw_text(draw, (x, 936), a, font(FONT_SANS_BOLD, 18), ivory, anchor="ma")
        draw_text(draw, (x, 963), b, font(FONT_SANS, 13), muted, anchor="ma")

    out = POSTER_DIR / "siyu-lixuan-poster-dark-kv.png"
    img.convert("RGB").save(out, quality=96)


def clean_light() -> None:
    src = Image.open(POSTER_DIR / "wensli-promo-poster-clean-v2.png").convert("RGB")
    img = src.convert("RGBA")
    w, h = img.size
    draw = ImageDraw.Draw(img)

    # Rebuild the copy zones with clean warm silk fields and keep the scarf-dominant right side.
    top_field = linear_gradient(
        (int(w * 0.62), 700),
        [
            (0.0, (251, 247, 237, 255)),
            (0.82, (251, 247, 237, 248)),
            (1.0, (251, 247, 237, 60)),
        ],
        horizontal=True,
    )
    img.alpha_composite(top_field, (0, 0))
    copy_surface = Image.new("RGBA", (520, 660), (251, 247, 237, 252))
    fade_edge = linear_gradient(
        (100, 660),
        [(0.0, (251, 247, 237, 252)), (1.0, (251, 247, 237, 0))],
        horizontal=True,
    )
    img.alpha_composite(copy_surface, (0, 56))
    img.alpha_composite(fade_edge, (520, 56))
    cleanup = Image.new("RGBA", (250, 300), (251, 247, 237, 0))
    cmask = Image.new("L", cleanup.size, 0)
    cdraw = ImageDraw.Draw(cmask)
    cdraw.rectangle((0, 0, 190, 300), fill=255)
    cmask = cmask.filter(ImageFilter.GaussianBlur(30))
    cleanup.putalpha(cmask)
    img.alpha_composite(cleanup, (462, 260))
    bottom_field = linear_gradient(
        (w, 500),
        [(0.0, (251, 247, 237, 230)), (1.0, (251, 247, 237, 255))],
        horizontal=False,
    )
    img.alpha_composite(bottom_field, (0, h - 500))
    draw = ImageDraw.Draw(img)

    navy = (20, 35, 58, 255)
    gold = (181, 135, 67, 255)
    soft_gold = (202, 162, 99, 230)
    body_col = (66, 69, 72, 245)

    draw_text(draw, (60, 86), "丝语礼选", font(FONT_SERIF, 46), gold)
    draw_text(draw, (62, 140), "小程序 · 丝巾礼赠智能助手", font(FONT_SANS, 20), soft_gold)
    draw.line((62, 178, 266, 178), fill=(202, 162, 99, 150), width=2)

    draw_text(draw, (58, 235), "AI 智能导购", font(FONT_SERIF, 73), navy)
    draw_text(draw, (60, 334), "一键导出图文版 PPT", font(FONT_SANS_BOLD, 43), navy)
    draw.line((60, 414, 428, 414), fill=(181, 135, 67, 155), width=2)
    draw_text(
        draw,
        (62, 452),
        "面向丝巾、礼盒与商务赠礼场景，\n把 AI 推荐、商品筛选与方案导出，\n串成更顺手的客户沟通。",
        font(FONT_SANS, 27),
        body_col,
        spacing=13,
    )

    rounded_rect(draw, (58, 1186, w - 58, 1438), 28, fill=(255, 252, 244, 210), outline=(210, 176, 117, 120), width=1)
    features = [
        ("chat", "AI 对话推荐"),
        ("gift", "商品智能筛选"),
        ("ppt", "图文版 PPT 导出"),
        ("share", "分享跟进更顺畅"),
    ]
    col_w = (w - 116) / 4
    for i, (kind, label) in enumerate(features):
        cx = int(58 + col_w * i + col_w / 2)
        cy = 1268
        draw.ellipse((cx - 38, cy - 38, cx + 38, cy + 38), outline=(202, 162, 99, 150), width=2, fill=(255, 252, 244, 150))
        draw_feature_icon(draw, (cx, cy), kind, (181, 135, 67, 255))
        label_font = fit_text(draw, label, FONT_SANS, int(col_w - 16), 22, 16)
        draw_text(draw, (cx, 1342), label, label_font, navy, anchor="ma")
        draw.line((cx - 18, 1388, cx + 18, 1388), fill=(181, 135, 67, 190), width=3)
        if i:
            x = int(58 + col_w * i)
            draw.line((x, 1235, x, 1408), fill=(202, 162, 99, 90), width=1)

    draw.line((155, 1518, w - 155, 1518), fill=(202, 162, 99, 130), width=1)
    draw_text(draw, (w // 2, 1552), "让每一次推荐，都成为更好的连接", font(FONT_SANS, 20), soft_gold, anchor="ma")
    draw_text(draw, (w // 2, 1595), "匠心丝绸 · 智慧相伴", font(FONT_SANS, 20), soft_gold, anchor="ma")

    out = POSTER_DIR / "siyu-lixuan-poster-light-elegant.png"
    img.convert("RGB").save(out, quality=96)


def main() -> None:
    clean_dark()
    clean_light()


if __name__ == "__main__":
    main()
